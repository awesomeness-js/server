export default function homePage() {

	ui.pageScript();

	ui.app.start();

	const cards = [
		{
			id: "a",
			label: "Analytics",
			value: 132 
		},
		{
			id: "b",
			label: "Sales",
			value: 98 
		},
		{
			id: "c",
			label: "Leads",
			value: 211 
		},
		{
			id: "d",
			label: "Retention",
			value: 87 
		},
		{
			id: "e",
			label: "Support",
			value: 56 
		},
		{
			id: "f",
			label: "Backlog",
			value: 23 
		},
	];

	const rows = [];

	for (let i = 0; i < cards.length; i++) {

		const card = cards[i];
		const ratio = card.value / 250;

		rows.push({
			index: i,
			id: card.id,
			label: card.label,
			value: card.value,
			ratio,
			status: ratio > 0.6 ? "high" : ratio > 0.3 ? "medium" : "low",
		});
	
	}

	const totals = rows.reduce(
		(acc, row) => {

			acc.total += row.value;
			acc.high += row.status === "high" ? 1 : 0;
			acc.medium += row.status === "medium" ? 1 : 0;
			acc.low += row.status === "low" ? 1 : 0;

			return acc;
		
		},
		{
			total: 0,
			high: 0,
			medium: 0,
			low: 0 
		}
	);

	const report = {
		generatedAt: new Date(2024, 6, 4, 9, 30, 0).toISOString(),
		rows,
		totals,
		meta: {
			source: "fixture",
			version: "1.0.0",
			notes: [
				"This fixture intentionally has larger content for benchmark-style tests.",
				"ui references in this file: ui.pageScript(), ui.app.start().",
			],
		},
	};

	return report;

}
