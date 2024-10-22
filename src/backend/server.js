const express = require('express');
const mysql = require('mysql2/promise');  // Używamy mysql2 z obsługą obietnic
const app = express();

// Konfiguracja połączenia z MySQL na Azure
const config = {
  host: 'rateem-server.mysql.database.azure.com',
  user: 'GodAdmin',
  password: 'ZAQ!2wsx',
  database: 'ratem',
  port: 3306,  // Użyj poprawnego portu dla MySQL
  ssl: {      // Azure wymaga SSL
    rejectUnauthorized: true
  }
};


// Endpoint API
app.get('/api/dane', async (req, res) => {
  let connection;
  try {
    // Połączenie z bazą danych
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM oceny');
    
    // Zwracanie danych do klienta
    res.json(rows);
  } catch (err) {
    // Obsługa błędów
    res.status(500).send(err.message);
  } finally {
    // Upewnij się, że połączenie zostało zamknięte
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Błąd podczas zamykania połączenia:', err.message);
      }
    }
  }
});

app.get('/api/uzytkownicy', async (req, res) => {
  let connection;
  try {
    // Połączenie z bazą danych
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT email, haslo FROM uzytkownicy');
    
    // Zwracanie danych do klienta
    res.json(rows);
  } catch (err) {
    // Obsługa błędów
    res.status(500).send(err.message);
  } finally {
    // Upewnij się, że połączenie zostało zamknięte
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Błąd podczas zamykania połączenia:', err.message);
      }
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));