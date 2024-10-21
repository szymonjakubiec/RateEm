const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const port = 3000;
const fs = require('fs');

// require('dotenv').config();
// const { BlobServiceClient } = require('@azure/storage-blob');
// const storageAccountConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
// const multer = require('multer');
// const upload = multer({ dest: 'uploads' });

app.use(cors());
app.use(express.json());
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


const connection = mysql.createConnection({
    host: 'rateem-server.mysql.database.azure.com',
    user: 'GodAdmin',
    password: 'ZAQ!2wsx',
    port: 3306,
    database: 'ratem',
    ssl: {ca: fs.readFileSync("src/backend/DigiCertGlobalRootCA.crt.pem","utf-8"), rejectUnauthorized: false},
});

connection.connect((e) =>{
    if(e){
        console.error('Error connecting to MySQL: ' + e.stack);
        return;
    }
    console.log('Succesfully connected to MySQL Database')
});

app.get('/', (req, res) => {
    return res.json(':D');
});

app.get('/uzytkownicy', (req, res) => {
    const statement = "SELECT email,haslo FROM uzytkownicy;";
    connection.query(statement, (err, data) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).send('Error querying database: ', err.message);
        } else {
            res.json(data);
        }
    });
});

app.get('/wyborysejm', (req, res) => {
    const statement = "SELECT * FROM wybory_sejm WHERE przyszle=1;";
    connection.query(statement, (err, data) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).send('Error querying database: ', err.message);
        } else {
            res.json(data);
        }
    });
});

app.get('/wyboryprezydent', (req, res) => {
    const statement = "SELECT * FROM wybory_prezydent WHERE przyszle=1;";
    connection.query(statement, (err, data) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).send('Error querying database: ', err.message);
        } else {
            res.json(data);
        }
    });
});

app.get('/wyboryeu', (req, res) => {
    const statement = "SELECT * FROM wybory_eu WHERE przyszle=1;";
    connection.query(statement, (err, data) => {
        if (err) {
            console.error('Error querying database:', err.message);
            res.status(500).send('Error querying database: ', err.message);
        } else {
            res.json(data);
        }
    });
});