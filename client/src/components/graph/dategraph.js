
import React, { CSSProperties } from "react";

import { useCSVReader } from "react-papaparse";

import ReactDOM from "react-dom";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const styles = {
	csvReader: {
		display: "flex",
		flexDirection: "row",
		marginBottom: 10
	},
	browseFile: {
		width: "20%",
	},
	acceptedFile: {
		border: "1px solid #ccc",
		height: 45,
		lineHeight: 2.5,
		paddingLeft: 10,
		width: "80%"
	},
	remove: {
		borderRadius: 0,
		padding: "0 20px"
	},
	progressBarBackgroundColor: {
		backgroundColor: "red"
	}
};

//Function for swapping an array's rows and columns
const arrayColumn = (arr, n) => arr.map(x => x[n]);


//Globals used in a few functions
var labels = [];
var tdat = [];
var data = {};
var lsize;

//Function for drawing the graph
export function draw() {


	var c1 = document.getElementById("Sun").checked;
	var c2 = document.getElementById("Mon").checked;
	var c3 = document.getElementById("Tue").checked;
	var c4 = document.getElementById("Wed").checked;
	var c5 = document.getElementById("Thu").checked;
	var c6 = document.getElementById("Fri").checked;
	var c7 = document.getElementById("Sat").checked;
	console.log(c1);
	var dsets = [];
	var lset = [];

	var dval = document.getElementById("drange").options[document.getElementById("drange").selectedIndex].value;


	var l;
	var d;

	//Grab the columns associated with specific data types
	if (dval == "Avg") {

		l = "Average";
		d = arrayColumn(tdat, 3);
	}

	else if (dval == "Min") {

		l = "Minimum";
		d = arrayColumn(tdat, 4);
	}

	else if (dval == "Max") {

		l = "Maximum";
		d = arrayColumn(tdat, 8);
	}

	d = d.slice(1, lsize);

	//Options set in here so they can be variable. Only delineates every week
	var options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top"
			},
			title: {
				display: true,
				text: l
			},
		},

		scales : {

			x: {

				ticks: {
					callback: function(index) {
						return index % 24 === 0 ? "Week " + ((index / 24) + 1) : "";
					},
					autoSkip: false
				},

				grid : {

					display: false
				}
			},

			y: {
				min: 0

			}

		}
	};


	var sund = [];
	var mond = [];
	var tued = [];
	var wedd = [];
	var thud = [];
	var frid = [];
	var satd = [];
	var dateval;

	var count;
	var track;

	//Loops through assigning data to sepcific days
	for (var i = 0; i < labels.length; i++) {


		dateval = new Date(labels[i].split(" ")[0]);

		if (i === 0) {

			count = 0;
			track = dateval.getDay(); 
		}


		if (dateval.getDay() == track) {

			count = count + 1;
			lset.push("Hour " + count);
		}



		switch (dateval.getDay()) {
			case 0:
				sund.push(d[i]);
				break;
			case 1:
				mond.push(d[i]);
				break;
			case 2:
				tued.push(d[i]);
				break;
			case 3:
				wedd.push(d[i]);
				break;
			case 4:
				thud.push(d[i]);
				break;
			case 5:
				frid.push(d[i]);
				break;
			case 6:
				satd.push(d[i]);
			default:
				break;
		}


	}

	var sun = {

		data: sund,
		label: "Sunday",
		borderColor: "rgb(230, 25, 75)",
		backgroundColor: "rgba(230, 25, 75, 0.25)"

	};

	var mon = {

		data: mond,
		label: "Monday",
		borderColor: "rgb(245, 130, 48)",
		backgroundColor: "rgba(245, 130, 48, 0.25)"

	};

	var tue = {

		data: tued,
		label: "Tuesday",
		borderColor: "rgb(255, 255, 25)",
		backgroundColor: "rgba(255, 255, 25, 0.25)"

	};

	var wed = {

		data: wedd,
		label: "Wednesday",
		borderColor: "rgb(60, 180, 75)",
		backgroundColor: "rgba(60, 180, 75, 0.25)"


	};

	var thu = {

		data: thud,
		label: "Thursday",
		borderColor: "rgb(0, 130, 200)",
		backgroundColor: "rgba(0, 130, 200, 0.25)"

	};

	var fri = {

		data: frid,
		label: "Friday",
		borderColor: "rgb(240, 50, 230)",
		backgroundColor: "rgba(240, 50, 230, 0.25)"

	};

	var sat = {

		label: "Saturday",
		data: satd,
		borderColor: "rgb(128, 128, 128)",
		backgroundColor: "rgba(128, 128, 128, 0.25)"
	};



	if (c1 != true && c2 != true && c3 != true && c4 != true && c5 != true && c6 != true && c7 != true) {

		alert("Please check at least one day.");
		return;
	}


	//Add data to the graph's dataset if the specific box is checked
	if (c1) {

		dsets.push(sun);
	}

	if (c2) {

		dsets.push(mon);
	}

	if (c3) {

		dsets.push(tue);
	}

	if (c4) {

		dsets.push(wed);
	}

	if (c5) {

		dsets.push(thu);
	}

	if (c6) {

		dsets.push(fri);
	}

	if (c7) {

		dsets.push(sat);
	}


	console.log(dsets);
	data = {

		labels: lset,
		datasets: dsets
	};


	var w = window.innerWidth;
	var h = window.innerHeight;

	if (w < 1000) {

		w = 1000;
		options.responsive = "false";
	}

	console.log(w);
	console.log(options.responsive);
	ReactDOM.render(<div id="gg"><Line overflow-x={"scroll"} width={w} height={h} options={options} data={data} /></div>, document.getElementById("root"));
};


//As of right now, the CSV Reader loading thing is from the offical react-papaparse website
export default function GraphStart() {

	const { CSVReader } = useCSVReader();

	return (

		<>

		<CSVReader
		onUploadAccepted={(results: any) => {
			console.log("---------------------------");
			console.log(results);
			console.log("---------------------------");
			console.log(results.data[1]);
			tdat = results.data;
			labels = arrayColumn(results.data, 1);
			labels = labels.slice(1, (labels.length - 1));
			lsize = labels.length;
			console.log(labels);
		}}
		>

		{({
			getRootProps,
			acceptedFile,
			ProgressBar,
			getRemoveFileProps,
		}: any) => (
			<>
			<div style={styles.csvReader}>
			<button type="button" {...getRootProps()} style={styles.browseFile}>
			Browse file
			</button>
			<div style={styles.acceptedFile}>
			{acceptedFile && acceptedFile.name}
			</div>
			<button {...getRemoveFileProps()} style={styles.remove}>
			Remove
			</button>
			</div>
			<ProgressBar style={styles.progressBarBackgroundColor} />
			</>
		)}
		</CSVReader>

		<p>Choose the days you want displayed:</p>
		<div>
		<input type="checkbox" id="Sun"></input>
		<label for="Sun">Sunday</label>
		</div>

		<div>
		<input type="checkbox" id="Mon"></input>
		<label for="Mon">Monday</label>
		</div>

		<div>
		<input type="checkbox" id="Tue"></input>
		<label for="Tue">Tuesday</label>
		</div>

		<div>
		<input type="checkbox" id="Wed"></input>
		<label for="Wed">Wednesday</label>
		</div>

		<div>
		<input type="checkbox" id="Thu"></input>
		<label for="Thu">Thursday</label>
		</div>

		<div>
		<input type="checkbox" id="Fri"></input>
		<label for="Fri">Friday</label>
		</div>

		<div>
		<input type="checkbox" id="Sat"></input>
		<label for="Sat">Saturday</label>
		</div>

		<p>Select an hourly data type:</p>
		<select id="drange">
		<option value="Avg">Average</option>
		<option value="Min">Minimum</option>
		<option value="Max">Maximum</option>
		</select>

		<p></p>
		<button onClick={draw}>Draw Graph</button>
		</>


	);

}


