import * as d3 from "d3";
import { store } from "../../store";
import "./map.css";

function colorScale() {
	return d3
		.scaleThreshold()
		.domain([1, 6, 21, 51, 100])
		.range(["#d8e6e6", "#D8F3DC", "#57cba7", "#379b86", "#1c7169", "#00474b"]);
}

let resizeObserver;

export async function renderMap() {
	resizeObserver?.disconnect();

	const world = await d3.json("/data/world_countries.json");
	const projection = d3.geoNaturalEarth1();
	const path = d3.geoPath().projection(projection);

	const mapContainer = document.createElement("div");
	mapContainer.setAttribute("id", "map");

	const svg = d3.select(mapContainer).append("svg").attr("id", "svg-map");
	const group = svg.append("g");

	const countries = group
		.selectAll("path")
		.data(world.features)
		.join("path")
		.attr("data-name", (d) => d.properties.name)
		.attr("fill", (d) => {
			const countryName = d.properties.name;
			const countryData = store.get("groupedData");

			if (!countryData.map((c) => c.team_country).includes(countryName)) {
				return "#ddd";
			}

			return colorScale()(
				countryData
					.filter((dd) => countryName == dd.team_country)
					.reduce((acc, val) => {
						acc += +val.gold_count + val.silver_count + val.bronze_count;
						return acc;
					}, 0),
			);
		});

	// Event handlers
	countries
		.on("mouseenter", (e, d) => {
			const tooltip = document.querySelector("#tooltip");
			tooltip.classList.remove("hidden");
			tooltip.innerHTML = d.properties.name;
		})
		.on("mousemove", (e) => {
			const tooltip = document.querySelector("#tooltip");
			const posX = e.x;
			const posY = e.y;

			tooltip.style.left = posX + "px";
			tooltip.style.top = posY + "px";
		})
		.on("mouseleave", (e) => {
			const tooltip = document.querySelector("#tooltip");
			tooltip.innerHTML = "";
			tooltip.classList.add("hidden");
		})
		.on("click", (e, d) => {
			const countryName = d.properties.name;
			store.setState({ selectedCountry: countryName });

			e.currentTarget.dispatchEvent(new CustomEvent("map:click", { detail: countryName, bubbles: true }));
		});

	function resize() {
		projection.fitExtent(
			[
				[0, 0],
				[mapContainer.clientWidth, mapContainer.clientHeight],
			],
			world,
		);

		countries.attr("d", path);
	}

	resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(mapContainer);

	return mapContainer;
}
