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

const test = [
  ["", "Date", "Readings", "Average", "Min", "Quartile 25", "Median", "Quartile 75", "Max", "Standard Deviation"],
  ["1","11/01/2021 1:00 AM","12 (4%)","175","163","166.0","171.0","188.5","192","10.9"],
  ["2","11/01/2021 2:00 AM","12 (4%)","163","153","158.0","164.0","168.0","171","5.9"],
  ["3","11/01/2021 3:00 AM","12 (4%)","135","129","131.0","133.0","140.5","150","6.2"],
  ["4","11/01/2021 4:00 AM","12 (4%)","125","116","117.5","129.0","130.0","130","5.9"],
  ["5","11/01/2021 5:00 AM","12 (4%)","127","122","126.0","129.0","130.0","131","2.7"],
  ["6","11/01/2021 6:00 AM","12 (4%)","128","123","125.0","127.0","132.0","136","4.2"],
  ["7","11/01/2021 7:00 AM","12 (4%)","134","128","132.5","134.5","136.0","137","2.4"],
  ["8","11/01/2021 8:00 AM","12 (4%)","127","119","121.0","122.5","132.0","149","9.2"],
  ["9","11/01/2021 9:00 AM","12 (4%)","145","143","144.5","145.0","147.5","149","1.9"],
  ["10","11/01/2021 10:00 AM","12 (4%)","135","131","133.0","134.0","139.5","143","3.9"],
  ["11","11/01/2021 11:00 AM","12 (4%)","135","131","133.0","134.5","139.5","143","4"],
  ["12","11/01/2021 12:00 PM","12 (4%)","126","113","117.0","125.5","137.0","141","10"],
  ["13","11/01/2021 1:00 PM","12 (4%)","147","116","130.5","153.0","165.0","168","18.5"],
  ["14","11/01/2021 2:00 PM","12 (4%)","144","84","104.5","155.0","180.0","190","38.9"],
  ["15","11/01/2021 3:00 PM","12 (4%)","177","156","159.0","179.0","195.5","200","16.6"],
  ["16","11/01/2021 4:00 PM","12 (4%)","213","196","207.0","212.5","223.5","228","9.5"],
  ["17","11/01/2021 5:00 PM","12 (4%)","212","206","209.5","211.5","214.0","218","3.5"],
  ["18","11/01/2021 6:00 PM","12 (4%)","203","199","200.5","202.5","206.5","212","4"],
  ["19","11/01/2021 7:00 PM","12 (4%)","204","179","196.0","209.0","214.0","216","11.5"],
  ["20","11/01/2021 8:00 PM","12 (4%)","167","162","163.5","166.0","172.5","175","4.5"],
  ["21","11/01/2021 9:00 PM","12 (4%)","194","161","169.5","196.0","216.0","229","24.6"],
  ["22","11/01/2021 10:00 PM","12 (4%)","175","157","159.0","161.5","195.0","209","19.7"],
  ["23","11/01/2021 11:00 PM","12 (4%)","160","154","156.5","159.5","164.0","167","4.1"],
  ["24","11/02/2021 12:00 AM","12 (4%)","173","155","157.0","174.0","188.5","189","15.1"],
  ["25","11/02/2021 1:00 AM","12 (4%)","247","223","226.0","246.0","268.5","273","19.6"],
  ["26","11/02/2021 2:00 AM","12 (4%)","251","246","248.0","251.0","253.5","260","3.8"],
  ["27","11/02/2021 3:00 AM","12 (4%)","246","243","246.5","247.0","248.0","250","1.8"],
  ["28","11/02/2021 4:00 AM","12 (4%)","240","233","235.0","241.5","244.5","245","4.5"],
  ["29","11/02/2021 5:00 AM","12 (4%)","220","213","214.5","217.0","227.0","236","8.4"],
  ["30","11/02/2021 6:00 AM","12 (4%)","208","187","205.0","213.0","214.0","215","8.8"]
];  

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

  /*
	if (c1 != true && c2 != true && c3 != true) {
		alert("Please check at least one data type.");
		return;
	}
  */

	//Adds the data to the graph's set if the appropriate checkbox is clicked
	//if (c1) {
		dsets.push(cavg);
	//}

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

const getData = async(e) => {
  e.preventDefault();
  tdat = test;
  labels = arrayColumn(test, 1);
  labels = labels.slice(1, (labels.length - 1));
  lsize = labels.length;
  draw();
}

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [username, getUsername] = useState(localStorage.getItem('user'));
  
	const { CSVReader } = useCSVReader();

	var dsets = [];
	var lset = labels;

	var sub = 24;
	var glen;

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

  /*
	if (c1 != true && c2 != true && c3 != true) {
		alert("Please check at least one data type.");
		return;
	}
  */

	data = {
		labels: lset,
		datasets: dsets
	};

	var w = window.innerWidth;
	var h = window.innerHeight;

  /*
	if (w < 1000) {
		w = 1200;
	  ReactDOM.render(<div id="gg" style={{height:"150%", width: "300%"}}><Line overflow-x={"hidden"} width={w} height={h} options={options} data={data} /></div>, document.getElementById("graph"));
	}

	else {
		ReactDOM.render(<div class="drawn" id="gg"><Line overflow-x={"hidden"} width={w} height={h} options={options} data={data} /></div>, document.getElementById("graph"));
	}
  */

  return (
    <>
    <div className="Dashboard">
      <Form onSubmit={getData}>
        <Button block size="lg" type="submit">
          Test
        </Button>
      </Form>
		  
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
        {ReactDOM.render(<div id="gg" style={{height:"150%", width: "300%"}}><Line overflow-x={"hidden"} width={window.innderWidth} height={window.innerHeight} options={options} data={data} /></div>, document.getElementById("graph"))}
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
    </div>
    </>
  );
}