import "./dropdown.css";
import { store } from "../../store";

export function Dropdown() {
	const olympicData = store.getState().olympicData;

	const uniqueYears = [...new Set(olympicData.map((d) => +d.year))].toSorted((a, b) => a - b);
	const uniqueSports = [...new Set(olympicData.map((d) => d.sport))].toSorted();

	return `
	<div id="dropdown">
		<select class="dropdown-games" data-filter="season">
			<option value="">All seasons</option>
			<option value="Summer">Summer Games</option>
			<option value="Winter">Winter Games</option>
		</select>

		<select class="dropdown-years" data-filter="year">
			<option value="">All years</option>
        	${uniqueYears && uniqueYears.map((year) => `<option value="${year}">${year}</option>`).join("")}
		</select>

		<select class="dropdown-sports" data-filter="sport">
			<option value="">All sports</option>
			${uniqueSports && uniqueSports.map((sport) => `<option value="${sport}">${sport}</option>`).join("")}
		</select>

		<select class="dropdown-sex" data-filter="sex">
			<option value="">All genders</option>
			<option value="M">M</option>
			<option value="F">F</option>
		</select>
	<div>
	`;
}
