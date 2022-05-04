import * as express from 'express'
import JSONResponse from '../libs/JSONResponse'
import Module_Controller from '../controllers/Module_Controller';

import ECG_Module from '../modules/InputModules/ECG_Module';
import Respiration_Module from '../modules/InputModules/Respiration_Module';
import Temperature_Module from '../modules/InputModules/Temperature_Module';


export const module_router = express.Router()

//let in_module: Input_Module = new Input_Module();
let ecg_module: ECG_Module;
let respi_module: Respiration_Module;
let temp_module: Temperature_Module;

/* CRUD API */
module_router.get('/', async (req, res) => {
    try {
        let mc: Module_Controller = new Module_Controller();
        let modules = await mc.getModules();
        JSONResponse.success(req, res, null, modules)
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})

module_router.post('/add/module', (req, res) => {
    try {
        let mc: Module_Controller = new Module_Controller();
        mc.addModule(req.body);
        JSONResponse.success(req, res, null, req.body)
    }
    catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
});
module_router.put('/update/:moduleId', (req, res) => {
    const { moduleId } = req.params;
    try {
        let mc: Module_Controller = new Module_Controller();
        mc.updateModule(moduleId, req.body);
        JSONResponse.success(req, res, null, req.body)
    }
    catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
});

module_router.delete('/delete/:moduleId', (req, res) => {
    const { moduleId } = req.params;
    try {
        let mc: Module_Controller = new Module_Controller();
        mc.deleteModule(moduleId);
        JSONResponse.success(req, res, null, req.body)
    }
    catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
});
/* --------------------- */




/* sensor data */
module_router.get('/sensor/resp', (req, res) => {
    try {
        if (respi_module === undefined) {
            respi_module = new Respiration_Module({});
        }
        const buffer = respi_module.getData();
        const data = buffer.flatten();
        const index = buffer.getIndex();
        JSONResponse.success(req, res, null, { index, data });
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})
module_router.get('/sensor/ecg', (req, res) => {
    try {
        if (ecg_module === undefined) {
            ecg_module = new ECG_Module({});
        }
        const buffer = ecg_module.getData();
        const data = buffer.flatten();
        const index = buffer.getIndex();
        JSONResponse.success(req, res, null, { index, data });
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})
module_router.get('/sensor/temperature', (req, res) => {
    try {
        if (temp_module === undefined) {
            temp_module = new Temperature_Module({});
        }
        const buffer = temp_module.getData();
        const data = buffer.flatten();
        const index = buffer.getIndex();
        JSONResponse.success(req, res, null, { index, data });
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})


export default module_router;