
abstract class Abstract_Output {


      protected dataIndex: number;

      protected data_type: string;
      abstract flatten(): (number | string)[];
      abstract addToBuffer(data: any): void;
      getIndex(): number { return this.dataIndex };
      getDataType(): string { return this.data_type };

}
export default Abstract_Output;