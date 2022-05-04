import Abstract_Module from "../Abstracts/Abstract_Module";
import Analytical_Module from "../Abstracts/Analytical_Module";
import Input_Module from "../Abstracts/Input_Module";
import BPM_Output from "../../output_models/BPM_Output";
import Abstract_Output from "../../output_models/Abstract_Output";

import module_router from "../../routes/module_routes";
import JSONResponse from '../../libs/JSONResponse'

let bpm_buffer: number[] = [];

module_router.get('/bpm', (req: any, res: any) => {
    try {
        JSONResponse.success(req, res, null, bpm_buffer);
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})

class BPM_Module extends Analytical_Module {

    id: string;
    script_path: string;
    sample_rate: number;
    sources: Input_Module[];

    constructor(node_config: any) {
        super(Abstract_Module);

        this.sources = [];
        this.dataBuffer = [];
        this.id = node_config.id;
        this.script_path = node_config.data.node_config.script_path;
        this.sample_rate = node_config.data.node_config.sample_rate;


    }

    print(): void {
        console.log('BPM node id: ' + this.id);
        console.log('sources: ');
        for (let source of this.sources) {
            console.log('{')
            source.print();
            console.log('},')
        }
    }

    getBPM(sourceData: (string | number)[]) {
        /* Generate a python process using nodejs child_process module */
        const spawn = require('child_process').spawn;
        const py_process = spawn('python', [this.script_path, this.sample_rate]);

        let dataResult: number;

        /* Define what to do on everytime node application receives data from py_process */
        py_process.stdout.on('data', function (response: any) {
          //  console.log('heart_rate: ' + response);
            dataResult = +response;
            bpm_buffer.push(dataResult);
        });

        /* At the end, show the result from py_process computing (stored in 'dataResult') */
        py_process.stdout.on('end', function () {
        //    console.log('heart_rate: ' + dataResult);
         //   console.log('bpm buff: ' + bpm_buffer)
        });

        /* Stringify the array before send to py_process */
        py_process.stdin.write(JSON.stringify(sourceData));

        /* Close the stream */
        py_process.stdin.end();

    }

    getData(): Abstract_Output {
        const dataOutput: BPM_Output = new BPM_Output([]);
        for (let source of this.sources) {
            this.dataBuffer.push(...source.getData().flatten());
        }
        if (this.dataBuffer.length > 4000) {
            this.getBPM(this.dataBuffer);
        }

        dataOutput.addToBuffer(bpm_buffer);
        if(bpm_buffer.length > 20)
        {
            bpm_buffer.splice(0, 10);
        }
        if(this.dataBuffer.length > 8400)
        {
            this.dataBuffer.splice(0, 4200);
        }
    
        return dataOutput;
    }


}

export default BPM_Module;