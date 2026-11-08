import * as d3 from "d3";
import { store } from "./store";

class WorldMap {
	world = null;

	constuctor(selectedCountry, mapContainer, svg, groups, paths) {
		this.mapContainer = mapContainer;
		this.svg = svg;
		this.groups = groups;
		this.paths = paths;
		this.selectedCountry = null;

		this.state = { selectedCountry: null };
	}

	async loadWorld() {
		const worldJson = await d3.json("/data/world_countries.json");
		this.world = await worldJson;
	}

	colorScale() {
		return d3
			.scaleThreshold()
			.domain([1, 6, 21, 51, 100])
			.range(["#d8e6e6", "#D8F3DC", "#57cba7", "#379b86", "#1c7169", "#00474b"]);
	}

	render() {
		this.svg = d3.select(this.mapContainer).append("svg").attr("id", "map");
	}
}

function colorScale() {
	return d3
		.scaleThreshold()
		.domain([1, 6, 21, 51, 100])
		.range(["#d8e6e6", "#D8F3DC", "#57cba7", "#379b86", "#1c7169", "#00474b"]);
}

const world = await (async () => d3.json("/data/world_countries.json"))();

function destroyMap() {
	d3.select(".world-map svg").remove();
}

let resizeObserver;

export async function renderMap() {
	resizeObserver?.disconnect();

	destroyMap();
	const mapContainer = document.querySelector(".world-map");

	const svg = d3.select(mapContainer).append("svg").attr("id", "map");
	const group = svg.append("g");

	const projection = d3.geoNaturalEarth1();
	const path = d3.geoPath().projection(projection);

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
	d3.selectAll("path")
		.on("mouseenter", (e) => {
			const tooltip = document.querySelector("#tooltip");
			tooltip.classList.remove("hidden");

			tooltip.innerHTML = e.target.dataset.name;
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
		.on("click", (e) => {
			store.setState({ selectedCountry: e.target.dataset.name });

			e.target.dispatchEvent(new CustomEvent("map:click", { detail: "de", bubbles: true }));
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
}
