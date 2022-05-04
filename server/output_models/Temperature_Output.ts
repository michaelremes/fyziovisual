import Abstract_Output from "./Abstract_Output";



class Temperature_Output extends Abstract_Output {


    private dataBuffer: (number|string)[];

    constructor(dataBuffer: (number | string)[]) {
        super();
        this.dataBuffer = dataBuffer;
    }

    flatten(): (string | number)[] {

        return this.dataBuffer.flat();
    }

    addToBuffer(data: (string | number)[]): void {
        this.dataBuffer.push(...data)
    }
}



export default Temperature_Output;