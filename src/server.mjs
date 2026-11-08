import express from "express";
import { Database } from "node:sqlite";

const app = express();
const port = 3000;

const db = new Database("../public/data/olympic_data.db");

function queryDatabase(query) {
	return db.prepare(query).all();
}

app.post("/query", express.text(), (req, res) => {
	const query = req.body;

	res.json(queryDatabase(query));
});

app.listen(port, () => {
	console.log(`Listening at http://localhost:5173`);
});
