import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const getStatus = (req, res) => {
  if (redisClient.isAlive() && dbClient.isAlive()) {
    return res.status(200).json({ redis: true, db: true });
  }
  return res.status(404);
};

const getStats = async (req, res) => {
  const users = await dbClient.nbUsers();
  const files = await dbClient.nbFiles();

  return res.status(200).json({ users, files });
};

module.exports.getStatus = getStatus;
module.exports.getStats = getStats;
