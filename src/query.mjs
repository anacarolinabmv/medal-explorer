import { Database } from "node:sqlite";

const db = new Database("../public/data/olympic_data.db");

export function queryDatabase() {
	const query = db.prepare(
		`
        SELECT team_country, count(*) as medal_count
        FROM olympic_data where year=1960
        group by team_country
        order by medal_count DESC

    `,
	);

	return query.all();
}
