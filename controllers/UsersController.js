import crypto from 'crypto';
import dbClient from '../utils/db';

function hashPasswordSHA1(password) {
  return crypto.createHash('sha1').update(password).digest('hex');
}

const postNew = async (req, res) => {
  const email = req.body.email || null;
  const password = req.body.password || null;

  if (!email) res.status(400).json({ error: 'Missing email' });
  if (!password) res.status(400).json({ error: 'Missing password' });

  const userWithEmail = await (await dbClient.userCollection.findOne({ email }).catch((e) => {
    console.log(`db query error: ${e}`);
  }));
  if (userWithEmail) res.status(200).send({ error: 'Already exist' });

  const hashedPassword = hashPasswordSHA1(password);
  const insertInof = await dbClient.userCollection.insertOne({ email, password: hashedPassword })
    .catch((e) => {
      console.log(`db insertion error: ${e}`);
    });

  return res.status(201).json({ id: insertInof.insertedId.toString(), email });
};

module.exports.postNew = postNew;
