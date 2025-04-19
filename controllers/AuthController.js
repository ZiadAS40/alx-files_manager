import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

function hashPasswordSHA1(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
}

const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.log(authHeader);
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const base64 = authHeader.split(' ')[1];
  const encoded = Buffer.from(base64, 'base64').toString('utf-8');
  const [email, password] = encoded.split(':');

  const userWithEmail = await dbClient.userCollection.findOne({ email });
  if (!userWithEmail) return res.status(401).json({ error: 'Unauthorized' });

  const hashedPassword = hashPasswordSHA1(password);
  const userWithPassword = await dbClient.userCollection
    .findOne({ email, password: hashedPassword });
  if (!userWithPassword) return res.status(401).json({ error: 'Unauthorized' });

  const uuid = uuidv4().toString();
  const token = `auth_${uuid}`;
  await redisClient.set(token, userWithEmail._id.toString(), 86400)
    .catch((e) => res.status(500).json({ error: `Unexpected Error: ${e}` }));

  return res.status(200).json({ token: uuid });
};

const getDisconnect = async (req, res) => {
  const token = req.headers['x-token'] || null;

  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) res.status(401).json({ error: 'Unauthorized' });

  const del = await redisClient.del(`auth_${token}`);

  if (!del) return res.status(400);

  return res.status(204);
};

module.exports.getConnect = getConnect;
module.exports.getDisconnect = getDisconnect;
