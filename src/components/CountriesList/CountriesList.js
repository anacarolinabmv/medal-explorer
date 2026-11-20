import "./countriesList.css";
import { store } from "../../store";

export function countryList() {
	const listItems = store
		.get("groupedData")
		.slice(0, 10)
		.map((gd) => {
			const flag = store.get("countryData").filter((d) => d.name == gd.team_country);

			return `
            <li>
                <img src="${flag[0].flag}" />
                <span>${gd.team_country}</span>
                <p>${gd.gold_count}</p>
                <p>${gd.silver_count}</p>
                <p>${gd.bronze_count}</p>
            </li>
        `;
		});

	return listItems.join("");
}
