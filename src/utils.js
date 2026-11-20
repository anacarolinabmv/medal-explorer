export async function loadView(view) {
	const response = await fetch(`/views/${view}View.html`);

	const template = document.createElement("template");
	template.innerHTML = await response.text();

	return template.content.firstElementChild;
}
