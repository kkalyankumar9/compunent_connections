const express = require("express");
const cors = require("cors");

const taskRouter = require("./route/taskRouter");
const pool = require("./db");
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(cors());

app.use("/api",taskRouter)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
    
});
