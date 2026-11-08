export async function renderPredict(state) {
	const app = document.querySelector("#view-container");

	try {
		const response = await fetch(`/views/predict.html`);
		console.log(response);

		if (!response.ok) {
			throw new Error(`Failed to load predict view: ${response.status}`);
		}

		const viewInnerHTML = await response.text();
		app.innerHTML = viewInnerHTML;

		// renderMap(state.data.world, state.data.medals, state.data.countryData);
	} catch (error) {
		console.log(error);
	}
}
