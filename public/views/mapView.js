import "./mapView.css";
import { Dropdown } from "../../src/components/Dropdown/Dropdown";
import { store } from "../../src/store";
import { renderMap } from "../../src/components/Map/Map";
import { Legend } from "../../src/components/Legend/Legend";
import { countryList } from "../../src/components/CountriesList/CountriesList";
import { CountryInfo } from "../../src/components/CountryInfo/CountryInfo";
import { filterDB } from "../../src/query";
import { loadView } from "../../src/utils";

function renderComponent(container, component) {
	// if (!component) return;

	container.innerHTML = "";
	container.innerHTML = component;
}

export async function renderMapView() {
	store.setState({ groupedData: await filterDB("") });

	const mapView = await loadView(store.getState().activeView);

	// Render the dropdown
	const dropdownContainer = mapView.querySelector("#dropdown-container");
	renderComponent(dropdownContainer, Dropdown());

	//Render map
	const mapContainer = mapView.querySelector("#map-container");
	mapContainer.replaceChildren(await renderMap());

	// Render legend
	const legendContainer = mapView.querySelector("#legend-container");
	renderComponent(legendContainer, Legend());

	// Render medals list
	const countryListContainer = mapView.querySelector(".medal-info-container ul");
	renderComponent(countryListContainer, countryList());

	// Render Country info
	const countryInfoContainer = mapView.querySelector(".country-info-container");
	renderComponent(countryInfoContainer, CountryInfo());

	//===================================================//
	//                 Event Handlers
	//===================================================//

	mapView.addEventListener("map:click", () => {
		renderComponent(countryInfoContainer, CountryInfo());
	});

	mapView.addEventListener("change", async (e) => {
		const selectElements = dropdownContainer.querySelectorAll("select");
		const filters = Object.fromEntries([...selectElements].map((element) => [element.dataset.filter, element.value]));

		store.setState({ groupedData: await filterDB(filters) });

		mapContainer.replaceChildren(await renderMap());
		renderComponent(countryListContainer, countryList());
	});

	return mapView;
}
