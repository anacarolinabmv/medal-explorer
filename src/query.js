async function queryDB(query) {
	const res = await fetch("/query", {
		method: "POST",
		body: query,
	});

	return await res.json();
}

export async function filterDB(filters) {
	let query = `
		SELECT
			team_country,
			SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) AS gold_count,
			SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) AS silver_count,
			SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) AS bronze_count
		FROM olympic_data
		 ${
				Object.values(filters).some((v) => v.length > 0) ?
					` WHERE ${Object.entries(filters)
						.filter(([f, v]) => v.length > 0)
						.map(([k, v]) => v && `${k}='${v}'`)
						.join(" AND ")}`
				:	""
			}
		GROUP BY 
			team_country
		ORDER BY 
			gold_count DESC,
			silver_count DESC,
			bronze_count DESC;
	`;

	return await queryDB(query);
}

export async function groupDataSports(team_country, year = "") {
	let query = `
		SELECT
			team_country,
			sport,
			year, 
			SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) AS gold_count,
			SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) AS silver_count,
			SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) AS bronze_count
		FROM olympic_data
		WHERE team_country = '${team_country}'
		 ${year ? `AND year=${year}` : ""}
		GROUP BY 
			team_country, sport
		ORDER BY 
			gold_count DESC,
			silver_count DESC,
			bronze_count DESC;
	`;

	return await queryDB(query);
}

export async function groupDataCountryAge(team_country, year = "") {
	let query = `
		SELECT
			team_country,
			sport,
			year, 
			SUM(CASE WHEN medal = 'Gold' THEN 1 ELSE 0 END) AS gold_count,
			SUM(CASE WHEN medal = 'Silver' THEN 1 ELSE 0 END) AS silver_count,
			SUM(CASE WHEN medal = 'Bronze' THEN 1 ELSE 0 END) AS bronze_count
		FROM olympic_data
		WHERE team_country = '${team_country}'
		 ${year ? `AND year=${year}` : ""}
		GROUP BY 
			sport
		ORDER BY 
			gold_count DESC,
			silver_count DESC,
			bronze_count DESC;
	`;

	return await queryDB(query);
}
