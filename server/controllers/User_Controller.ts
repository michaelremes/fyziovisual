import UserSchema from '../mongo_models/User'
import { ObjectId } from 'mongodb';
import client from '../server'
import JSONResponse from '../libs/JSONResponse'

import bcrypt from "bcryptjs";

class User_Controller {

    private dbName;
    private db;
    private user_collection;


    constructor() {
        // Database Name
        this.dbName = 'fyziovisual';
        this.db = client.db(this.dbName);
        this.user_collection = this.db.collection('users');
    }

    /* methods */
    async getUsers() {
        const userCollection = await this.user_collection.find({}).toArray();

        return userCollection;
    }

    async userLogin(req: any, res: any) {
        const body = req.body;
        this.user_collection.findOne({
            email: body.email
        }, (err: any, user: any) => {
            if (!user) {
                return JSONResponse.serverError(err, res, 'not found', null)
            }

            bcrypt.compare(body.password, user.password, function (error: any, isMatch: any) {
                if (error) {
                    throw error
                } else if (!isMatch) {
                    return JSONResponse.serverError(err, res, 'wrong password', null)
                } else {
                    const rand = () => Math.random().toString(36).substr(2);
                    const token = (length: number) => (rand() + rand() + rand() + rand()).substr(0, length);
                    const response = {
                        token: token(40),
                        user_id: user._id,
                        user_role: user.role
                    };
                    return JSONResponse.success(req, res, null, response);
                }
            })
        });
    }

    async addUser(body: any) {

        const newUser = new UserSchema();

        newUser.first_name = body.first_name;
        newUser.last_name = body.last_name;
        newUser.role = body.role;
        newUser.email = body.email;

        /* hash password */
        newUser.password = await new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function (saltError: any, salt: any) {
                if (saltError) {
                    throw saltError
                } else {
                    bcrypt.hash(body.password, salt, function (hashError: any, hash: any) {
                        if (hashError) {
                            reject(hashError)
                        } else {
                            resolve(hash);
                            console.log(hash)
                        }
                    })

                }
            })
        })


        const insertResult = this.user_collection.insertOne(newUser);
        console.log('Inserted document =>', insertResult);





    }


    async deleteUser(userId: Object) {
        /* convert user id to ObjectId to create object for Mongo */
        const userToDelete = { "_id": new ObjectId(userId.toString()) };

        const deleteResult = await this.user_collection.deleteOne(userToDelete);
        console.log('Removed document =>', deleteResult);
    }

    async updateUser(userId: Object, userBody: string) {
        const userToUpdate = { "_id": new ObjectId(userId.toString()) };

        const result = await this.user_collection.updateOne(userToUpdate, { $set: userBody });
        console.log('Updated document =>', result);
    }

}

export default User_Controller;