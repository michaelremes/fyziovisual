import * as express from 'express'
import User_Controller from '../controllers/User_Controller';
import JSONResponse from '../libs/JSONResponse'
const user_router = express.Router()


user_router.post('/login', async(req, res) => {

        const uc: User_Controller = new User_Controller();
        await uc.userLogin(req, res);
  //      JSONResponse.success(req, res, null, response)
})

user_router.get('/', async(req, res) => {
    try {
        let uc: User_Controller = new User_Controller();
        let users = await uc.getUsers();
        JSONResponse.success(req, res, null, users)
    } catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
})

user_router.post('/add/user', (req, res) => {
    try {
        let uc: User_Controller = new User_Controller();
        uc.addUser(req.body);
        JSONResponse.success(req, res, null, req.body)
    }
    catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
});

user_router.delete('/delete/:userId', (req, res)  => {
    const { userId } = req.params;
    try {
        let uc: User_Controller = new User_Controller();
        uc.deleteUser(userId);
        JSONResponse.success(req, res, null, req.body)
    }
    catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
  });

  user_router.put('/update/:userId', (req, res)  => {
    const { userId } = req.params;
    try {
        let uc: User_Controller = new User_Controller();
        uc.updateUser(userId, req.body);
        JSONResponse.success(req, res, null, req.body)
    }
    catch (error) {
        console.log(error.message, error.stack)
        JSONResponse.serverError(req, res, null, null)
    }
  
  });

export default user_router;