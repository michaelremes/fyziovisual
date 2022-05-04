import { MongoClient } from 'mongodb';
import app from './App'
import { mongo_config } from './config/mongo_config'


const port = 4000;

const client = new MongoClient(mongo_config.db_dev);
export async function connectToDatabase() {
  await client.connect();

  console.log(`Successfully connected to MongoDB`);
}

/* connect to database before starting the server on 4000 */
connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT || port, () => {
      console.log(`Server started at ${process.env.PORT || port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
});


export default client;