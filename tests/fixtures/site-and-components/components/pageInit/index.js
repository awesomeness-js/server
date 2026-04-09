export default function() {

	const items = [
		{
			id: "itm-1",
			title: "First",
			score: 11 
		},
		{
			id: "itm-2",
			title: "Second",
			score: 27 
		},
		{
			id: "itm-3",
			title: "Third",
			score: 42 
		},
		{
			id: "itm-4",
			title: "Fourth",
			score: 31 
		},
		{
			id: "itm-5",
			title: "Fifth",
			score: 18 
		},
		{
			id: "itm-6",
			title: "Sixth",
			score: 54 
		},
		{
			id: "itm-7",
			title: "Seventh",
			score: 39 
		},
		{
			id: "itm-8",
			title: "Eighth",
			score: 23 
		},
	];

	const grouped = items.reduce((acc, item) => {

		const bucket = item.score >= 40 ? "high" : item.score >= 25 ? "medium" : "low";

		acc[bucket] = acc[bucket] || [];
		acc[bucket].push(item);

		return acc;
	
	}, {});

	const sorted = [ ...items ].sort((a, b) => b.score - a.score);
	const topThree = sorted.slice(0, 3);

	const details = {
		count: items.length,
		topThree,
		grouped,
		mountRef,
		signature: `${topThree.map((item) => item.id).join("|")}:${items.length}`,
	};

	if (details.count > 5) {

		ui.cardMain();
	
	}

	if (details.topThree.length === 3) {

		ui.cardMount.mount();
	
	}

	return {
		$card,
		details,
	};

	
}