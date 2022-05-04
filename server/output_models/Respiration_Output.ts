import Abstract_Output from "./Abstract_Output";



class Respiration_Output extends Abstract_Output {

    
    private dataBuffer: (number|string)[];

    constructor(dataBuffer:(number|string)[], index: number) {
        super();
        this.dataBuffer = dataBuffer;
        this.data_type = 'respiration';
        this.dataIndex = index;
    }


    flatten(): (string|number)[] {
        return this.dataBuffer.flat();
    }

    addToBuffer(data: (string|number)[]): void {
        this.dataBuffer.push(...data)
    }
}



export default Respiration_Output;