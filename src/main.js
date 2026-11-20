import * as d3 from "d3";
import "./style.css";
import { store } from "./store.js";
import { App } from "./App.js";
import { Loading } from "./components/Loading component/Loading.js";

function loadData() {
	return Promise.all([d3.csv("/data/cleaned_olympics_data.csv"), d3.json("/data/countryData.json")]);
}

async function init() {
	const viewContainer = document.querySelector("#view-container");
	viewContainer.appendChild(Loading());

	const [olympicData, countryData] = await loadData();

	await store.setState({
		olympicData: olympicData,
		countryData: countryData,
		activeView: "map",
		selectedCountry: "United States",
	});

	App();
}

init();
