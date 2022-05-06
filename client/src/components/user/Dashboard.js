import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Dashboard.css";
import React, { CSSProperties, useEffect, useState } from 'react';

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
import { draw } from "../graph/dategraph";

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
		marginBottom: 10,
		width: '40%',
		
	},
	browseFile: {
		width: '20%',
	},
	acceptedFile: {
		border: '1px solid #ccc',
		lineHeight: 2.5,
		paddingLeft: 0,
		width: '50%',
		color: 'white'
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
const numHours = 24;

const onFileUpload = async() => {
	const username = localStorage.getItem('user');
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
	}).catch(error => {
	  console.error(error);
	}).finally(() => {
	});
};

const uploadFile = async(fileData) => {
	console.log(fileData);
	const username = localStorage.getItem('user');
	let result = await fetch(
	'http://localhost:8082/upload', {
		method: "post",
		body: JSON.stringify({ username, fileData }),
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
	}).catch(error => {
	  console.error(error);
	}).finally(() => {
	});
};
  
const Dashboard = () => {
	const { CSVReader } = useCSVReader();
	var [diabData, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const username = localStorage.getItem('user');
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
				if (data["Data"]){
					setData(JSON.stringify(data["Data"]));
				}
			}).catch(error => {
			    console.error(error);
			}).finally(() => {
			});
		  }
		  fetchData();
	}, []);

	console.log(diabData);
	
	if (diabData.length === 0) return (
		<>
		<div className="Dashboard"> 
			<CSVReader
				onUploadAccepted={(results: any) => {
					uploadFile(results);
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
				<button type='button' {...getRootProps()} style={styles.browseFile}>
					Browse file
				</button>
				<div style={styles.acceptedFile}>
					{acceptedFile && acceptedFile.name}
				</div>
			</div>
			<ProgressBar style={styles.progressBarBackgroundColor} />
			</>
			)}
			</CSVReader>
		</div>
		</>
	);
	
	var parsedData = JSON.parse(diabData);
	var count = 0;
	var graphData = [];
	for (var i = parsedData.length-2; count < numHours; i--){
		if (parsedData[i]["Date"] === parsedData[i+1]["Date"]) continue;
		if (count >= parsedData.length) break;
		var arr = [];
		for (var property in parsedData[i]){
			// Convert timestamp YYYY-MM-DD hh:mm:ss to MM/DD/YYYY hh:mm (AM/PM)
			// 11/01/2021 12:00 AM
			if (property === "Date"){
				var date = parsedData[i][property];
				var year = date.slice(0, 4);
				var month = date.slice(5, 7);
				var day = date.slice(8, 10);
				var hour = date.slice(11, 13);
				var minute = date.slice(14, 16);
				var hourInt = parseInt(hour);
				var ampm = "";
				if (hourInt === 0){
					hour = "12";
					ampm = "AM";
				}
				else if (hourInt === 12){
					ampm = "PM";
				}
				else if (hourInt > 12){
					hour = String(hourInt-12);
					ampm = "PM";
				}
				else{
					ampm = "AM";
				}
				var newDate = month + "/" + day + "/" + year + " " + hour + ":" + minute + " " + ampm;
				arr.push(newDate);
				continue;
			}
			arr.push(parsedData[i][property]);
		}
		graphData.push(arr);
		count++;
	}

	tdat = graphData;
	labels = arrayColumn(test, 1);
	labels = labels.slice(1, (labels.length - 1));
	lsize = labels.length;

	//tempGetData();

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

	dsets.push(cavg);

	data = {
		labels: lset,
		datasets: dsets
	};

  return (
    <>
    <div className="Dashboard"> 
		<CSVReader
				onUploadAccepted={(results: any) => {
					uploadFile(results);
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
				<button type='button' {...getRootProps()} style={styles.browseFile}>
					Browse file
				</button>
				<div style={styles.acceptedFile}>
					{acceptedFile && acceptedFile.name}
				</div>
			</div>
			<ProgressBar style={styles.progressBarBackgroundColor} />
			</>
			)}
		</CSVReader>

		<div class="graph" id="graph">
        	<div class="drawn" id="gg" style={{height:"150%", width: "300%"}}>
	  			<Line overflow-x={"hidden"} width={window.innerWidth} height={window.innerHeight} options={options} data={data}/>
    		</div>
    	</div>
	</div>
    </>
  );
}

export default Dashboard;