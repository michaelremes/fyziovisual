const fs = require('fs');
const readline = require('readline');
const express = require('express');
const axios = require('axios');
const app = express();

/* parse arguments */
var args = process.argv.slice(2);
/* load config file sensor instaces */
var pathToConfig = args[0];
const config = require(pathToConfig.toString());

let get_response = {};
let buffer = [];
/* number of lines to be stored in buffer */
const intervalTime = 730;
const frequency = 700;
const bufferCapacity = frequency * (intervalTime/1000);
//const bufferCapacity = 700;
let data_index = 0;

async function parseRespiBAN(line, dataType) {
  let columns = line.split('\t');
  switch (dataType) {
    case 'index':
      return +columns[0];
    case 'ecg':
      return +columns[2];
    case 'eda':
      return +columns[3];
    case 'emg':
      return +columns[4];
    case 'temperature':
      return +columns[5];
    case 'respiration':
      return +columns[9];
    default:
      return 0;
  }
}

async function loadBuffer(postData) {
  /* create reading stream */
  const fileStream = fs.createReadStream(config.data_sample);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });


  /* Each line from sample data will be available here as `line` */
  for await (const line of rl) {
    /* omit header lines */
    if (line[0] == '#') continue;
    if(buffer.length === 0)data_index = await parseRespiBAN(line, 'index');
    let ecg_data = await parseRespiBAN(line, config.data_type);

    /* add line to buffer */
    buffer.push(ecg_data);
    /* buffer is full */
    if (buffer.length == bufferCapacity) {
      /* post data to server */
      if (postData){
        sendData(buffer);
      } 

    //  console.log({ index: data_index, data: buffer })

      // for (let i = 0; i < bufferCapacity; i++) {
      //   console.log("data: " + buffer[i]);
      // }
      /* wait for interval */
      await sleep(intervalTime);
     // console.log(buffer)
      /* empty buffer */
      buffer = [];
    }
  }
}



/* make program sleep for given ms */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function sendData(sensor_data) {
  /* data to send */
  const data = {
    data: sensor_data
  };

  /* sending post request to ecg endpoint using axios */
  axios
    .post('http://localhost:4000/modules/ecg', data)
    .then(res => {
      console.log(`data sent, statusCode: ${res.status}`)
    })
    .catch(error => {
      console.error(error)
    })
}



/* GET endpoint to fetch buffered data from RespiBAN sample */
app.get('/data', function (req, res) {
  get_response = { index: data_index, data: buffer };
 // console.log("data: " + JSON.stringify(get_response));
  res.send(get_response);
})



/* give UID to sensors */


/* server initialization */
app.listen(config.port, config.hostname, function () {
  console.log(`Sensor app running at http://${config.hostname}:${config.port}/`);
  /* -------------- sensor actions ----------------- */

  /* start reading sample data */
  loadBuffer(postData = false);
})





