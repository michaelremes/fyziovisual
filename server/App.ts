import express from 'express'
import user_router from './routes/user_routes'
import module_router from './routes/module_routes'
import pipeline_router from './routes/pipeline_routes'
import * as bodyParser from 'body-parser';

class App {
    public express: any

    constructor() {
        this.express = express()
        this.express.use(function (req: any, res: any, next: any) {

            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', '*');
          
            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
          
            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
          
            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
          
            // Pass to next layer of middleware
            next();
          });
        
        this.express.use(bodyParser.json({ limit: '50mb' }))
        this.loadRoutes()
    }


    loadRoutes(): void {
        this.express.use('/users', user_router);
        this.express.use('/modules', module_router);
        this.express.use('/pipelines', pipeline_router);

    }
}

export default new App().express;