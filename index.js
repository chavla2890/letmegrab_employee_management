const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const employee = require("./routes/employeeRoutes");
const app = express();
const port = 3000;
const db = require('./config/db');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/emp', employee); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});