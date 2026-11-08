import { renderMap } from "./map.js";
import { store } from "./store";

async function queryDB(filters) {
	let query = `
		SELECT
			team_country,
			SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) AS gold_count,
			SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) AS silver_count,
			SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) AS bronze_count
		FROM olympic_data
		WHERE medal IS NOT NULL ${
			filters ?
				Object.entries(filters)
					.map(([k, v]) => v && `AND ${k}='${v}'`)
					.join(" ")
			:	""
		}
		GROUP BY 
			team_country
		ORDER BY 
			gold_count DESC,
			silver_count DESC,
			bronze_count DESC;
	`;

	const res = await fetch("/query", {
		method: "POST",
		body: query,
	});

	return await res.json();
}

function renderCountryInfo() {
	const flag = store.get("countryData").filter((d) => d.name == store.get("selectedCountry"))[0].flag;

	const countryInfoContainer = document.querySelector("#country-info");
	countryInfoContainer.querySelector(".flag").src = flag;
	countryInfoContainer.querySelector(".country").innerText = store.get("selectedCountry");

	const groupedData = store.get("groupedData").filter((d) => d.team_country == store.get("selectedCountry"))?.[0];

	if (groupedData) {
		var { bronze_count, gold_count, silver_count } = groupedData;
	}

	countryInfoContainer.querySelector("#medal-count").innerText = bronze_count + gold_count + silver_count || "-";
	countryInfoContainer.querySelector("#gold-count").innerText = gold_count || "-";
	countryInfoContainer.querySelector("#silver-count").innerText = silver_count || "-";
	countryInfoContainer.querySelector("#bronze-count").innerText = bronze_count || "-";

	// const countryMedalsContainer = countryInfoContainer.querySelector("#country-medals");
}

async function renderCountryList() {
	const countryListContainer = document.querySelector("#country-list");

	const listHTML = store
		.get("groupedData")
		.slice(0, 7)
		.map((gd) => {
			const flag = store.get("countryData").filter((d) => d.name == gd.team_country);

			return `<li class="country-row">
			<div class="flex w-6/10 gap-2">
				<img class="country-flag" src="${flag[0].flag}" />
				<span>${gd.team_country}</span>
			</div>
			<div class="medal-counts">
				<span class="gold">${gd.gold_count}</span>
				<span class="silver">${gd.silver_count}</span>
				<span class="bronze">${gd.bronze_count}</span>
			</div>
		</li>`;
		});

	countryListContainer.innerHTML = listHTML.join("");
}

function populateDropdown() {
	const olympicData = store.get("olympicData");

	const uniqueYears = [...new Set(olympicData.map((d) => +d.year))].toSorted((a, b) => a - b);
	const uniqueSports = [...new Set(olympicData.map((d) => d.sport))].toSorted();

	const OptionElements = [".dropdown-years", ".dropdown-sports"];
	OptionElements.forEach((el) => {
		const OptionElement = document.querySelector(el);

		if (OptionElement.dataset.filter == "year") {
			OptionElement.innerHTML += uniqueYears.map((year) => `<option value="${year}">${year}</option>`).join("");
		} else if (OptionElement.dataset.filter == "sport") {
			OptionElement.innerHTML += uniqueSports.map((sport) => `<option value="${sport}">${sport}</option>`).join("");
		}
	});
}

export async function renderMapView() {
	const app = document.querySelector("#view-container");

	try {
		const response = await fetch(`/views/map.html`);

		if (!response.ok) {
			throw new Error(`Failed to load map view: ${response.status}`);
		}

		const viewInnerHTML = await response.text();
		app.innerHTML = viewInnerHTML;

		populateDropdown();

		store.setState({ groupedData: await queryDB("") });

		renderCountryList();
		// renderCountryInfo();

		renderMap();

		const mapContainer = document.querySelector(".world-map");
		mapContainer.addEventListener("map:click", (e) => {
			renderCountryInfo();
			console.log(e);
		});

		let filters = {};
		document.querySelectorAll("select").forEach((element) => {
			element.addEventListener("change", async (e) => {
				const target = e.target;
				filters[target.dataset.filter] = target.value;

				store.setState({ groupedData: await queryDB(filters) });

				renderCountryList();
				renderMap();
			});
		});
	} catch (error) {
		console.log(error);
	}
}
