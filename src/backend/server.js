const express = require("express");
const mysql = require("mysql2/promise");
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

//  OCENY TABLE
//select
app.get("/api/ratings", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute("SELECT * FROM ratings");

    res.json(rows);
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

//insert
app.post("/api/ratings", async (req, res) => {
  const { user_id, politician_id, title, value, description, date } = req.body;
  let connection;

  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute(
      "INSERT INTO ratings (user_id, politician_id, title, value, description, date) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, politician_id, title, value, description, date]
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      politician_id,
      title,
      value,
      description,
      data,
    });
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

//update
app.put(`/api/ratings/:id`, async (req, res) => {
  const { id } = req.params;
  const { user_id, politician_id, title, value, description, date } = req.body;

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
    return res.status(400).json({ message: "No data provided to update" });
  }
  values.push(parseInt(id));

  const query = `UPDATE ratings SET ${fields.join(", ")} WHERE id = ?`;

  try {
    connection = await mysql.createConnection(config);

    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      res.json({ id, ...req.body });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (err) {
    console.error("Error updating rating:", err.message);
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

//delete
app.delete("/api/ratings/:id", async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute("DELETE FROM ratings WHERE id = ?", [parseInt(id)]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json({ message: "Rating deleted successfully", id });
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

//  OWN_RATINGS TABLE
//insert
app.post("/api/ownratings", async (req, res) => {
  const { user_id, politician_id, value } = req.body;
  let connection;

  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute("INSERT INTO own_ratings (user_id, politician_id, value) VALUES (?, ?, ?)", [
      user_id,
      politician_id,
      value,
    ]);
    res.status(201).json({ id: result.insertId, user_id, politician_id, value });
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

//select
app.get("/api/ownratings", async (req, res) => {
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
        console.error("Error closing connection:", err.message);
      }
    }
  }
});

//update
app.put(`/api/ownratings/:id`, async (req, res) => {
  const { id } = req.params;
  const { user_id, politician_id, value } = req.body;

  let connection;
  console.log("Request body:", req.body);

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
    return res.status(400).json({ message: "No data provided to update" });
  }

  values.push(parseInt(id));

  const query = `UPDATE own_ratings SET ${fields.join(", ")} WHERE id = ?`;

  try {
    connection = await mysql.createConnection(config);

    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      res.json({ id, ...req.body });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (err) {
    console.error("Error updating rating:", err.message);
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

//delete
app.delete("/api/ownratings/:id", async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute("DELETE FROM own_ratings WHERE id = ?", [parseInt(id)]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.json({ message: "Rating deleted successfully", id });
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

//   POLITYCY TABLE
//select
app.get("/api/politicians", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute("SELECT * FROM politicians");

    res.json(rows);
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

// SELECT
app.get("/api/users", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute("SELECT * FROM users");

    res.json(rows);
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

// INSERT
app.post("/api/users", async (req, res) => {
  const { name, email, password, phone_number, verified, communication_method, login_method } = req.body;
  let connection;

  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password, phone_number, verified, communication_method, login_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, email, password, phone_number, verified, communication_method, login_method]
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
        console.error("Error closing connection:", err.message);
      }
    }
  }
});

// UPDATE
app.put(`/api/users/:id`, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone_number, verified, communication_method, login_method } = req.body;

  let connection;
  console.log("Request body:", req.body);

  const fields = [];
  const values = [];

  if (name) {
    fields.push("name = ?");
    values.push(name);
  }
  if (email) {
    fields.push("email = ?");
    values.push(email);
  }
  if (password) {
    fields.push("password = ?");
    values.push(password);
  }
  if (phone_number) {
    fields.push("phone_number = ?");
    values.push(phone_number);
  }
  if (verified !== undefined) {
    fields.push("verified = ?");
    values.push(verified);
  }
  if (communication_method !== undefined) {
    fields.push("communication_method = ?");
    values.push(communication_method);
  }
  if (login_method !== undefined) {
    fields.push("login_method = ?");
    values.push(login_method);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No data provided to update" });
  }

  values.push(parseInt(id));

  const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

  try {
    connection = await mysql.createConnection(config);

    const [result] = await connection.execute(query, values);

    if (result.affectedRows > 0) {
      res.json({ id, ...req.body });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating user:", err.message);
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

// DELETE
app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [parseInt(id)]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", id });
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

//   WYBORY_PREZYDENT TABLE
//select
app.get("/api/presidentelections", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute("SELECT * FROM president_elections");

    res.json(rows);
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

//   WYBORY_SEJM TABLE
//select
app.get("/api/sejmelections", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute("SELECT * FROM sejm_elections");

    res.json(rows);
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

//   WYBORY_EU TABLE
//select
app.get("/api/euelections", async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute("SELECT * FROM eu_elections");

    res.json(rows);
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

//   SEJM_DISTRICTS TABLE
//select
app.get("/api/districts/sejm/:powiatName", async (req, res) => {
  const { powiatName } = req.params;
  let connection;

  try {
    connection = await mysql.createConnection(config);
    const [rows, fields] = await connection.execute("SELECT * FROM sejm_districts WHERE powiat_name = ?", [powiatName]);

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.json({ id: 0, district_number: 0, powiat_name: "błąd" });
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
