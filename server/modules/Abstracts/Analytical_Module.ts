import Abstract_Module from "./Abstract_Module";
import Input_Module from "./Input_Module";


abstract class Analytical_Module extends Input_Module {

    id: string;
    sources: Input_Module[];

    constructor(node_config: any) {
        super(Abstract_Module);
        this.id = node_config.id;
        this.sources = [];
        this.dataBuffer = []
    }

    getSources(): Input_Module[] {
        return this.sources;
    }
    addSource(nodeObj: Input_Module) {
        this.sources.push(nodeObj);
    }
}



export default Analytical_Module;