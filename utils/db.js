import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const db = process.env.DB_HOST || 'files_manager';
    const port = process.env.DB_PORT || 27017;
    const host = process.env.DB_DATABASE || 'localhost';

    const url = `mongodb://${host}:${port}`;
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(db);
        this.userCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        this.db = false;
      }
    });
  }

  isAlive() {
    return Boolean(this.db);
  }

  async nbUsers() {
    try {
      const users = await this.userCollection.find().toArray();
      return users.length;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async nbFiles() {
    try {
      const files = await this.filesCollection.find().toArray();
      return files.length;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

const dbClient = new DBClient();

export default dbClient;
