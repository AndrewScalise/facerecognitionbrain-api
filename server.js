const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const saltRounds = 10;
const knex = require("knex");
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "test",
    database: "smart-brain",
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const database = {
  users: [
    {
      id: "123",
      name: "john",
      email: "john@gmail.com",
      password: "cookies",
      entries: "0",
      joined: new Date(),
    },
    {
      id: "1234",
      name: "bob",
      email: "bob@gmail.com",
      password: "bobsburgers",
      entries: "2",
      joined: new Date(),
    },
    {
      id: "12345",
      name: "molly",
      email: "molly@gmail.com",
      password: "mollies",
      entries: "10",
      joined: new Date(),
    },
  ],
  login: [
    {
      id: "987",
      hash: "",
      email: "john@gmail.com",
    },
  ],
};

app.get("/users", (req, res) => {
  res.send(database);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json(err));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("Not Found");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json("Not Found");
  }
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/*
/ --> res = this is working
/ signin --> POST success/fail
/ register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> updated user
 */
