import { renderMapView } from "../public/views/mapView.js";
import { renderExplorerView } from "../public/views/explorerView.js";
import { store } from "./store";
import { Loading } from "./components/Loading component/Loading.js";

function renderPredictView() {
	document.createElement("div");
	return "predict";
}

const views = { explorer: renderExplorerView, predict: renderPredictView, map: renderMapView };

export async function App() {
	const appContainer = document.querySelector("#app-container");
	const viewContainer = appContainer.querySelector("#view-container");

	const navbar = appContainer.querySelector("#navbar");

	// Mount view
	viewContainer.replaceChildren(await renderMapView());

	//=====================================//
	//            EVENT HANDLERS
	//=====================================//

	//
	navbar.addEventListener("click", (e) => {
		const btnClicked = e.target.closest("button");
		const selectedView = btnClicked?.dataset.view;
		const currentView = store.getState().selectedView;

		if (!btnClicked || selectedView === currentView) return;

		[...navbar.children].forEach((btn) => btn.classList.remove("btn-active"));

		btnClicked.classList.add("btn-active");

		store.setState({ activeView: btnClicked.dataset.view });

		btnClicked.dispatchEvent(new CustomEvent("view:change", { bubbles: true }));
	});

	navbar.addEventListener("view:change", async () => {
		viewContainer.replaceChildren(Loading());
		viewContainer.replaceChildren(await views[store.getState().activeView]());
	});
}
