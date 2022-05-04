import { InfluxDB, Point } from '@influxdata/influxdb-client'
import Output_Module from "../Abstracts/Output_Module";


class InfluxDB_Module extends Output_Module {

    id: string;
    dataBuffer: (string | number)[];

    private url: string;
    private org: string;
    private bucket: string;
    private token: string;

    constructor(node: any) {
        super(Output_Module);
        this.url = node.data.node_config.influx_config.url;
        this.org = node.data.node_config.influx_config.org;
        this.bucket = node.data.node_config.influx_config.bucket;
        this.token = node.data.node_config.influx_config.token;

        this.sources = [];
        this.id = node.id;
    }


    sleep(ms: any) {
        return new Promise(resolve =>
            setTimeout(resolve, ms));
    }
    print(): void {
        console.log('Influx node id: ' + this.id);
        console.log('sources: ');
        for (let source of this.sources) {
            console.log('{')
            source.print();
            console.log('},')
        }
        console.log('data: ' + this.dataBuffer);
    }

    /* load local buffer that will be send to InfluxDB */
    loadBuffer(): void {
        for (let source of this.sources) {
            let childrenData = source.getData();
          //  this.writeData(childrenData.flatten(), childrenData.getDataType())
        }
    }


    /* write data to InfluxDB */
    writeData(data: (string | number)[], data_type: string): void {
        /** InfluxDB Environment variables **/
        const url = this.url;
        const token = this.token;
        const org = this.org;
        const bucket = this.bucket;
        /**
         * Instantiate the InfluxDB client
         * with a configuration object.
         **/
        const influxDB = new InfluxDB({ url, token });

        /**
         * Create a write client from the getWriteApi method.
         * Provide your `org` and `bucket`.
         **/
        const writeApi = influxDB.getWriteApi(org, bucket);

        //   console.log('data length: ' + data.length);
        console.log('writing data: ' + data);

        /**
         * Create a point and write it to the buffer.
         **/
        for (let i = 0; i < data.length; i++) {
            const point1 = new Point(data_type)
                .tag('sensor', 'RespiBAN')
                .floatField('value', data[i])
                .timestamp("");

            writeApi.writePoint(point1);
        }


        /**
         * Flush pending writes and close writeApi.
         **/
        writeApi.close().then(() => {
            console.log('write to Influx successful, connection closed');
        })

    }


}



export default InfluxDB_Module;

