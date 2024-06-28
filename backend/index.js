const express = require('express');


app.use(cors())
const ensureTable = require('./middleware.js/ensureTable');
const taskRouter = require('./route/taskRouter');


require('dotenv').config();

const app = express();
const port =  8000;

app.use(express.json());
app.use(cors());


app.use('/', ensureTable, taskRouter);

app.get('/', (req, res) => {
  res.send('This is the home route');
});




    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
