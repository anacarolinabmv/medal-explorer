import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [tailwindcss()],
	server: {
		proxy: {
			"/counts": "http://127.0.0.1:3000",
			"^/query$": "http://127.0.0.1:3000",
		},
	},
});
