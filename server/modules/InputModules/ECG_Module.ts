import Input_Module from "../Abstracts/Input_Module";

import axios from 'axios';

import ECG_Output from "../../output_models/ECG_Output";
import Abstract_Output from "../../output_models/Abstract_Output";




class ECG_Module extends Input_Module {

    constructor(node: any) {
        super(Input_Module);
        this.id = node.id;
        //console.log('data: '+ JSON.stringify(node))
        if (node.data !== undefined) {
            this.endpoint = node.data.node_config.input_source;
            this.timeRangeInSec = 6;
            this.frequency = 700;

        }
        else {
            this.endpoint = "http://localhost:8000/data";
        }
        /* after the creation of ECG module, getting data starts */
        this.loadBuffer();

    }

    print(): void {
        console.log('ECG node id: ' + this.id);
        //  console.log('sources: ' + this.sources);
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

    getData(): Abstract_Output {

        let dataOutput: ECG_Output = new ECG_Output(this.dataBuffer, this.lastIndex);


        return dataOutput;
    };



    sleep(ms: any) {
        return new Promise(resolve =>
            setTimeout(resolve, ms));
    }
}



export default ECG_Module;