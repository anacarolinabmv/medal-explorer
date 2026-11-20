import "./legend.css";

function LabelBox(text) {
	return `<div class="label-box">
        <div class="color"></div>
        <span class='label'>${text}</span>
	</div>
    `;
}

export function Legend() {
	const labels = ["No data", "0", "1-5", "6-20", "21-50", "51-100", "100+"];

	return `<div id="legend">
	${labels.map((label) => LabelBox(label)).join("")}
    </div>`;
}

Legend();
