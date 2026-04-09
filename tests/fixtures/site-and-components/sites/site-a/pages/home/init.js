export default function home() {

	ui.pageInit();
	ui.cardMain();

	const renderRef = ui.pageWidget.render();
	const mountRef = ui.cardMount.mount();
	const sections = [
		{ id: "hero", title: "Hero", enabled: true },
		{ id: "features", title: "Features", enabled: true },
		{ id: "pricing", title: "Pricing", enabled: true },
		{ id: "faq", title: "FAQ", enabled: true },
		{ id: "footer", title: "Footer", enabled: true },
	];

	const metrics = {
		visitors: 10234,
		signups: 789,
		conversionRate: 0.077,
		avgSessionMs: 184000,
	};

	const user = {
		id: "user-42",
		name: "Fixture User",
		roles: [ "viewer", "editor" ],
		preferences: {
			theme: "light",
			language: "en-US",
			notifications: true,
		},
	};

	const model = sections
		.filter((section) => section.enabled)
		.map((section, index) => ({
			...section,
			order: index + 1,
			slug: `${section.id}-${index + 1}`,
			updatedAt: new Date(2024, 0, index + 1).toISOString(),
		}));

	for (let i = 0; i < model.length; i++) {

		if (i % 2 === 0) {

			ui.pageInit();
		
		}

		if (model[i].id === "features") {

			ui.pageWidget.render();
		
		}
	
	}

	const summary = {
		sectionCount: model.length,
		metrics,
		user,
		flags: {
			hasHero: model.some((section) => section.id === "hero"),
			hasPricing: model.some((section) => section.id === "pricing"),
			showFooter: true,
		},
	};

	const payload = {
		renderRef,
		mountRef,
		summary,
		model,
	};

	return payload;
}
