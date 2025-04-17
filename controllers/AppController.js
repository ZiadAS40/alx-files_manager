import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const getStatus = (req, res) => {
  if (redisClient.isAlive() && dbClient.isAlive()) {
    res.status(200).json({ redis: true, db: true });
  } else {
    res.status(500).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }
};

const getStats = async (req, res) => {
  const users = await dbClient.userCollection.find().toArray();
  const files = await dbClient.filesCollection.find().toArray();

  res.status(200).json({ users: users.length, files: files.length });
};

module.exports = { getStatus, getStats };
