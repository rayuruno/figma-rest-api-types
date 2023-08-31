import { parse } from "parse5";

export default async (input) => {
  const doc = parse(input);

  const output = [];

  const globalProperties = find(doc, (n) =>
    hasAttr(n, "id", "global-properties")
  );

  const globalPropertiesTable = find(globalProperties, (n) =>
    hasAttr(n, "class", /^developer_docs--propTable--/)
  );

  output.push(renderInterface(parsePropTable(globalPropertiesTable)));

  const nodeTypes = where(
    find(doc, (n) => hasAttr(n, "id", "node-types")),
    (n) => hasAttr(n, "id", /-props$/)
  );

  for (const nodeTypeTable of nodeTypes) {
    output.push(
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
  ).map((t) => parsePropTable(t));
  const extraTypes = [];

  for (const propertyType of propertyTypes) {
    output.push(renderType(propertyType, extraTypes));
  }

  for (const propertyType of extraTypes) {
    if (!propertyTypes.find((t) => t.name === propertyType.name)) {
      output.push(renderType(propertyType));
    }
  }

  // missing types
  output.push(
    `type Path = {\n\twindingRule: "NONZERO" | "EVENODD";\n\tpath: string;\n};`,
    "type CornerRadius = number[];"
  );

  return output.join("\n") + "\n";
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

function renderType(node, extraTypes) {
  // edge cases
  switch (node.name) {
    case "Transform":
      return `type Transform = [[number, number, number], [number, number, number]];\n`;
  }

  let str = `type ${node.name} = `;

  if (node.fields?.length === 1 && node.fields[0].enums?.length) {
    str +=
      node.fields[0].enums.map((e) => `"${getText(e) || e}"`).join(" | ") + ";";
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

    let typ = field.type;

    if (field.enums?.length) {
      if (field.type.match(/string|number|boolean|any/i)) {
        typ = field.enums.map((e) => `"${e}"`).join(" | ");
      } else {
        extraTypes.push({
          name: typ,
          fields: [{ enums: field.enums }],
        });
      }
    }

    str += `: ${typ};`;
    str += "\n";
  }

  str += "}";
  str += "\n";
  return str;
}

//

function parsePropTable(t, opts) {
  let name = getText(
    find(t, (n) => hasAttr(n, "class", /^format--mono--/))
  );
  name = opts?.transformName ? opts?.transformName(name) : name;

  let fields = (where(t, (n) =>
    hasAttr(n, "class", /^developer_docs--propField--/)
  ) || [])
    .map((f) => parseField(f))
    .filter((f) => !!f);

  if (fields?.[0]?.type === "inheritence" && opts?.transformName) {
    fields[0].name = opts.transformName(fields?.[0].name);
  }

  if (opts?.inheritence && fields?.[0].type !== "inheritence") {
    fields.unshift({ name: opts?.inheritence, type: "inheritence" });
  }

  fields = fields.filter(
    (f, i, a) => !a.slice(i + 1).find((o) => f.name === o.name)
  );

  return { name, fields };
}

function parseField(f) {
  let name = getText(
    find(
      find(f, (n) => hasAttr(n, "class", /^developer_docs--monoDisplay--/)),
      (n) => hasAttr(n, "class", /^format--mono--/)
    )
  );
  let type = getText(
    find(f, (n) => hasAttr(n, "class", /^format--type--/))
  );
  let defaults = getText(
    find(f, (n) =>
      hasAttr(n, "class", /^developer_docs--defaultsDisplay/)
    )
  );
  let docs = find(f, (n) =>
    hasAttr(n, "class", /^developer_docs--propDesc--/)
  );
  // let constraints = find(f, n => hasAttr(n, "class", "developer_docs--constraints--3V_MG"))
  let enums = where(f, (n) => hasAttr(n, "class", /^format--string--/));

  if (!name) {
    let exts = getText(
      find(docs, (n) => hasAttr(n, "class", /^format--literal--/))
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
  return t
    .replace(/String|Number|Boolean|Any/g, (s) => s.toLowerCase())
    .replace("Map<", "Record<");
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
