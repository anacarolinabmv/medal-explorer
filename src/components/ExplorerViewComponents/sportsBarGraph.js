import "./sportsBarGraph.css";
import * as d3 from "d3";

let resizeObserver;

export function sportsBarGraph(data) {
	resizeObserver?.disconnect();

	const maxMedalCount = Math.max(...data.map((d) => d.gold_count + d.silver_count + d.bronze_count));

	const appContainer = document.querySelector("#app-container");
	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("id", "svg-sports");

	const bars = d3.select(svg).append("g");

	const color = d3.scaleOrdinal().domain(["Gold", "Silver", "Bronze"]).range(["#fcc419", "#bbbbbb", "#bf814b"]);

	const stacked = d3.stack().keys(["gold_count", "silver_count", "bronze_count"])(data.slice(0, 5));

	function resize() {
		const width = appContainer.getBoundingClientRect().width - 40;
		const height = 200;
		svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

		const x = d3.scaleLinear().domain([0, maxMedalCount]).range([65, width]);

		const y = d3
			.scaleBand()
			.range([0, height])
			.domain(data.slice(0, 5).map((d) => d.sport))
			.padding(0.2);

		const series = bars
			.selectAll("g.series")
			.data(stacked, (layer) => layer.key)
			.join("g")
			.attr("class", "series")
			.attr("fill", (layer) => color(layer.key));

		series
			.selectAll("rect")
			.data(
				(layer) => layer,
				(seg) => seg.data.sport,
			)
			.join("rect")
			.attr("x", (seg) => x(seg[0]))
			.attr("y", (seg) => y(seg.data.sport))
			.attr("width", (seg) => x(seg[1]) - x(seg[0]))
			.attr("height", y.bandwidth());

		d3.select(svg)
			.selectAll("g.y-axis")
			.data([null])
			.join("g")
			.attr("class", "y-axis")
			.attr("transform", `translate(60,0)`)
			.attr("font-size", 13)
			.attr("font-weight", "bold")
			.call(d3.axisLeft(y).tickSize(0))
			.select(".domain")
			.remove();
	}

	resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(appContainer);
	resize();

	return svg;
}
