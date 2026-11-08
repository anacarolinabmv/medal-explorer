import { store } from "./store";

export async function renderExplorer() {
	const app = document.querySelector("#view-container");

	try {
		const response = await fetch(`/views/explorer.html`);

		if (!response.ok) {
			throw new Error(`Failed to load explorer view: ${response.status}`);
		}

		const viewInnerHTML = await response.text();
		app.innerHTML = viewInnerHTML;

		// renderMap();
	} catch (error) {
		console.log(error);
	}
}
