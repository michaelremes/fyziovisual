import React, { Component } from "react";
import ApexCharts from 'apexcharts';
import ReactApexChart from "react-apexcharts";
import { api_url } from "../../../../config/config"

let sensordata = [];

let lastIndex = -1;


function timeFormat(duration)
{   
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

class ECGChart extends Component {
  constructor(props) {
    super(props);
    this.state = {

      series: [{
        data: sensordata
      }],
      options: {
        chart: {
          id: 'realtime_ecg',
          height: 300,
          type: 'line',
          zoom: {
            enabled: false
          },
          animations: {
            enabled: false,
          },
          toolbar: {
            show: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 1.5
        },
        yaxis: {
          show: false,
        },
        
        xaxis: {
          tickAmount: 4,
          type: 'category',
          labels: {
            maxHeight: 50,
            rotate: 0,
            offsetX: 5,
            offsetY: 2,
            show: true,
             formatter: (val) => {
               return timeFormat(lastIndex + val/76);
             }

          },
        }
      }
    };



    this.intervalId = null;
    this.loadData = this.loadData.bind(this);
  }


  componentDidMount() {
    /* function calls to retrieve data every second */
    let intervalId = setInterval(() => {
      this.loadData();

      let today = new Date();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
     // currentTime = time;

      ApexCharts.exec('realtime_ecg', 'updateSeries', [{
        data: sensordata
      }])
    }, 2000);
    this.setState({ intervalId: intervalId });
  }

  componentDidUpdate() {

  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  loadData() {

    //fetch(this.props.sensor_url)
    fetch(api_url + '/modules/sensor/ecg')
      .then(res => res.json())
      .then(
        (response) => {
          sensordata = response.data.data;
          lastIndex = response.data.index / 700;
          /* compressing data */
          for (var i = 0; i < sensordata.length; i++) {
            sensordata.splice(i + 1, 10);
          }
          console.log('delka: ' + sensordata.length);
  
          console.log('index: ' + lastIndex + ' sensor data: ' + sensordata);
  
  
  
        },
        (error) => {
  
        }
      )
  
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart options={this.state.options} series={this.state.series} type="line" height={350} />
      </div>
    );
  }
}

export default ECGChart;