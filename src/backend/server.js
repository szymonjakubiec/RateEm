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

app.use(express.json());
// Endpoint API

// 
app.get('/api/dane', async (req, res) => {
  let connection;
  try {
    // Połączenie z bazą danych
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM wybory_eu');
    
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


//  OCENY TABLE
//select
app.get('/api/ratings', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM oceny');
    
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});

//insert
app.post('/api/ratings', async (req, res) => {
  const { id_uzytkownik, id_polityk, nazwa, wartosc, opis, data } = req.body;
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute(
      'INSERT INTO oceny (id_uzytkownik, id_polityk, nazwa, wartosc, opis, data) VALUES (?, ?, ?, ?, ?, ?)', 
      [id_uzytkownik, id_polityk, nazwa, wartosc, opis, data]
    );

    // Zwracamy zaktualizowane dane z ID nowo dodanego rekordu
    res.status(201).json({ id: result.insertId, id_uzytkownik, id_polityk, nazwa, wartosc, opis, data });
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Błąd podczas zamykania połączenia:', err.message);
      }
    }
  }
});

//update
app.put(`/api/ratings/:id`, async (req, res) => {
  const { id } = req.params;
  const { id_uzytkownik, id_polityk, nazwa, wartosc, opis, data } = req.body;

  let connection;
  console.log("Request body:", req.body); // Logujemy body requestu

  // Budowanie dynamicznego zapytania SQL
  const fields = [];
  const values = [];

  if (id_uzytkownik !== undefined) {
    fields.push('id_uzytkownik = ?');
    values.push(id_uzytkownik);
  }
  if (id_polityk !== undefined) {
    fields.push('id_polityk = ?');
    values.push(id_polityk);
  }
  if (nazwa !== undefined) {
    fields.push('nazwa = ?');
    values.push(nazwa);
  }
  if (wartosc !== undefined) {
    fields.push('wartosc = ?');
    values.push(wartosc);
  }
  if (opis !== undefined) {
    fields.push('opis = ?');
    values.push(opis);
  }
  if (data !== undefined) {
    fields.push('data = ?');
    values.push(data);
  }

  // Jeżeli nie ma żadnych pól do zaktualizowania
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No data provided to update' });
  }

  // Dodajemy id na koniec tablicy wartości (parametry zapytania)
  values.push(parseInt(id));

  // Budujemy pełne zapytanie SQL
  const query = `UPDATE oceny SET ${fields.join(', ')} WHERE id = ?`;

  try {
    connection = await mysql.createConnection(config);

    // Wykonujemy zapytanie
    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      res.json({ id, ...req.body });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (err) {
    console.error('Error updating rating:', err.message);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});

//delete
app.delete('/api/ratings/:id', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute(
      'DELETE FROM oceny WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({ message: 'Rating deleted successfully', id });
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});



//  OCENY_WLASNE TABLE
//insert
app.post('/api/ownratings', async (req, res) => {
  const { id_uzytkownik, id_polityk, wartosc} = req.body;
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute(
      'INSERT INTO oceny_wlasne (id_uzytkownik, id_polityk, wartosc) VALUES (?, ?, ?)', 
      [id_uzytkownik, id_polityk, wartosc]
    );

    // Zwracamy zaktualizowane dane z ID nowo dodanego rekordu
    res.status(201).json({ id: result.insertId, id_uzytkownik, id_polityk, wartosc});
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Błąd podczas zamykania połączenia:', err.message);
      }
    }
  }
});

//select
app.get('/api/ownratings', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM oceny_wlasne');
    
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});

//update
app.put(`/api/ownratings/:id`, async (req, res) => {
  const { id } = req.params;
  const { id_uzytkownik, id_polityk, wartosc } = req.body;

  let connection;
  console.log("Request body:", req.body); // Logujemy body requestu

  // Budowanie dynamicznego zapytania SQL
  const fields = [];
  const values = [];

  if (id_uzytkownik !== undefined) {
    fields.push('id_uzytkownik = ?');
    values.push(id_uzytkownik);
  }
  if (id_polityk !== undefined) {
    fields.push('id_polityk = ?');
    values.push(id_polityk);
  }
  if (wartosc !== undefined) {
    fields.push('wartosc = ?');
    values.push(wartosc);
  }

  // Jeżeli nie ma żadnych pól do zaktualizowania
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No data provided to update' });
  }

  // Dodajemy id na koniec tablicy wartości (parametry zapytania)
  values.push(parseInt(id));

  // Budujemy pełne zapytanie SQL
  const query = `UPDATE oceny_wlasne SET ${fields.join(', ')} WHERE id = ?`;

  try {
    connection = await mysql.createConnection(config);

    // Wykonujemy zapytanie
    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      res.json({ id, ...req.body });
    } else {
      res.status(404).json({ message: 'Record not found' });
    }
  } catch (err) {
    console.error('Error updating rating:', err.message);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});

//delete
app.delete('/api/ownratings/:id', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute(
      'DELETE FROM oceny_wlasne WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.json({ message: 'Rating deleted successfully', id });
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});



//   POLITYCY TABLE
//select
app.get('/api/politicians', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM politycy');
    
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});



//   UZYTKOWNICY TABLE
//select
app.get('/api/users', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM uzytkownicy');
    
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});

//insert
app.post('/api/users', async (req, res) => {
  const { imie, email, haslo, nr_telefonu, zweryfikowany, sposob_komunikacji, sposob_logowania } = req.body;
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute(
      'INSERT INTO uzytkownicy (imie, email, haslo, nr_telefonu, zweryfikowany, sposob_komunikacji, sposob_logowania) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [imie, email, haslo, nr_telefonu, zweryfikowany, sposob_komunikacji, sposob_logowania]
    );

    // Zwracamy zaktualizowane dane z ID nowo dodanego rekordu
    res.status(201).json({ id: result.insertId, imie, email, haslo, nr_telefonu, zweryfikowany, sposob_komunikacji, sposob_logowania});
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Błąd podczas zamykania połączenia:', err.message);
      }
    }
  }
});

//update
app.put(`/api/users/:id`, async (req, res) => {
  const { id } = req.params;
  const { imie, email, haslo, nr_telefonu, zweryfikowany, sposob_komunikacji, sposob_logowania } = req.body;

  let connection;
  console.log("Request body:", req.body); // Logujemy body requestu

  // Budowanie dynamicznego zapytania SQL
  const fields = [];
  const values = [];

  if (imie !== undefined) {
    fields.push('imie = ?');
    values.push(imie);
  }
  if (email !== undefined) {
    fields.push('email = ?');
    values.push(email);
  }
  if (haslo !== undefined) {
    fields.push('haslo = ?');
    values.push(haslo);
  }
  if (nr_telefonu !== undefined) {
    fields.push('nr_telefonu = ?');
    values.push(nr_telefonu);
  }
  if (zweryfikowany !== undefined) {
    fields.push('zweryfikowany = ?');
    values.push(zweryfikowany);
  }
  if (sposob_komunikacji !== undefined) {
    fields.push('sposob_komunikacji = ?');
    values.push(sposob_komunikacji);
  }
  if (sposob_logowania !== undefined) {
    fields.push('sposob_logowania = ?');
    values.push(sposob_logowania);
  }

  // Jeżeli nie ma żadnych pól do zaktualizowania
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No data provided to update' });
  }

  // Dodajemy id na koniec tablicy wartości (parametry zapytania)
  values.push(parseInt(id));

  // Budujemy pełne zapytanie SQL
  const query = `UPDATE uzytkownicy SET ${fields.join(', ')} WHERE id = ?`;

  try {
    connection = await mysql.createConnection(config);

    // Wykonujemy zapytanie
    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      res.json({ id, ...req.body });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});

//delete
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute(
      'DELETE FROM uzytkownicy WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully', id });
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});



//   WYBORY_PREZYDENT TABLE
//select
app.get('/api/presidentelections', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM wybory_prezydent');
    
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});


//   WYBORY_SEJM TABLE
//select
app.get('/api/sejmelections', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM wybory_sejm');
    
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});



//   WYBORY_EU TABLE
//select
app.get('/api/euelections', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute('SELECT * FROM wybory_eu');
    
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));