import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const db = process.env.DB_HOST || 'files_manager';
    const port = process.env.DB_POR || 27017;
    const host = process.env.DB_DATABASE || 'localhost';

    const url = `mongodb://${host}:${port}`;
    this.client = new MongoClient(url);
    this.client.connect();
    this.db = this.client.db(db);
  }

  isAlive() {
    return this.client.connect.isConnected();
  }

  async nbUsers() {
    const userCollection = this.db.collection('users');
    const users = await userCollection.find().catch((e) => {
      console.log(e);
    });
    return users.length;
  }

  async nbFiles() {
    const fileCollection = this.db.collection('files');
    const files = await fileCollection.find().catch((e) => {
      console.log(e);
    });
    return files.length;
  }
}

const dbClient = new DBClient();

export default dbClient;
