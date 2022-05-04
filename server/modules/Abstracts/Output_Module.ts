import Abstract_Module from "./Abstract_Module";
import Input_Module from "./Input_Module";



abstract class Output_Module extends Abstract_Module {

    sources: Input_Module[];

    constructor(node_config: any) {
        super(Abstract_Module);

        this.sources = [];

    }
    abstract writeData(data: (string|number)[], data_type: string): void;
    abstract loadBuffer(): void;


    getSources(): Input_Module[] {
        return this.sources;
    }
    addSource(nodeObj: Input_Module) {
        this.sources.push(nodeObj);
    }



}

export default Output_Module;