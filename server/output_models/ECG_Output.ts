import Abstract_Output from "./Abstract_Output";



class ECG_Output extends Abstract_Output {


    private dataBuffer: (number|string)[];

    constructor(dataBuffer: (number | string)[], index: number) {
        super();
        this.dataBuffer = dataBuffer;
        this.dataIndex = index;
        this.data_type = 'ecg';
    }

    flatten(): (string | number)[] {

        return this.dataBuffer.flat();
    }

    addToBuffer(data: (string | number)[]): void {
        this.dataBuffer.push(...data)
    }
}



export default ECG_Output;