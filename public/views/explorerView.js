import "./explorerView.css";
import { store } from "../../src/store";
import { loadView } from "../../src/utils";
import { groupDataSports } from "../../src/query";
import { sportsBarGraph } from "../../src/components/ExplorerViewComponents/sportsBarGraph";

function renderComponent(container, component) {
	container.innerHTML = "";
	container.innerHTML = component;
}

function populateSelectYears() {
	const olympicData = store.getState().olympicData;
	const uniqueYears = [...new Set(olympicData.map((d) => +d.year))].toSorted((a, b) => a - b);

	return `
        <option value="">All years</option>
        	${uniqueYears && uniqueYears.map((year) => `<option value="${year}">${year}</option>`).join("")}
        `;
}

function Header() {
	const countryName = store.getState().selectedCountry;
	const countryData = store.getState().countryData.filter((d) => d.name == countryName)[0];

	const headerContainer = document.createElement("div");
	headerContainer.setAttribute("id", "explorer-header");

	return ` 
        <img src="${countryData?.flag}" alt="" />
		<h1>
			<span">${countryName}</span> <span id="header-year">2024</span> medals
		</h1>
		<select name="" id="explorer-select-year">
            ${populateSelectYears()}
        </select>
	`;
}

function Medals() {
	return `	
        <div>medal</div>
        <div>medal</div>
        <div>medal</div>
        <div>medal</div>
    `;
}

function sportsGraph() {
	return ``;
}

export async function renderExplorerView() {
	let explorerViewState = {
		dataByCountryBySportByYear: await groupDataSports(store.getState().selectedCountry),
	};

	const explorerView = await loadView(store.getState().activeView);

	// Render Header (row 1)
	const headerContainer = explorerView.querySelector("#header-container");
	renderComponent(headerContainer, Header());

	// Render medals component
	const medalsContainer = explorerView.querySelector("#medals-container");
	renderComponent(medalsContainer, Medals());

	const sportsContainer = explorerView.querySelector("#sports-graph");
	const sportsContainerSVG = explorerView.querySelector("#sports-graph svg");
	sportsContainerSVG.replaceChildren(sportsBarGraph(explorerViewState.dataByCountryBySportByYear));

	//===================================================//
	//                 Event Handlers
	//===================================================//

	headerContainer.addEventListener("change", async (e) => {
		const yearFilter = e.target.value;
		explorerViewState.groupBySportAndYear = await groupDataSports(store.getState().selectedCountry, yearFilter);
	});

	return explorerView;
}
