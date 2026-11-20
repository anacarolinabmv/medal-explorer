import { store } from "../../store";
import "./countryInfo.css";

export function CountryInfo() {
	const countryName = store.getState().selectedCountry;
	const countryData = store.getState().countryData.filter((d) => d.name == countryName)[0];
	const olympicData = store.getState().groupedData.filter((d) => d.team_country == countryName)[0];

	const medalCount = olympicData?.gold_count + olympicData?.silver_count + olympicData?.bronze_count;

	return `
		<div class="country-flag">
			<img src="${countryData?.flag}" />
			<h2>${countryName}</h2>
		</div>

		<div class="medal-count pt-[10px]">
			<div class="flex flex-col">
				<p class="p-sm">Total medals</p>
				<h2>${medalCount === 0 ? 0 : medalCount || "-"}</h2>
			</div>

			${[
				["gold", olympicData?.gold_count],
				["silver", olympicData?.silver_count],
				["bronze", olympicData?.bronze_count],
			]
				.map(
					([medal, count]) =>
						`			
					<div class="flex flex-col items-center justify-center">
						<p class="p-sm">${medal.charAt(0).toUpperCase() + medal.slice(1)}</p>
						<div class="flex gap-[2px]">
							<img height="20px" width="20px" src="../svg/${medal}-medal.svg" alt="" />
							<p>${count === 0 ? 0 : count || "-"}</p>
						</div>
					</div>`,
				)
				.join("")}
	`;
}
