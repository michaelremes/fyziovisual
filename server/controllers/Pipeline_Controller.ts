import { ObjectId } from 'mongodb';

import PipelineSchema from '../mongo_models/Pipeline'
import Pipeline_Builder from '../builder/Pipeline_Builder';
import Abstract_Module from '../modules/Abstracts/Abstract_Module';
import client from '../server'


class Pipeline_Controller {

  /* variables */
  private dbName;
  private pipeline_tree: Abstract_Module[];

  private pipelineRunnerInterval: any;

  constructor() {
    // Database Name
    this.dbName = 'fyziovisual';
    this.pipeline_tree = [];
  }

  /* methods */
  getAllPipelines() {
    const db = client.db(this.dbName);

    const pipelines = db.collection('pipelines');

    const pipelineCollection = pipelines.find({}).toArray();

    return pipelineCollection;
  }


  async addPipeline(body: any): Promise<any> {
    const db = client.db(this.dbName);

    const pipelines = db.collection('pipelines');

    const newPipeline = new PipelineSchema();

    newPipeline.name = body.name;
    newPipeline.author = body.author;
    newPipeline.data = body.data;

    const insertResult = await pipelines.insertOne(newPipeline);


    console.log('Inserted document =>', insertResult);
    return insertResult;
  }

  async deletePipeline(pipelineId: Object) {
    const db = client.db(this.dbName);

    const pipelines = db.collection('pipelines');
    /* convert user id to ObjectId fitler object for Mongo */
    const pipelineToDelete = { "_id": new ObjectId(pipelineId.toString()) };

    const deleteResult = await pipelines.deleteOne(pipelineToDelete);

    console.log('Removed document =>', deleteResult);
  }

  async updatePipeline(pipelineId: Object, pipelineBody: string) {
    const db = client.db(this.dbName);

    const pipelines = db.collection('pipelines');
    const pipelineToUpdate = { "_id": new ObjectId(pipelineId.toString()) };

    const result = await pipelines.updateOne(pipelineToUpdate, { $set: pipelineBody });
    console.log('Updated document =>', result);
  }

  async runPipeline(pipelineId: string) {
    this.stopPipelineRunner();
    const db = client.db(this.dbName);

    const pipelines = db.collection('pipelines');
    /* get pipeline from mongo */
    const pipeline = await pipelines.findOne({
      "_id": new ObjectId(pipelineId)
    });
    /* load pipeline tree config */
    let pipeline_builder: Pipeline_Builder = new Pipeline_Builder(pipeline.data);
    /* build tree */
    this.pipeline_tree = pipeline_builder.getPipelineTree();

    pipeline_builder.printTree();

    console.log('---- running pipeline ----: ')
    let rootNode: any = this.pipeline_tree[this.pipeline_tree.length - 1];
    
    //rootNode.print();

    /*execute*/
    this.pipelineRunnerInterval = setInterval(function () {
      rootNode.loadBuffer();
    }, (1000));


  }

  stopPipelineRunner() {
    clearInterval(this.pipelineRunnerInterval);
  }

}

export default Pipeline_Controller;