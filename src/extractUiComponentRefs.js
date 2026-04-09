function escapeRegex(input) {

	return String(input).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

}

export default function extractUiComponentRefs(
	str,
	{
		namespace = "ui",
		includeCall = true,
		includeDotAccess = false,
	} = {}
) {

	if (typeof str !== "string" || !str.length) {

		return [];
	
	}

	const ns = escapeRegex(namespace);
	const lookaheads = [];

	if (includeDotAccess) {

		lookaheads.push("\\.");
	
	}

	if (includeCall) {

		lookaheads.push("\\(");
	
	}

	if (!lookaheads.length) {

		return [];
	
	}

	const regex = new RegExp(`${ns}\\.([a-zA-Z0-9_]+)(?=${lookaheads.join("|")})`, "g");
	const matches = new Set();
	let match;

	while ((match = regex.exec(str)) !== null) {

		matches.add(match[1]);
	
	}

	return [ ...matches ];

}
