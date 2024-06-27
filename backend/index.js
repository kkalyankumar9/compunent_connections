const express = require('express');
const ensureTable = require('./middleware.js/ensureTable');
const taskRouter = require('./route/taskRouter');
const database = require('./db');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use('/', ensureTable, taskRouter);

app.get('/', (req, res) => {
  res.send('This is the home route');
});

database
  .authenticate()
  .then(() => {
    console.log('Successfully connected to the database');
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
