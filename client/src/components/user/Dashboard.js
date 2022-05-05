import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Dashboard.css";
import React, { CSSProperties, useState } from 'react';

import { useCSVReader } from 'react-papaparse';

import csvtojson from 'csvtojson';

import ReactDOM from 'react-dom';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

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
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 10
	},
	browseFile: {
		width: '20%',
	},
	acceptedFile: {
		border: '1px solid #ccc',
		height: 45,
		lineHeight: 2.5,
		paddingLeft: 10,
		width: '80%'
	},
	remove: {
		borderRadius: 0,
		padding: '0 20px'
	},
	progressBarBackgroundColor: {
		backgroundColor: 'red'
	}
};


//A simple function to swap an array's rows and columns
const arrayColumn = (arr, n) => arr.map(x => x[n]);

//Chart.js options
export const options = {
	responsive: true,
	maintainAspectRatio: true,
	plugins: {
		legend: {
			position: 'top',
			labels: {
				font: {
					size: 20
				}
			}
		},
		title: {
			display: true,
			text: 'Recent Data',
			font: {
				size: 30
			}
		},
	},
	scales: {
		x: {
			ticks: {
				font: {
					size: 20
				}
			},
			grid : {
				display: false
			}
		},
		y: {
			min: 0,
			title : {
				display: true,
				text: "Blood Glucose (mg/dL)",
				font: {
					size: 24
				}
			},
			ticks: {
				font: {
					size: 20
				}
			}
		}
	}
};


//Globals used in several functions
var labels = [];
var tdat = [];
var data = {};
var lsize;

//Draws the graph
export function draw() {
	var c1 = document.getElementById("Avg").checked;
	var c2 = document.getElementById("Min").checked;
	var c3 = document.getElementById("Max").checked;
	console.log(c1);
	var dsets = [];
	var lset = labels;

	var sub;
	var glen;
	var dval = document.getElementById("trange").options[document.getElementById("trange").selectedIndex].value;

	//Determines how far back in the array the graph will start reading
	if (dval == "1day") {
		sub = 24;
	}
	else if (dval == "3day") {
		sub = 72;
	}
	else if (dval == "1week") {
		sub = 168;
	}
	else if (dval == "2week") {
		sub = 336
	}
	else if (dval == "1month") {
		sub = 720;
	}
	else if (dval == "2month") {
		sub = 1440;
	}
	else if (dval == "3month") {
		sub = 2160;
	}

	glen = lsize - sub;

	if (glen < 0) {
		alert("Not enough user data. Please select a shorter time span.");
		return;
	}

	lset = lset.slice(glen, lsize);
	console.log(lset);

	//Data for the graph
	var cavg = {
		label: "Average",
		data: arrayColumn(tdat, 3).slice(glen, lsize),
		borderColor: 'rgb(255, 99, 132)',
		backgroundColor: 'rgba(255, 99, 132, 0.5)'
	};

	var cmin = {
		label: "Minimum",
		data: arrayColumn(tdat, 4).slice(glen, lsize),
		borderColor: 'rgb(99, 132, 255)',
		backgroundColor: 'rgba(99, 132, 255, 0.5)'

	};

	var cmax = {
		label: "Maximum",
		data: arrayColumn(tdat, 8).slice(glen, lsize),
		borderColor: 'rgb(132, 255, 99)',
		backgroundColor: 'rgba(132, 255, 99, 0.5)'
	};

	if (c1 != true && c2 != true && c3 != true) {
		alert("Please check at least one data type.");
		return;
	}

	//Adds the data to the graph's set if the appropriate checkbox is clicked
	if (c1) {
		dsets.push(cavg);
	}

	if (c2) {
		dsets.push(cmin);
	}

	if (c3) {
		dsets.push(cmax);
	}

	console.log(dsets);
	data = {
		labels: lset,
		datasets: dsets
	};

	var w = window.innerWidth;
	var h = window.innerHeight;

	if (w < 1000) {
		w = 1200;
	  ReactDOM.render(<div id="gg" style={{height:"150%", width: "300%"}}><Line overflow-x={"hidden"} width={w} height={h} options={options} data={data} /></div>, document.getElementById("graph"));
	}

	else {
		ReactDOM.render(<div class="drawn" id="gg"><Line overflow-x={"hidden"} width={w} height={h} options={options} data={data} /></div>, document.getElementById("graph"));
	}

	console.log(w);
	console.log(h);

	console.log(options.responsive);
	console.log(options.maintainAspectRatio);
};

const fetchData = async (e) => {
  const username = localStorage.getItem('user');
  e.preventDefault();
  let result = await fetch(
  'http://localhost:8082/fetch', {
      method: "post",
      body: JSON.stringify({ username }),
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }
  }).then(response => {
    if (response.ok) {
        return response.json();
    }
    throw response;
  }).then(data => {
    if (data === false) {
      alert("Bad username/password");
      localStorage.setItem('user', false);
    }
    else {
      //alert("Login successful");
      window.location.replace("/dashboard");
    }
  }).catch(error => {
    console.error(error);
  }).finally(() => {
  });
}

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [username, getUsername] = useState(localStorage.getItem('user'));
  
	const { CSVReader } = useCSVReader();

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    let result = await fetch(
    'http://localhost:8082/upload', {
        method: "post",
        body: JSON.stringify({ username }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
      if (response.ok) {
          return response.json();
      }
      throw response;
    }).then(data => {
      if (data === false) {
        alert("Upload error");
      }
      else {
        alert("Upload successful");
        //window.location.replace("/dashboard");
      }
    }).catch(error => {
      console.error(error);
    }).finally(() => {
    });
}

  return (
    
    <div className="Dashboard">
		  <>
      <CSVReader
        onUploadAccepted={(results: any) => {
          console.log('---------------------------');
          console.log(results);
          console.log('---------------------------');
          console.log(results.data[1]);
          tdat = results.data;
          labels = arrayColumn(results.data, 1);
          labels = labels.slice(1, (labels.length - 1));
          lsize = labels.length;
          //console.log(labels);
        }}
      >

        {({
          getRootProps,
        }: any) => (
          <>
          <div>
            <button class="graph" type='file' {...getRootProps()} style={styles.browseFile}>
              Upload
            </button>
          </div>
          </>
        )}
      </CSVReader>

      <div class="graph" id="graph">
        <p>Choose your hourly data:</p>
        <div>
          <input type="checkbox" id="Avg"></input>
          <label for="Avg">Average</label>
        </div>

        <div>
          <input type="checkbox" id="Min"></input>
          <label for="Min">Minimum</label>
        </div>

        <div>
          <input type="checkbox" id="Max"></input>
          <label for="Max">Maximum</label>
        </div>

        <p>Select a time range:</p>
        <select id="trange">
          <option value="1day">1 Day</option>
          <option value="3day">3 Days</option>
          <option value="1week">1 Week</option>
          <option value="2week">2 Weeks</option>
          <option value="1month">1 Month</option>
          <option value="2month">2 Months</option>
          <option value="3month">3 Months</option>
        </select>

        <p></p>
        <button onClick={draw}>Draw Graph</button>
      </div>
      </>
    </div>
  );
}

function GraphStart() {

	const { CSVReader } = useCSVReader();

	return (

		<>

    <Form>
    <CSVReader
		onUploadAccepted={(results: any) => {
			console.log('---------------------------');
			console.log(results);
			console.log('---------------------------');
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
			<div class="graph" style={styles.csvReader}>
			<button type='button' {...getRootProps()} style={styles.browseFile}>
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

		<div classname="graph">
		<p>Choose your hourly data:</p>
		<div>
		<input type="checkbox" id="Avg"></input>
		<label for="Avg">Average</label>
		</div>

		<div>
		<input type="checkbox" id="Min"></input>
		<label for="Min">Minimum</label>
		</div>

		<div>
		<input type="checkbox" id="Max"></input>
		<label for="Max">Maximum</label>
		</div>

		<p>Select a time range:</p>
		<select id="trange">
		<option value="1day">1 Day</option>
		<option value="3day">3 Days</option>
		<option value="1week">1 Week</option>
		<option value="2week">2 Weeks</option>
		<option value="1month">1 Month</option>
		<option value="2month">2 Months</option>
		<option value="3month">3 Months</option>
		</select>

		<p></p>
		<button onClick={draw}>Draw Graph</button>
		</div>
    </Form>
		</>
	);
}