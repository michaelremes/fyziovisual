
abstract class Abstract_Module {

    protected id: string;
    protected dataBuffer: (number|string)[];

    constructor(config: any) {
        this.id = config.id;
        this.dataBuffer = [];
      }



      getId(): string {
        return this.id;
      }
      getDataBuffer(): (number|string)[] {
        return this.dataBuffer;
      }

      abstract print(): void;




}
export default Abstract_Module;