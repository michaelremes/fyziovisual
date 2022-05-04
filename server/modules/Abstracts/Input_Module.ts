import Abstract_Module from "./Abstract_Module";
import Abstract_Output from "../../output_models/Abstract_Output";



abstract class Input_Module extends Abstract_Module {

    protected lastIndex: number;
    protected endpoint: string;
    protected timeRangeInSec: number;
    protected frequency: number;

    constructor(node_config: any) {
        super(Abstract_Module);

        this.lastIndex = -1;

    }


    abstract getData(): Abstract_Output;

    mergeData(data_arr: any, bufferSize: number) {
        if (data_arr.index !== this.lastIndex) {
            this.dataBuffer.splice(data_arr.index, this.dataBuffer.length);
            this.dataBuffer.push(...data_arr.data);
            this.lastIndex = data_arr.index;


            if (this.dataBuffer.length > bufferSize) {
                this.dataBuffer.splice(0, this.dataBuffer.length - bufferSize);
            }
        }
    }


}



export default Input_Module;