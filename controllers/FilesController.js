import { ObjectId } from 'mongodb';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const postUpload = async (req, res) => {
  const token = req.headers['x-token'];
  const name = req.body.name || null;
  const type = req.body.type || null;
  const parentId = req.body.parentid || 0;
  const isPublic = req.body.ispublic || false;
  const data = req.body.data || null;

  const allowedTypes = ['folder', 'file', 'image'];

  const userId = await redisClient.get(`auth_${token}`);
  if (!token || !userId) return res.status(401).json({ error: 'Unauthorized' });

  if (!name) return res.status(400).json({ error: 'Missing name' });
  if (!type || !allowedTypes.includes(type)) return res.status(400).json({ error: 'Missing type' });
  if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });

  if (parentId) {
    const parentIdObj = new ObjectId(parentId);
    const file = await dbClient.filesCollection.findOne({ _id: parentIdObj });

    if (!file) return res.status(400).json({ error: 'Parent not found' });
    if (file.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
  }

  if (type === 'folder') {
    const insertdedFile = await dbClient.filesCollection.insertOne({
      name, userId, type, parentId, isPublic,
    });
    return res.status(201).json({
      id: insertdedFile.insertedId.toString(), userId, name, type, parentId, isPublic,
    });
  }
  const decodedData = Buffer.from(data, 'base64').toString('utf-8');
  const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const fileNmae = `${uuidv4()}`;
  const filePath = path.join(folderPath, fileNmae);

  fs.writeFileSync(filePath, decodedData);

  const insertdedFile = await dbClient.filesCollection.insertOne({
    name, type, userId, parentId, isPublic, localPath: filePath,
  });

  return res.status(201).json({
    id: insertdedFile.insertedId.toString(), name, type, userId, parentId, isPublic,
  });
};

module.exports.postUpload = postUpload;
