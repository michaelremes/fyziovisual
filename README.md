# FyzioVisual
FyzioVisual is a web application consisting of a front-end and back-end with a database. The user can create their analysis configuration that receives, analyzes or stores data. The application enables user management, module management and configuration management. A modelling tool is used to create and edit the configuration, in which it is possible to execute the created analysis and view data in real-time.

## Usage
Makefile contains all available commands for installing the environment and running the client or server.

### install all dependecies
`make install`
### run client
`make start-client`
### run server
`make start-server`
### run ecg sensor
`make start-sensor-ecg`
### run respiration sensor
`make start-sensor-resp`
### run tests
`make test`

### Sensor sample data
To run the sensor with sample data, you need to download it: [WESAD - Dataset](https://ubicomp.eti.uni-siegen.de/home/datasets/icmi18/)


```
Schmidt, P., Reiss, A., Duerichen, R. (2018) Introducing WESAD
a Multimodal Dataset for Wearable Stress and Affect Detection.
In Proceedings of the 20th ACM International Conference on Multimodal Interaction,
ICMI ’18,
New York, NY, 
USA: Association for Computing Machinery, 400–408. 
https://doi.org/10.1145/3242969.3242985
```

And then place it in the *sensor* folder.
Look at sensor config at *sensor/config* to set up your sensor appropriately.
Example of ECG sensor setup:
```
module.exports = {
    "hostname": 'localhost',
    "port": '8000',
    "data_sample": "sensor/WESAD/S3/S3_respiban.txt",
    "data_type": "ecg",
  };
```


### First User and Login
To login into the app, you need to use user email and password.
If you're running the app locally, use a POST request to create the first user and login.

`POST request: http://localhost:4000/users/add/user` <br>
with body:
```
{
    "first_name": "first_name",
    "last_name": "last_name",
    "email": "name@mail.com",
    "role": "admin",
    "password": "pass"
}
```

### Database
MongoDB is used as the primary storage for user data.

Use `db_dev` for locally hosted MongoDB.
Or use `db_atlas` cluster if you have cluster at [MongoDB Atlas](https://www.mongodb.com/atlas/database)

```
export const mongo_config = {
    db_atlas: 'mongodb+srv://...',
    
    db_dev: 'mongodb://localhost:27017/fyziovisual',
};
```

### Analysis Modules
Analysis modules use Python, and you need to have it available in the project directory.

### InfluxDB
Setup Output_Module to connect to your local Influx database.
[InfluxDB Documentation](https://docs.influxdata.com/influxdb)



### API Tests
To run API tests, install 
[Newman](https://www.npmjs.com/package/newman)

## Project structure

    .
    ├── client                      # React UI
    ├── python_modules              # Python analysis modules
    ├── sensor                      # sensor simulator
    ├── server                      # TypeScript server
    ├── tests                       
    ├── Makefile
    ├── LICENSE
    └── README.md

### Client structure
    Client React Components
    client
    ├── App                      
    ├── Dashboard                
    ├── Login             
    ├── Module                      
    ├── Pipeline                      
    ├── SideBar                       
    ├── Table
    └── Users

### Server structure

    server
    ├── modules                      
    │   ├── Abstracts           
    │   ├── InputModules        
    │   ├── AnalyticalModules        
    │   └── OutputModules                
    ├── routes  
    │   ├── pipeline_routes           
    │   ├── user_routes        
    │   └── module_routes               
    ├── mongo_models             
    ├── controllers
    │   ├── Pipeline_Controller         
    │   ├── User_Controller        
    │   └── Module_Controller                        
    ├── builder                      
    └── server.ts 

## License

Licensed under the [MIT License](LICENSE)