class Store {
	constructor(state) {
		this.state = state;
		this.activeView = null;
		this.selectedCountry = null;
	}

	get(key) {
		return this.state[key];
	}

	getState() {
		return this.state;
	}

	async setState(updates) {
		this.state = { ...this.state, ...updates };
	}
}

export const store = new Store({});
