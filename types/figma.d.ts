interface Node {
	// A string uniquely identifying this node within the document.
	id: string;
	// The name given to the node by the user in the tool.
	name: string;
	// Whether or not the node is visible on the canvas.
	// default: true
	visible?: boolean;
	// The type of the node, refer to table below for details.
	type: string;
	// Data written by plugins that is visible only to the plugin that wrote it. Requires the `pluginData` to include the ID of the plugin.
	pluginData: any;
	// Data written by plugins that is visible to all plugins. Requires the `pluginData` parameter to include the string "shared".
	sharedPluginData: any;
}

interface DocumentNode extends Node {
	// An array of canvases attached to the document
	children: Node[];
}

interface CanvasNode extends Node {
	// An array of top level layers on the canvas
	children: Node[];
	// Background color of the canvas.
	backgroundColor: Color;
	// [DEPRECATED] Node ID that corresponds to the start frame for prototypes. This is deprecated with the introduction of multiple flows. Please use the flowStartingPoints field.
	prototypeStartNodeID: string;
	// A array of flow starting points sorted by its position in the prototype settings panel.
	// default: []
	flowStartingPoints?: FlowStartingPoint[];
	// An array of export settings representing images to export from the canvas
	// default: []
	exportSettings?: ExportSetting[];
}

interface FrameNode extends Node {
	// An array of nodes that are direct children of this node
	children: Node[];
	// If true, layer is locked and cannot be edited
	// default: false
	locked?: boolean;
	// [DEPRECATED] Background of the node. This is deprecated, as backgrounds for frames are now in the fills field.
	background: Paint[];
	// [DEPRECATED] Background color of the node. This is deprecated, as frames now support more than a solid color as a background. Please use the fills field instead.
	backgroundColor: Color;
	// An array of fill paints applied to the node
	// default: []
	fills?: Paint[];
	// An array of stroke paints applied to the node
	// default: []
	strokes?: Paint[];
	// The weight of strokes on the node
	strokeWeight: number;
	// Position of stroke relative to vector outline, as a string enum
	strokeAlign: string;
	// Radius of each corner of the frame if a single radius is set for all corners
	cornerRadius: number;
	// Array of length 4 of the radius of each corner of the frame, starting in the top left and proceeding clockwise
	// default: same as cornerRadius
	rectangleCornerRadii?: number[];
	// An array of export settings representing images to export from the node
	// default: []
	exportSettings?: ExportSetting[];
	// How this node blends with nodes behind it in the scene (see blend mode section for more details)
	blendMode: BlendMode;
	// Keep height and width constrained to same ratio
	// default: false
	preserveRatio?: boolean;
	// Horizontal and vertical layout constraints for node
	constraints: LayoutConstraint;
	// Determines if the layer should stretch along the parent’s counter axis. This property is only provided for direct children of auto-layout frames.
	layoutAlign: string;
	// Node ID of node to transition to in prototyping
	// default: null
	transitionNodeID?: string;
	// The duration of the prototyping transition on this node (in milliseconds)
	// default: null
	transitionDuration?: number;
	// The easing curve used in the prototyping transition on this node
	// default: null
	transitionEasing?: EasingType;
	// Opacity of the node
	// default: 1
	opacity?: number;
	// Bounding box of the node in absolute space coordinates
	absoluteBoundingBox: Rectangle;
	// Width and height of element. This is different from the width and height of the bounding box in that the absolute bounding box represents the element after scaling and rotation. Only present if geometry=paths is passed
	size: Vector;
	// The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
	relativeTransform: Transform;
	// Whether or not this node clip content outside of its bounds
	clipsContent: boolean;
	// Whether this layer uses auto-layout to position its children.
	// default: NONE
	layoutMode?: string;
	// Whether the primary axis has a fixed length (determined by the user) or an automatic length (determined by the layout engine). This property is only applicable for auto-layout frames.
	// default: AUTO
	primaryAxisSizingMode?: string;
	// Whether the counter axis has a fixed length (determined by the user) or an automatic length (determined by the layout engine). This property is only applicable for auto-layout frames.
	// default: AUTO
	counterAxisSizingMode?: string;
	// Determines how the auto-layout frame’s children should be aligned in the primary axis direction. This property is only applicable for auto-layout frames.
	// default: MIN
	primaryAxisAlignItems?: string;
	// Determines how the auto-layout frame’s children should be aligned in the counter axis direction. This property is only applicable for auto-layout frames.
	// default: MIN
	counterAxisAlignItems?: string;
	// The padding between the left border of the frame and its children. This property is only applicable for auto-layout frames.
	// default: 0
	paddingLeft?: number;
	// The padding between the right border of the frame and its children. This property is only applicable for auto-layout frames.
	// default: 0
	paddingRight?: number;
	// The padding between the top border of the frame and its children. This property is only applicable for auto-layout frames.
	// default: 0
	paddingTop?: number;
	// The padding between the bottom border of the frame and its children. This property is only applicable for auto-layout frames.
	// default: 0
	paddingBottom?: number;
	// The horizontal padding between the borders of the frame and its children. This property is only applicable for auto-layout frames. Deprecated in favor of setting individual paddings.
	// default: 0
	horizontalPadding?: number;
	// The vertical padding between the borders of the frame and its children. This property is only applicable for auto-layout frames. Deprecated in favor of setting individual paddings.
	// default: 0
	verticalPadding?: number;
	// The distance between children of the frame. This property is only applicable for auto-layout frames.
	// default: 0
	itemSpacing?: number;
	// default: []
	layoutGrids: LayoutGrid[];
	// Defines the scrolling behavior of the frame, if there exist contents outside of the frame boundaries. The frame can either scroll vertically, horizontally, or in both directions to the extents of the content contained within it. This behavior can be observed in a prototype.
	// default: NONE
	overflowDirection?: string;
	// An array of effects attached to this node (see effects section for more details)
	// default: []
	effects?: Effect[];
	// Does this node mask sibling nodes in front of it?
	// default: false
	isMask?: boolean;
	// Does this mask ignore fill style (like gradients) and effects?
	// default: false
	isMaskOutline?: boolean;
}

interface GroupNode extends FrameNode {
}

interface VectorNode extends Node {
	// If true, layer is locked and cannot be edited
	// default: false
	locked?: boolean;
	// An array of export settings representing images to export from the node
	// default: []
	exportSettings?: ExportSetting[];
	// How this node blends with nodes behind it in the scene (see blend mode section for more details)
	blendMode: BlendMode;
	// Keep height and width constrained to same ratio
	// default: false
	preserveRatio?: boolean;
	// Determines if the layer should stretch along the parent’s counter axis. This property is only provided for direct children of auto-layout frames.
	layoutAlign: string;
	// This property is applicable only for direct children of auto-layout frames, ignored otherwise. Determines whether a layer should stretch along the parent’s primary axis. A 0 corresponds to a fixed size and 1 corresponds to stretch
	// default: 0
	layoutGrow?: number;
	// Horizontal and vertical layout constraints for node
	constraints: LayoutConstraint;
	// Node ID of node to transition to in prototyping
	// default: null
	transitionNodeID?: string;
	// The duration of the prototyping transition on this node (in milliseconds)
	// default: null
	transitionDuration?: number;
	// The easing curve used in the prototyping transition on this node
	// default: null
	transitionEasing?: EasingType;
	// Opacity of the node
	// default: 1
	opacity?: number;
	// Bounding box of the node in absolute space coordinates
	absoluteBoundingBox: Rectangle;
	// An array of effects attached to this node (see effects section for more details)
	// default: []
	effects?: Effect[];
	// Width and height of element. This is different from the width and height of the bounding box in that the absolute bounding box represents the element after scaling and rotation. Only present if geometry=paths is passed
	size: Vector;
	// The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
	relativeTransform: Transform;
	// Does this node mask sibling nodes in front of it?
	// default: false
	isMask?: boolean;
	// An array of fill paints applied to the node
	// default: []
	fills?: Paint[];
	// Only specified if parameter geometry=paths is used. An array of paths representing the object fill
	fillGeometry: Path[];
	// An array of stroke paints applied to the node
	// default: []
	strokes?: Paint[];
	// The weight of strokes on the node
	strokeWeight: number;
	// A string enum with value of "NONE", "ROUND", "SQUARE", "LINE_ARROW", or "TRIANGLE_ARROW", describing the end caps of vector paths.
	// default: "NONE"
	strokeCap?: string;
	// A string enum with value of "MITER", "BEVEL", or "ROUND", describing how corners in vector paths are rendered.
	// default: "MITER"
	strokeJoin?: string;
	// An array of floating point numbers describing the pattern of dash length and gap lengths that the vector path follows. For example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
	// default: []
	strokeDashes?: number[];
	// Only valid if strokeJoin is "MITER". The corner angle, in degrees, below which strokeJoin will be set to "BEVEL" to avoid super sharp corners. By default this is 28.96 degrees.
	// default: 28.96
	strokeMiterAngle?: number;
	// Only specified if parameter geometry=paths is used. An array of paths representing the object stroke
	strokeGeometry: Path[];
	// Position of stroke relative to vector outline, as a string enum
	strokeAlign: string;
	// A mapping of a StyleType to style ID (see
	styles: Record<StyleType, string>;
}

interface BooleanOperationNode extends VectorNode {
	// An array of nodes that are being boolean operated on
	children: Node[];
	// A string enum with value of "UNION", "INTERSECT", "SUBTRACT", or "EXCLUDE" indicating the type of boolean operation applied
	booleanOperation: string;
}

interface StarNode extends VectorNode {
}

interface LineNode extends VectorNode {
}

interface EllipseNode extends VectorNode {
	// Start and end angles of the ellipse measured clockwise from the x axis, plus the inner radius for donuts
	arcData: ArcData;
}

interface RegularPolygonNode extends VectorNode {
}

interface RectangleNode extends VectorNode {
	// Radius of each corner of the rectangle if a single radius is set for all corners
	cornerRadius: number;
	// Array of length 4 of the radius of each corner of the rectangle, starting in the top left and proceeding clockwise
	rectangleCornerRadii: number[];
}

interface TextNode extends VectorNode {
	// Text contained within a text box
	characters: string;
	// Style of text including font family and weight (see type style section for more information)
	style: TypeStyle;
	// Array with same number of elements as characters in text box, each element is a reference to the styleOverrideTable
	// defined below and maps to the corresponding character in the characters field. Elements with value 0 have the default
	// type style
	characterStyleOverrides: number[];
	// Map from ID to
	styleOverrideTable: Record<number,TypeStyle>;
	// An array with the same number of elements as lines in the text node, where lines are delimited by newline or paragraph separator characters. Each element in the array corresponds to the list type of a specific line. List types are represented as string enums with one of these possible values:
	lineTypes: string[];
	// An array with the same number of elements as lines in the text node, where lines are delimited by newline or paragraph separator characters. Each element in the array corresponds to the indentation level of a specific line.
	lineIndentations: number[];
}

interface SliceNode extends Node {
	// An array of export settings representing images to export from this node
	exportSettings: ExportSetting[];
	// Bounding box of the node in absolute space coordinates
	absoluteBoundingBox: Rectangle;
	// Width and height of element. This is different from the width and height of the bounding box in that the absolute bounding box represents the element after scaling and rotation. Only present if geometry=paths is passed
	size: Vector;
	// The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
	relativeTransform: Transform;
}

interface ComponentNode extends FrameNode {
}

interface ComponentSetNode extends FrameNode {
}

interface InstanceNode extends FrameNode {
	// ID of component that this instance came from, refers to
	componentId: string;
}

interface StickyNode extends Node {
	// Bounding box of the node in absolute space coordinates
	absoluteBoundingBox: Rectangle;
	// If true, author name is visible.
	// default: false
	authorVisible?: boolean;
	// Background color of the canvas.
	backgroundColor: Color;
	// How this node blends with nodes behind it in the scene (see blend mode section for more details)
	blendMode: BlendMode;
	// Text contained within a text box
	characters: string;
	// An array of effects attached to this node (see effects section for more details)
	// default: []
	effects?: Effect[];
	// An array of export settings representing images to export from the node
	// default: []
	exportSettings?: ExportSetting[];
	// An array of fill paints applied to the node
	// default: []
	fills?: Paint[];
	// Does this node mask sibling nodes in front of it?
	// default: false
	isMask?: boolean;
	// If true, sticky is locked and cannot be edited
	// default: false
	locked?: boolean;
	// Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
	opacity: number;
	// The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
	relativeTransform: Transform;
}

interface ShapeWithTextNode extends Node {
	// Bounding box of the node in absolute space coordinates
	absoluteBoundingBox: Rectangle;
	// Background color of the canvas.
	backgroundColor: Color;
	// How this node blends with nodes behind it in the scene (see blend mode section for more details)
	blendMode: BlendMode;
	// Text contained within a text box
	characters: string;
	// Radius of each corner of the rectangle if a single radius is set for all corners
	cornerRadius: number;
	// Array of length 4 of the radius of each corner of the rectangle, starting in the top left and proceeding clockwise
	rectangleCornerRadii: number[];
	// An array of effects attached to this node (see effects section for more details)
	// default: []
	effects?: Effect[];
	// An array of export settings representing images to export from the node
	// default: []
	exportSettings?: ExportSetting[];
	// An array of fill paints applied to the node
	// default: []
	fills?: Paint[];
	// Does this node mask sibling nodes in front of it?
	// default: false
	isMask?: boolean;
	// If true, shape-with-text is locked and cannot be edited
	// default: false
	locked?: boolean;
	// Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
	opacity: number;
	// Shape-with-text geometric shape type.
	shapeType: ShapeType;
	// An array of stroke paints applied to the node
	// default: []
	strokes?: Paint[];
	// The weight of strokes on the node
	strokeWeight: number;
	// A string enum with value of "NONE", "ROUND", "SQUARE", "LINE_ARROW", or "TRIANGLE_ARROW", describing the end caps of vector paths.
	// default: "NONE"
	strokeCap?: string;
	// A string enum with value of "MITER", "BEVEL", or "ROUND", describing how corners in vector paths are rendered.
	// default: "MITER"
	strokeJoin?: string;
	// An array of floating point numbers describing the pattern of dash length and gap lengths that the vector path follows. For example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
	// default: []
	strokeDashes?: number[];
	// Position of stroke relative to vector outline, as a string enum
	strokeAlign: string;
	// The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
	relativeTransform: Transform;
}

interface ConnectorNode extends Node {
	// Bounding box of the node in absolute space coordinates
	absoluteBoundingBox: Rectangle;
	// Background color of the canvas.
	backgroundColor: Color;
	// How this node blends with nodes behind it in the scene (see blend mode section for more details)
	blendMode: BlendMode;
	// Text contained within a text box
	characters: string;
	// Connector starting endpoint.
	connectorStart: ConnectorEndpoint;
	// Connector ending endpoint.
	connectorEnd: ConnectorEndpoint;
	// Connector line type.
	connectorLineType: ConnectorLineType;
	// Radius of each corner of the rectangle if a single radius is set for all corners
	cornerRadius: number;
	// Array of length 4 of the radius of each corner of the rectangle, starting in the top left and proceeding clockwise
	rectangleCornerRadii: number[];
	// An array of effects attached to this node (see effects section for more details)
	// default: []
	effects?: Effect[];
	// An array of export settings representing images to export from the node
	// default: []
	exportSettings?: ExportSetting[];
	// An array of fill paints applied to the node
	// default: []
	fills?: Paint[];
	// Does this node mask sibling nodes in front of it?
	// default: false
	isMask?: boolean;
	// If true, connector is locked and cannot be edited
	// default: false
	locked?: boolean;
	// Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
	opacity: number;
	// An array of stroke paints applied to the node
	// default: []
	strokes?: Paint[];
	// The weight of strokes on the node
	strokeWeight: number;
	// A string enum with value of "NONE", "ROUND", "SQUARE", "LINE_ARROW", or "TRIANGLE_ARROW", describing the end caps of vector paths.
	// default: "NONE"
	strokeCap?: string;
	// A string enum with value of "MITER", "BEVEL", or "ROUND", describing how corners in vector paths are rendered.
	// default: "MITER"
	strokeJoin?: string;
	// An array of floating point numbers describing the pattern of dash length and gap lengths that the vector path follows. For example a value of [1, 2] indicates that the path has a dash of length 1 followed by a gap of length 2, repeated.
	// default: []
	strokeDashes?: number[];
	// Position of stroke relative to vector outline, as a string enum
	strokeAlign: string;
	// Connector text background.
	textBackground: ConnectorTextBackground;
	// The top two rows of a matrix that represents the 2D transform of this node relative to its parent. The bottom row of the matrix is implicitly always (0, 0, 1). Use to transform coordinates in geometry. Only present if geometry=paths is passed
	relativeTransform: Transform;
}

type Color =  {
	// Red channel value, between 0 and 1
	r: number;
	// Green channel value, between 0 and 1
	g: number;
	// Blue channel value, between 0 and 1
	b: number;
	// Alpha channel value, between 0 and 1
	a: number;
}

type ExportSetting =  {
	// File suffix to append to all filenames
	suffix: string;
	// Image type, string enum that supports values
	format: "JPG" | "PNG" | "SVG";
	// Constraint that determines sizing of exported asset
	constraint: Constraint;
}

type Constraint =  {
	// Type of constraint to apply; string enum with potential values below
	type: "SCALE" | "WIDTH" | "HEIGHT";
	// See
	value: number;
}

type Rectangle =  {
	// X coordinate of top left corner of the rectangle
	x: number;
	// Y coordinate of top left corner of the rectangle
	y: number;
	// Width of the rectangle
	width: number;
	// Height of the rectangle
	height: number;
}

type ArcData =  {
	// Start of the sweep in radians
	startingAngle: number;
	// End of the sweep in radians
	endingAngle: number;
	// Inner radius value between 0 and 1
	innerRadius: number;
}

type BlendMode = "PASS_THROUGH" | "NORMAL" | "DARKEN" | "MULTIPLY" | "LINEAR_BURN" | "COLOR_BURN" | "LIGHTEN" | "SCREEN" | "LINEAR_DODGE" | "COLOR_DODGE" | "OVERLAY" | "SOFT_LIGHT" | "HARD_LIGHT" | "DIFFERENCE" | "EXCLUSION" | "HUE" | "SATURATION" | "COLOR" | "LUMINOSITY";

type EasingType = "EASE_IN" | "EASE_OUT" | "EASE_IN_AND_OUT" | "LINEAR" | "GENTLE_SPRING";

type FlowStartingPoint =  {
	// Unique identifier specifying the frame
	nodeId: string;
	// Name of flow
	name: string;
}

type LayoutConstraint =  {
	// Vertical constraint as an enum
	vertical: "TOP" | "BOTTOM" | "CENTER" | "TOP_BOTTOM" | "SCALE";
	// Horizontal constraint as an enum
	horizontal: "LEFT" | "RIGHT" | "CENTER" | "LEFT_RIGHT" | "SCALE";
}

type LayoutGrid =  {
	// Orientation of the grid as a string enum
	pattern: "COLUMNS" | "ROWS" | "GRID";
	// Width of column grid or height of row grid or square grid spacing
	sectionSize: number;
	// Is the grid currently visible?
	visible: boolean;
	// Color of the grid
	color: Color;
	// Positioning of grid as a string enum
	alignment: "MIN" | "STRETCH" | "CENTER";
	// Spacing in between columns and rows
	gutterSize: number;
	// Spacing before the first column or row
	offset: number;
	// Number of columns or rows
	count: number;
}

type Effect =  {
	// Type of effect as a string enum
	type: "INNER_SHADOW" | "DROP_SHADOW" | "LAYER_BLUR" | "BACKGROUND_BLUR";
	// Is the effect active?
	visible: boolean;
	// Radius of the blur effect (applies to shadows as well)
	radius: number;
	// The color of the shadow
	color: Color;
	// Blend mode of the shadow
	blendMode: BlendMode;
	// How far the shadow is projected in the x and y directions
	offset: Vector;
	// How far the shadow spreads
	// default: 0
	spread?: number;
	// Whether to show the shadow behind translucent or transparent pixels (applies only to drop shadows)
	showShadowBehindNode: boolean;
}

type Hyperlink =  {
	// Type of hyperlink
	type: "URL" | "NODE";
	// URL being linked to, if URL type
	url: string;
	// ID of frame hyperlink points to, if NODE type
	nodeID: string;
}

type DocumentationLink =  {
	// Should be a valid URI (e.g.
	uri: string;
}

type Paint =  {
	// Type of paint as a string enum
	type: "SOLID" | "GRADIENT_LINEAR" | "GRADIENT_RADIAL" | "GRADIENT_ANGULAR" | "GRADIENT_DIAMOND" | "IMAGE" | "EMOJI";
	// Is the paint enabled?
	// default: true
	visible?: boolean;
	// Overall opacity of paint (colors within the paint can also have opacity values which would blend with this)
	// default: 1
	opacity?: number;
	// Solid color of the paint
	color: Color;
	// How this node blends with nodes behind it in the scene (see blend mode section for more details)
	blendMode: BlendMode;
	// This field contains three vectors, each of which are a position in normalized object space (normalized object space is if the top left corner of the bounding box of the object is (0, 0) and the bottom right is (1,1)). The first position corresponds to the start of the gradient (value 0 for the purposes of calculating gradient stops), the second position is the end of the gradient (value 1), and the third handle position determines the width of the gradient. See image examples below:
	gradientHandlePositions: Vector[];
	// Positions of key points along the gradient axis
	// with the colors anchored there. Colors along the gradient
	// are interpolated smoothly between neighboring gradient stops.
	gradientStops: ColorStop[];
	// Image scaling mode
	scaleMode: "FILL" | "FIT" | "TILE" | "STRETCH";
	// Affine transform applied to the image, only present if
	imageTransform: Transform;
	// Amount image is scaled by in tiling, only present if
	scalingFactor: "TILE";
	// Image rotation, in degrees.
	rotation: number;
	// A reference to an image embedded in this node. To download the image using this reference, use the
	imageRef: string;
	// Defines what image filters have been applied to this paint, if any. If this property is not defined, no filters have been applied.
	// default: {}
	filters?: ImageFilters;
	// A reference to the GIF embedded in this node, if the image is a GIF. To download the image using this reference, use the
	gifRef: string;
}

type Vector =  {
	// X coordinate of the vector
	x: number;
	// Y coordinate of the vector
	y: number;
}

type Size =  {
	// the width of a size
	width: number;
	// the height of a size
	height: number;
}

type Transform = [[number, number, number], [number, number, number]];

type ImageFilters =  {
	// default: 0
	exposure?: number;
	// default: 0
	contrast?: number;
	// default: 0
	saturation?: number;
	// default: 0
	temperature?: number;
	// default: 0
	tint?: number;
	// default: 0
	highlights?: number;
	// default: 0
	shadows?: number;
}

type FrameOffset =  {
	// Unique id specifying the frame.
	node_id: string;
	// 2d vector offset within the frame.
	node_offset: Vector;
}

type ColorStop =  {
	// Value between 0 and 1 representing position along gradient axis
	position: number;
	// Color attached to corresponding position
	color: Color;
}

type TypeStyle =  {
	// Font family of text (standard name)
	fontFamily: string;
	// PostScript font name
	fontPostScriptName: string;
	// Space between paragraphs in px, 0 if not present
	// default: 0
	paragraphSpacing?: number;
	// Paragraph indentation in px, 0 if not present
	// default: 0
	paragraphIndent?: number;
	// Space between list items in px, 0 if not present
	// default: 0
	listSpacing?: number;
	// Whether or not text is italicized
	italic: boolean;
	// Numeric font weight
	fontWeight: number;
	// Font size in px
	fontSize: number;
	// Text casing applied to the node, default is the original casing
	// default: ORIGINAL
	textCase?: "UPPER" | "LOWER" | "TITLE" | "SMALL_CAPS" | "SMALL_CAPS_FORCED";
	// Text decoration applied to the node, default is none
	// default: NONE
	textDecoration?: "STRIKETHROUGH" | "UNDERLINE";
	// Dimensions along which text will auto resize, default is that the text does not auto-resize.
	// default: NONE
	textAutoResize?: "HEIGHT" | "WIDTH_AND_HEIGHT";
	// Horizontal text alignment as string enum
	textAlignHorizontal: "LEFT" | "RIGHT" | "CENTER" | "JUSTIFIED";
	// Vertical text alignment as string enum
	textAlignVertical: "TOP" | "CENTER" | "BOTTOM";
	// Space between characters in px
	letterSpacing: number;
	// Paints applied to characters
	fills: Paint[];
	// Link to a URL or frame
	hyperlink: Hyperlink;
	// A map of OpenType feature flags to 1 or 0, 1 if it is enabled and 0 if it is disabled. Note that some flags aren't reflected here. For example, SMCP (small caps) is still represented by the textCase field.
	// default: {}
	opentypeFlags?: Record<string, number>;
	// Line height in px
	lineHeightPx: number;
	// Line height as a percentage of normal line height. This is deprecated; in a future version of the API only lineHeightPx and lineHeightPercentFontSize will be returned.
	// default: 100
	lineHeightPercent?: number;
	// Line height as a percentage of the font size. Only returned when lineHeightPercent is not 100.
	lineHeightPercentFontSize: number;
	// The unit of the line height value specified by the user.
	lineHeightUnit: "PIXELS" | "FONT_SIZE_%" | "INTRINSIC_%";
}

type Component =  {
	// The key of the component
	key: string;
	// The name of the component
	name: string;
	// The description of the component as entered in the editor
	description: string;
	// The ID of the component set if the component belongs to one
	componentSetId?: string;
	// The documentation links for this component.
	documentationLinks: DocumentationLink[];
}

type ComponentSet =  {
	// The key of the component set
	key: string;
	// The name of the component set
	name: string;
	// The description of the component set as entered in the editor
	description: string;
}

type Style =  {
	// The key of the style
	key: string;
	// The name of the style
	name: string;
	// The description of the style
	description: string;
	// The type of style as string enum
	style_type: StyleType;
}

type ShapeType =  {
	SQUARE: string;
	ELLIPSE: string;
	ROUNDED_RECTANGLE: string;
	DIAMOND: string;
	TRIANGLE_DOWN: string;
	PARALLELOGRAM_RIGHT: string;
	PARALLELOGRAM_LEFT: string;
}

type ConnectorEndpoint =  {
	// Canvas location as x & y coordinate.
	position: Vector;
	// Node ID this endpoint attaches to.
	endpointNodeId: string;
	// The magnet type is a string enum
	magnet: ConnectorMagnet;
}

type ConnectorLineType =  {
	ELBOWED: string;
	STRAIGHT: string;
}

type ConnectorTextBackground =  {
	// Radius of each corner of the rectangle if a single radius is set for all corners
	cornerRadius: CornerRadius;
	// An array of fill paints applied to the node
	fills: Paint[];
}

type StyleType = "FILL" | "TEXT" | "EFFECT" | "GRID";

type ConnectorMagnet = "AUTO" | "TOP" | "BOTTOM" | "LEFT" | "RIGHT";

type Path = {
	windingRule: "NONZERO" | "EVENODD";
	path: string;
};
type CornerRadius = number[];
