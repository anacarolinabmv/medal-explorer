import "./loading.css";

export function Loading() {
	const loaderContainer = document.createElement("div");
	loaderContainer.setAttribute("class", "loader");

	const loaderWheel = document.createElement("div");
	loaderWheel.setAttribute("class", "loader-wheel");

	const loaderText = document.createElement("div");
	loaderText.setAttribute("class", "loader-text");
	loaderText.textContent = "Loading...";

	loaderContainer.append(loaderWheel);
	loaderContainer.append(loaderText);

	return loaderContainer;
}
