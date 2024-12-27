const express = require("express");
const mysql = require("mysql2/promise");
const {encrypt} = require("./Encryption");
const app = express();

const config = {
  host: "rateem-server.mysql.database.azure.com",
  user: "GodAdmin",
  password: "ZAQ!2wsx",
  database: "ratem",
  port: 3306,
  ssl: {
    rejectUnauthorized: true,
  },
};

app.use(express.json());

//
// === RATINGS TABLE ======================================================================
//
{
  // --- select ALL -----------------------------------------------------------------------
  app.get("/api/all-ratings", async (req, res) => {
    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute(`
          SELECT r.id AS rating_id,
                 r.user_id,
                 r.politician_id,
                 r.title,
                 r.value,
                 r.weight,
                 r.description,
                 r.date,
                 p.id AS politician_id,
                 p.names_surname,
                 p.party,
                 p.global_rating,
                 p.facebook_link,
                 p.twitter_link,
                 p.birth_date,
                 p.name,
                 p.surname,
                 p.party_short,
                 p.picture
          FROM ratings r
                   JOIN politicians p ON r.politician_id = p.id
      `);

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- select USER_ID -------------------------------------------------------------------
  app.get("/api/ratings-user-id", async (req, res) => {
    const userId = req.query.user_id; // Pobieranie user_id z parametrów zapytania
    let connection;

    try {
      connection = await mysql.createConnection(config);

      // Sprawdzenie, czy user_id jest podane
      if (!userId) {
        return res.status(400).json({error: "User ID is required."});
      }

      const [rows, fields] = await connection.execute(
        `
            SELECT r.id AS rating_id,
                   r.user_id,
                   r.politician_id,
                   r.title,
                   r.value,
                   r.description,
                   r.date,
                   r.weight,
                   p.id AS politician_id,
                   p.names_surname,
                   p.party,
                   p.global_rating,
                   p.facebook_link,
                   p.twitter_link,
                   p.birth_date,
                   p.name,
                   p.surname,
                   p.party_short,
                   p.picture
            FROM ratings r
                     JOIN politicians p ON r.politician_id = p.id
            WHERE r.user_id = ?
        `,
        [userId]
      );

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- select USER_ID POLITICIAN_ID -----------------------------------------------------
  app.get("/api/ratings-user-id-politician-id", async (req, res) => {
    const {user_id, politician_id} = req.query; // Używamy req.query do pobrania parametrów

    // Walidacja danych
    if (!user_id || !politician_id) {
      return res.status(400).json({
        message: "Both user_id and politician_id must be provided",
        missing: {
          user_id: !user_id ? "Missing" : "Provided",
          politician_id: !politician_id ? "Missing" : "Provided",
        },
      });
    }

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows] = await connection.execute(
        "SELECT id, user_id, politician_id, title, value, description, weight, CAST(date as CHAR) as date FROM ratings WHERE user_id = ? AND politician_id = ?",
        [user_id, politician_id]
      );

      // Sprawdzenie, czy wynik nie jest pusty
      if (rows.length === 0) {
        return res.status(404).json({message: "Rating not found"});
      }

      res.json(rows);
    } catch (err) {
      res.status(500).json({message: "Internal Server Error", error: err.message});
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- calculate ownRating USER_ID POLITICIAN_ID -----------------------------------------------------
  app.get("/api/calculate-own-rating", async (req, res) => {
    const { user_id, politician_id } = req.query; // Używamy req.query do pobrania parametrów

    // Walidacja danych
    if (!user_id || !politician_id) {
      return res.status(400).json({
        message: "Both user_id and politician_id must be provided",
        missing: {
          user_id: !user_id ? "Missing" : "Provided",
          politician_id: !politician_id ? "Missing" : "Provided",
        },
      });
    }

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows] = await connection.execute(
        "SELECT SUM(value * weight) / SUM(weight) AS result FROM ratings WHERE user_id = ? AND politician_id = ?",
        [user_id, politician_id]
      );

      // Sprawdzenie, czy wynik nie jest pusty
      if (rows.length === 0) {
        return res.status(404).json({ message: "Rating not found" });
      }
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", error: err.message });
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {}
      }
    }
  });

  // --- select TRENDING POLITICIANS -----------------------------------------------------
  app.get("/api/trending-politicians", async (req, res) => {
    const days = req.query.days || "30";
    let order = req.query.order || "surname";
    const reverseOrder = req.query.reverseOrder || "ASC";

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows] = await connection.execute(
        `
            SELECT politician_id, COUNT(*) AS ratings_count
            FROM ratings
            WHERE date >= CURDATE() - INTERVAL ? DAY
            GROUP BY politician_id
            ORDER BY ratings_count DESC
        `,
        [days]
      );
      const politicianIds = rows.map((row) => row.politician_id);
      if (politicianIds.length > 0) {
        const [politicians] = await connection.execute(
          `
              SELECT p.id,
                     p.names_surname,
                     p.name,
                     p.surname,
                     p.party,
                     p.party_short,
                     p.picture,
                     p.global_rating,
                     (SELECT COUNT(*) FROM ratings WHERE date >= CURDATE() - INTERVAL ? DAY AND politician_id=p.id) as rating_count, p.birth_date, p.facebook_link, p.twitter_link
              FROM politicians as p
              WHERE p.id IN (${politicianIds.join(",")})
            ORDER BY ${order} ${reverseOrder}, name;
          `,
          [days]
        );

        res.json(politicians);
      } else {
        res.json([]);
      }
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
          console.error("Error closing connection:", err.message);
        }
      }
    }
  });

  // --- insert ---------------------------------------------------------------------------
  app.post("/api/ratings", async (req, res) => {
    const {user_id, politician_id, title, value, description, date} = req.body;
    const weight = req.body.weight || 1;
    let connection;

    try {
      connection = await mysql.createConnection(config);
      const [result] = await connection.execute(
        "INSERT INTO ratings (user_id, politician_id, title, value, description, date, weight) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [user_id, politician_id, title, value, description, date, weight]
      );

      res.status(201).json({
        id: result.insertId,
        user_id,
        politician_id,
        title,
        value,
        description,
        date,
      });
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- update ---------------------------------------------------------------------------
  app.put("/api/ratings/:id", async (req, res) => {
    const {id} = req.params;
    const {user_id, politician_id, title, value, description, date} = req.body;

    let connection;

    const fields = [];
    const values = [];

    if (user_id) {
      fields.push("user_id = ?");
      values.push(user_id);
    }
    if (politician_id) {
      fields.push("politician_id = ?");
      values.push(politician_id);
    }
    if (title) {
      fields.push("title = ?");
      values.push(title);
    }
    if (value) {
      fields.push("value = ?");
      values.push(value);
    }
    if (description) {
      fields.push("description = ?");
      values.push(description);
    }
    if (date) {
      fields.push("date = ?");
      values.push(date);
    }

    if (fields.length === 0) {
      return res.status(400).json({message: "No data provided to update"});
    }

    values.push(parseInt(id));

    const query = `UPDATE ratings
                   SET ${fields.join(", ")}
                   WHERE id = ?`;

    try {
      connection = await mysql.createConnection(config);

      const [result] = await connection.execute(query, values);

      if (result.affectedRows > 0) {
        res.json({id, ...req.body});
      } else {
        res.status(404).json({message: "Record not found"});
      }
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- delete ---------------------------------------------------------------------------
  app.delete("/api/ratings/:id", async (req, res) => {
    const {id} = req.params;

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [result] = await connection.execute("DELETE FROM ratings WHERE id = ?", [parseInt(id)]);

      if (result.affectedRows === 0) {
        return res.status(404).json({message: "Rating not found"});
      }

      res.json({message: "Rating deleted successfully", id});
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

//
// === OWN_RATINGS TABLE ==================================================================
//
{
  // --- select ---------------------------------------------------------------------------
  app.get("/api/all-own-ratings", async (req, res) => {
    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute("SELECT * FROM own_ratings");

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  app.get("/api/all-politician-own-ratings", async (req, res) => {
    const {politician_id} = req.query;

    if (!politician_id) {
      return res.status(400).json({message: "No politician_id provided"});
    }

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const query = "SELECT * FROM own_ratings WHERE politician_id = ?";
      const [rows] = await connection.execute(query, [politician_id]);

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- calculate globalRating -----------------------------------------------------
  app.get("/api/calculate-global-rating", async (req, res) => {
    const { politician_id } = req.query;

    if (!politician_id) {
      return res.status(400).json({ message: "No politician_id provided" });
    }

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const query = "SELECT AVG(value) AS result FROM own_ratings WHERE politician_id = ?";
      const [rows] = await connection.execute(query, [politician_id]);

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {}
      }
    }
  });

  app.get("/api/own-ratings", async (req, res) => {
    const {user_id, politician_id} = req.query;

    if (!user_id || !politician_id) {
      return res.status(400).json({
        message: "Both user_id and politician_id must be provided",
        missing: {
          user_id: !user_id ? "Missing" : "Provided",
          politician_id: !politician_id ? "Missing" : "Provided",
        },
      });
    }

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows] = await connection.execute("SELECT * FROM own_ratings WHERE user_id = ? AND politician_id = ?", [user_id, politician_id]);

      if (rows.length === 0) {
        return res.status(404).json({message: "Rating not found"});
      }

      res.json(rows);
    } catch (err) {
      res.status(500).json({message: "Internal Server Error", error: err.message});
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- insert ---------------------------------------------------------------------------
  app.post("/api/own-ratings", async (req, res) => {
    const {user_id, politician_id, value} = req.body;
    let connection;

    try {
      connection = await mysql.createConnection(config);
      const [result] = await connection.execute("INSERT INTO own_ratings (user_id, politician_id, value) VALUES (?, ?, ?)", [
        user_id,
        politician_id,
        value,
      ]);

      res.status(201).json({id: result.insertId, user_id, politician_id, value});
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- update ---------------------------------------------------------------------------
  app.put(`/api/own-ratings`, async (req, res) => {
    const {user_id, politician_id, value} = req.body;

    let connection;

    const fields = [];
    const values = [];

    if (user_id) {
      fields.push("user_id = ?");
      values.push(user_id);
    }
    if (politician_id) {
      fields.push("politician_id = ?");
      values.push(politician_id);
    }
    if (value) {
      fields.push("value = ?");
      values.push(value);
    }

    if (fields.length === 0) {
      return res.status(400).json({message: "No data provided to update"});
    }

    const query = `UPDATE own_ratings
                   SET ${fields.join(", ")}
                   WHERE id = ?`;

    try {
      connection = await mysql.createConnection(config);

      // Aktualizujemy rating na podstawie `politician_id` i `user_id`
      const query = "UPDATE own_ratings SET value = ? WHERE politician_id = ? AND user_id = ?";
      const [result] = await connection.execute(query, [value, politician_id, user_id]);

      if (result.affectedRows > 0) {
        res.json({...req.body});
      } else {
        res.status(404).json({message: "Record not found"});
      }
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
  // --- delete ---------------------------------------------------------------------------
  app.delete("/api/own-ratings", async (req, res) => {
    // const { id } = req.params;
    const {user_id, politician_id} = req.body;

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [result] = await connection.execute("DELETE FROM own_ratings WHERE politician_id = ? AND user_id = ?", [politician_id, user_id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({message: "Rating not found"});
      }

      res.json({message: "Rating deleted successfully", politician_id, user_id});
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

//
// === POLITICIANS TABLE ==================================================================
//
{
  // --- select ---------------------------------------------------------------------------
  app.get("/api/all-politicians", async (req, res) => {
    let order = req.query.order || "surname";
    const reverseOrder = req.query.reverseOrder || "ASC";

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute(
        `SELECT p.id,
                p.names_surname,
                p.name,
                p.surname,
                p.party,
                p.party_short,
                p.picture,
                p.global_rating,
                (SELECT COUNT(*) FROM ratings WHERE politician_id = p.id) as rating_count,
                p.birth_date,
                p.facebook_link,
                p.twitter_link
         FROM politicians as p
        ORDER BY ${order} ${reverseOrder}, name;`
      );

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

app.get("/api/politicians", async (req, res) => {
  const {politician_id} = req.query;

  if (!politician_id) {
    return res.status(400).json({
      message: "politician_id must be provided",
      missing: {
        politician_id: !politician_id ? "Missing" : "Provided",
      },
    });
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute("SELECT * FROM politicians WHERE id = ?", [politician_id]);

    // Sprawdzenie, czy wynik nie jest pusty
    if (rows.length === 0) {
      return res.status(404).json({message: "Politician not found"});
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({message: "Internal Server Error", error: err.message});
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
      }
    }
  }
});

// --- update ---------------------------------------------------------------------------
app.put("/api/politicians/:id", async (req, res) => {
  const {id} = req.params;
  const {
    names_surname,
    party,
    global_rating,
    facebook_link,
    twitter_link,
    birth_date,
    name,
    surname,
    party_short,
    picture
  } = req.body;

  let connection;

  const fields = [];
  const values = [];

  if (names_surname !== undefined) {
    fields.push("names_surname = ?");
    values.push(names_surname);
  }
  if (party !== undefined) {
    fields.push("party = ?");
    values.push(party);
  }
  if (global_rating !== undefined) {
    fields.push("global_rating = ?");
    values.push(global_rating);
  }
  if (facebook_link !== undefined) {
    fields.push("facebook_link = ?");
    values.push(facebook_link);
  }
  if (twitter_link !== undefined) {
    fields.push("twitter_link = ?");
    values.push(twitter_link);
  }
  if (birth_date !== undefined) {
    fields.push("birth_date = ?");
    values.push(birth_date);
  }
  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
  }
  if (surname !== undefined) {
    fields.push("surname = ?");
    values.push(surname);
  }
  if (party_short !== undefined) {
    fields.push("party_short = ?");
    values.push(party_short);
  }
  if (picture !== undefined) {
    fields.push("picture = ?");
    values.push(picture);
  }

  if (fields.length === 0) {
    return res.status(400).json({message: "No data provided to update"});
  }

  values.push(parseInt(id));

  const query = `UPDATE politicians
                 SET ${fields.join(", ")}
                 WHERE id = ?`;

  try {
    connection = await mysql.createConnection(config);

    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      res.json({id, ...req.body});
    } else {
      res.status(404).json({message: "Record not found"});
    }
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
      }
    }
  }
});

//
// === USERS TABLE ========================================================================
//
{
  // --- select ---------------------------------------------------------------------------
  app.get("/api/users", async (req, res) => {
    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute("SELECT * FROM users");

      // rows.forEach((row) => {
      //   row.name = decrypt(row.name);
      //   row.email = decrypt(row.email);
      //   row.password = decrypt(row.password);
      //   row.phone_number = decrypt(row.phone_number);
      // });

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- insert ---------------------------------------------------------------------------
  app.post("/api/users", async (req, res) => {
    const {name, email, password, phone_number, verified, communication_method, login_method} = req.body;
    let connection;

    try {
      connection = await mysql.createConnection(config);
      const [result] = await connection.execute(
        "INSERT INTO users (name, email, password, phone_number, verified, communication_method, login_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [encrypt(name), encrypt(email), encrypt(password), encrypt(phone_number), verified, communication_method, login_method]
      );

      res.status(201).json({
        id: result.insertId,
        name,
        email,
        password,
        phone_number,
        verified,
        communication_method,
        login_method,
      });
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- update ---------------------------------------------------------------------------
  app.put("/api/users/:id", async (req, res) => {
    const {id} = req.params;
    const {name, email, password, phone_number, verified, communication_method, login_method} = req.body;

    let connection;

    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(encrypt(name));
    }
    if (email) {
      fields.push("email = ?");
      values.push(encrypt(email));
    }
    if (password) {
      fields.push("password = ?");
      values.push(encrypt(password));
    }
    if (phone_number) {
      fields.push("phone_number = ?");
      values.push(encrypt(phone_number));
    }
    if (verified) {
      fields.push("verified = ?");
      values.push(verified);
    }
    if (communication_method) {
      fields.push("communication_method = ?");
      values.push(communication_method);
    }
    if (login_method) {
      fields.push("login_method = ?");
      values.push(login_method);
    }

    if (fields.length === 0) {
      return res.status(400).json({message: "No data provided to update"});
    }

    values.push(id);

    const query = `UPDATE users
                   SET ${fields.join(", ")}
                   WHERE id = ?`;

    try {
      connection = await mysql.createConnection(config);

      const [result] = await connection.execute(query, values);

      if (result.affectedRows > 0) {
        res.json({id, ...req.body});
      } else {
        res.status(404).json({message: "User not found"});
      }
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });

  // --- delete ---------------------------------------------------------------------------
  app.delete("/api/users/:id", async (req, res) => {
    const {id} = req.params;

    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [parseInt(id)]);

      if (result.affectedRows === 0) {
        return res.status(404).json({message: "User not found"});
      }

      res.json({message: "User deleted successfully", id});
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

//
// === PRESIDENT_ELECTIONS TABLE ==========================================================
//
{
  // --- select ---------------------------------------------------------------------------
  app.get("/api/president-elections", async (req, res) => {
    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute("SELECT name, CAST(date as CHAR) as date, future FROM president_elections");

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

//
// === SEJM_ELECTIONS TABLE ===============================================================
//
{
  // --- select ---------------------------------------------------------------------------
  app.get("/api/sejm-elections", async (req, res) => {
    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute("SELECT name, CAST(date as CHAR) as date, future FROM sejm_elections");

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

//
// === EU_ELECTIONS TABLE =================================================================
//
{
  // --- select ---------------------------------------------------------------------------
  app.get("/api/eu-elections", async (req, res) => {
    let connection;
    try {
      connection = await mysql.createConnection(config);
      const [rows, fields] = await connection.execute("SELECT name, CAST(date as CHAR) as date, future FROM eu_elections");

      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

//
//   SEJM_DISTRICTS TABLE
//
{
  //select
  app.get("/api/districts/sejm", async (req, res) => {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      const [result] = await connection.execute("SELECT * FROM sejm_districts");

      if (result.length > 0) {
        res.json(result);
      } else {
        res.json({id: 0, district_number: 0, powiat_name: "błąd"});
      }
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

//
//   EU_DISTRICTS TABLE
//
{
  //select
  app.get("/api/districts/eu", async (req, res) => {
    let connection;

    try {
      connection = await mysql.createConnection(config);
      const [result] = await connection.execute("SELECT * FROM eu_districts");

      if (result.length > 0) {
        res.json(result);
      } else {
        res.json({id: 0, district_number: 0, powiat_name: "błąd"});
      }
    } catch (err) {
      res.status(500).send(err.message);
    } finally {
      if (connection) {
        try {
          await connection.end();
        } catch (err) {
        }
      }
    }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
