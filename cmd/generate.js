import { parse } from "parse5";
import { createWriteStream } from "fs";
import { readFile } from "fs/promises";

export default async (src, dst) => {
  if (!src) {
    throw new Error("input file missing");
  }
  const writer = dst ? createWriteStream(dst) : process.stdout;
  const doc = parse(await readFile(src, "utf8"));

  const globalProperties = find(doc, (n) =>
    hasAttr(n, "id", "global-properties")
  );
  const globalPropertiesTable = find(globalProperties, (n) =>
    hasAttr(n, "class", "developer_docs--propTable--1J4hJ")
  );

  writer.write(renderInterface(parsePropTable(globalPropertiesTable)));

  const nodeTypes = where(
    find(doc, (n) => hasAttr(n, "id", "node-types")),
    (n) => hasAttr(n, "id", /-props$/)
  );

  for (const nodeTypeTable of nodeTypes) {
    writer.write(
      renderInterface(
        parsePropTable(nodeTypeTable, {
          transformName: (name) => pascalCase(name) + "Node",
          inheritence: "Node",
        })
      )
    );
  }

  const propertyTypesTable = find(doc, (n) => hasAttr(n, "id", "files-types"));
  const propertyTypes = where(propertyTypesTable, (n) =>
    hasAttr(n, "id", /-type$/)
  );

  for (const propertyType of propertyTypes) {
    writer.write(renderType(parsePropTable(propertyType)));
  }
};

//

function renderInterface(node) {
  let str = `interface ${node.name}`;
  if (node.fields?.[0]?.type === "inheritence") {
    str += ` extends ${node.fields[0].name} {`;
  } else {
    str += " {";
  }
  str += "\n";

  for (let field of node.fields) {
    if (field.type === "inheritence") {
      continue;
    }
    if (field.comments) {
      for (let cs of field.comments) {
        cs.split(/\n/).forEach((c) => {
          c = c.trim();
          if (!c) return;
          str += `\t// ${c}`;
          str += "\n";
        });
      }
    }
    str += `\t${field.name}`;
    if (field.optional) {
      str += "?";
    }
    str += `: ${field.type};`;
    str += "\n";
  }

  str += "}";
  str += "\n";
  return str;
}

function renderType(node) {
  // TRANSFORM edge case
  if (node.name === "Transform") {
    return `type Transform = [[number, number, number], [number, number, number]];\n`;
  }
  let str = `type ${node.name} = `;

  if (node.fields?.length === 1 && node.fields[0].enums?.length) {
    str += node.fields[0].enums.map((e) => `"${getText(e)}"`).join(" | ") + ";";
    str += "\n";
    return str;
  }

  if (node.fields?.[0]?.type === "inheritence") {
    str += ` & ${node.fields[0].name} {`;
  } else {
    str += " {";
  }
  str += "\n";

  for (let field of node.fields) {
    if (field.type === "inheritence") {
      continue;
    }
    if (field.comments) {
      for (let cs of field.comments) {
        cs.split(/\n/).forEach((c) => {
          c = c.trim();
          if (!c) return;
          str += `\t// ${c}`;
          str += "\n";
        });
      }
    }
    str += `\t${field.name}`;
    if (field.optional) {
      str += "?";
    }
    str += `: ${field.type};`;
    str += "\n";
  }

  str += "}";
  str += "\n";
  return str;
}

//

function parsePropTable(t, opts) {
  let name = getText(
    find(t, (n) => hasAttr(n, "class", "format--mono--3pkKT"))
  );
  name = opts?.transformName ? opts?.transformName(name) : name;

  let fields = where(t, (n) =>
    hasAttr(n, "class", "developer_docs--propField--1r9AO")
  )
    .map((f) => parseField(f))
    .filter((f) => !!f);

  if (fields?.[0].type === "inheritence" && opts?.transformName) {
    fields[0].name = opts.transformName(fields?.[0].name);
  }

  if (opts?.inheritence && fields?.[0].type !== "inheritence") {
    fields.unshift({ name: opts?.inheritence, type: "inheritence" });
  }

  return { name, fields };
}

function parseField(f) {
  let name = getText(
    find(
      find(f, (n) => hasAttr(n, "class", "developer_docs--monoDisplay--3W4Zj")),
      (n) => hasAttr(n, "class", "format--mono--3pkKT")
    )
  );
  let type = getText(
    find(f, (n) => hasAttr(n, "class", "format--type--VIwo1"))
  );
  let defaults = getText(
    find(f, (n) =>
      hasAttr(n, "class", "developer_docs--defaultsDisplay--3Zy6K")
    )
  );
  let docs = find(f, (n) =>
    hasAttr(n, "class", "developer_docs--propDesc--16eOE")
  );
  // let constraints = find(f, n => hasAttr(n, "class", "developer_docs--constraints--3V_MG"))
  let enums = where(f, (n) => hasAttr(n, "class", "format--string--mGamT"));

  if (!name) {
    let exts = getText(
      find(docs, (n) => hasAttr(n, "class", "format--literal--1UoNf"))
    );
    if (!exts) {
      if (process.env.DEBUG) {
        console.warn("cannot parse field of :" + getText(f));
      }
      return enums.length ? { enums } : null;
    }
    return { name: exts, type: "inheritence" };
  }

  return {
    name,
    type: normalizeType(type),
    optional: !!defaults,
    comments: [getText(docs), defaults].filter((s) => !!s),
    enums: enums.map((e) => getText(e)),
  };
}
function normalizeType(t) {
  return t.replace(/String|Number|Boolean|Any/, (s) => s.toLowerCase());
}

function find(node, cb) {
  if (cb(node)) {
    return node;
  }
  if (node?.childNodes) {
    let f;
    for (const child of node.childNodes) {
      f = find(child, cb);
      if (f) return f;
    }
  }
}

function* findAll(node, cb) {
  if (!node) return;
  if (cb(node)) {
    yield node;
  }
  if (node?.childNodes) {
    for (const child of node.childNodes) {
      yield* findAll(child, cb);
    }
  }
}

function where(node, cb) {
  if (!node) return;
  return Array.from(findAll(node, cb));
}

function hasAttr(node, name, value) {
  if (!node) return;
  return !!node.attrs?.find((a) => a.name === name && a.value.match(value));
}

function getText(node) {
  if (!node) return;
  return find(node, (n) => n.nodeName === "#text")?.value;
}

function pascalCase(str) {
  return str
    .toLowerCase()
    .replace(/_(\w)/g, (_, s) => s.toUpperCase())
    .replace(/^(\w)/, (_, s) => s.toUpperCase());
}
