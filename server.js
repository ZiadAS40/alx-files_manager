import express from 'express';

const app = express();
const port = process.env.PORT || 5000;

const routes = require('./routes');

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server Started in ${port}`);
});
