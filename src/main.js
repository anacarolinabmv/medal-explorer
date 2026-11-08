import * as d3 from "d3";
import { renderMapView } from "./viewMap.js";
import { renderExplorer as renderExplorerView } from "./viewExplorer.js";
import { renderPredict as renderPredictView } from "./viewPredict.js";
import "./style.css";
import { store } from "./store.js";

function loadData() {
	return Promise.all([d3.csv("/data/cleaned_olympics_data.csv"), d3.json("/data/countryData.json")]);
}

function renderView() {
	const activeView = store.get("activeView");

	try {
		if (activeView === "map") renderMapView();
		if (activeView === "explorer") renderExplorerView();
		if (activeView === "predict") renderPredictView();
	} catch (error) {
		console.log(error);
	}
}

const buttons = document.querySelectorAll(".btn span");
buttons.forEach((btn) => {
	btn.addEventListener("click", async () => {
		const btnDiv = btn.parentElement;
		const selectedView = btnDiv.dataset.view;

		if (selectedView == store.get("activeView")) return;

		buttons.forEach((b) => b.parentElement.classList.remove("btn-active"));

		btnDiv.classList.add("btn-active");

		store.setState({ activeView: selectedView });

		renderView();
	});
});

async function init() {
	const [olympicData, countryData] = await loadData();

	store.setState({
		olympicData: olympicData,
		countryData: countryData,
		activeView: "map",
	});

	renderView();
}

init();
