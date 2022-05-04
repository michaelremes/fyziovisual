import * as express from 'express'
import Pipeline_Controller from '../controllers/Pipeline_Controller';
import JSONResponse from '../libs/JSONResponse'

const pipeline_router = express.Router()
let pc: Pipeline_Controller = new Pipeline_Controller();



pipeline_router.get('/', async (req, res) => {
    try {
    //    let pc: Pipeline_Controller = new Pipeline_Controller();
        let pipelines = await pc.getAllPipelines();
        JSONResponse.success(req, res, null, pipelines)
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})
pipeline_router.get('/run/:pipelineId', async (req, res) => {
    const { pipelineId } = req.params;
    try {
        
        await pc.runPipeline(pipelineId);       
   
        JSONResponse.success(req, res, null, req.body)
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})
pipeline_router.get('/stop', (req, res) => {
    try {
   //     let pc: Pipeline_Controller = new Pipeline_Controller();
        pc.stopPipelineRunner();       
        JSONResponse.success(req, res, null, "success")
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})
pipeline_router.post('/add/pipeline', async (req, res) => {
    try {
    //    let pc: Pipeline_Controller = new Pipeline_Controller();
        const returnedObject = await pc.addPipeline(req.body);
        let responseBody = req.body;
        responseBody._id = returnedObject.insertedId.toString();

        JSONResponse.success(req, res, null, responseBody);
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})

pipeline_router.put('/update/:pipelineId', (req, res) => {
    const { pipelineId } = req.params;
    try {
      //  let pc: Pipeline_Controller = new Pipeline_Controller();
        pc.updatePipeline(pipelineId, req.body);

        JSONResponse.success(req, res, null, req.body)
    }
    catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }

});

pipeline_router.delete('/delete/:pipelineId', (req, res) => {
    const { pipelineId } = req.params;
    try {
  //      const pc: Pipeline_Controller = new Pipeline_Controller();
        pc.deletePipeline(pipelineId);
        JSONResponse.success(req, res, null, req.body)
    }
    catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
});

export default pipeline_router;