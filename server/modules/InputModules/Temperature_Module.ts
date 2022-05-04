import Input_Module from "../Abstracts/Input_Module";

import axios from 'axios';

import ECG_Output from "../../output_models/ECG_Output";
import Abstract_Output from "../../output_models/Abstract_Output";




class Temperature_Module extends Input_Module {

    endpoint: string;

    /* time range in seconds */
    timeRangeInSec: number;

    /* ecg frequency in hertz */
    ecg_frequency: number;


    
    constructor(node: any) {
        super(Input_Module);
        this.endpoint = node.data.input_source;
        this.timeRangeInSec = 6;
        this.ecg_frequency = 700;
        /* after the creation of ECG module, getting data starts */
        this.loadBuffer();
    }

    print(): void {
        console.log('ECG node id: ' + this.id);
       // console.log('sources: ' + this.sources);
    }
    async loadBuffer() {
        /* calling GET ecg endpoint from sensor.js*/
        while (1) {
            let responseData: any;
            await axios.get(this.endpoint)
                .then(function (response: any) {
                    responseData = response.data;
                })
                .catch(function (error: any) {
                    /* error */
                    console.log(error);
                });
            /* if sensor return valid data */
            if (responseData !== undefined) {
                this.mergeData(responseData, 4200);
            }

            /* getting data every 500ms */
            await this.sleep(500);
        }
    }

    async fetchSensor() {
        let responseData: any = {};
        await axios.get(this.endpoint)
            .then(function (response: any) {
                responseData = response;
            })
            .catch(function (error: any) {
                /* error */
                console.log(error);
            });

        return responseData;
    }


    getData(): Abstract_Output {

        let dataOutput: ECG_Output = new ECG_Output(this.dataBuffer, this.lastIndex);


        return dataOutput;
    };


    checkForCorrectSequence(buffer: any[]) {
        let startNumber = buffer[0];
        let allNumbersMatch: boolean = true;
        console.log('start: ' + startNumber)
        console.log('buffer start: ' + buffer[0])
        for (let i = 0; i < buffer.length; i++) {
            // console.log('index: '+ i);
            //console.log(buffer[i])
            // console.log(startNumber)
            if (startNumber !== buffer[i]) {
                console.error(startNumber + " se nerovna " + buffer[i]);
                allNumbersMatch = false;
            }

            startNumber++;
        }
        console.log('all numbers match: ' + allNumbersMatch);
    }


    sleep(ms: any) {
        return new Promise(resolve =>
            setTimeout(resolve, ms));
    }
}



export default Temperature_Module;