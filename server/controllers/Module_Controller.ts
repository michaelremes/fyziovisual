import ModuleSchema from '../mongo_models/Module'
import { ObjectId } from 'mongodb';
import client from '../server'

class Module_Controller {

    private dbName;
    private db;
    private module_collection;


    constructor() {
        // Database Name
        this.dbName = 'fyziovisual';
        this.db = client.db(this.dbName);
        this.module_collection= this.db.collection('modules');
    }

    /* methods */
    async getModules() {
        const moduleCollection = await this.module_collection.find({}).toArray();

        return moduleCollection;
    }

    async addModule(body: any) {

        const newModule = new ModuleSchema();

        newModule.name = body.name;
        newModule.category = body.category;
        newModule.type = body.type;
        newModule.data = body.data;

        const insertResult = await this.module_collection.insertOne(newModule);
        console.log('Inserted document =>', insertResult);


    }


    async deleteModule(moduleId: Object) {
        /* convert module id to ObjectId to create object for Mongo */
        const moduleToDelete = { "_id": new ObjectId(moduleId.toString()) };

        const deleteResult = await this.module_collection.deleteOne(moduleToDelete);
        console.log('Removed document =>', deleteResult);
    }

    async updateModule(moduleId: Object, moduleBody: string) {
        const moduleToUpdate = { "_id": new ObjectId(moduleId.toString()) };

        const result = await this.module_collection.updateOne(moduleToUpdate, {$set: moduleBody});
        console.log('Updated document =>', result);
    }

}

export default Module_Controller;