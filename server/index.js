const express = require('express');
const app = express();
const port = process.env.port || 3000;

const redisClient = require("redis").createClient("redis://redis-session-storage:6379");

const { Client } = require('pg')
const dbClient = new Client({
  host : process.env.DB_HOST ? process.env.DB_HOST : "my-app-db",
  port : process.env.DB_PORT ? process.env.DB_PORT : 5432,
  user : process.env.DB_USER ? process.env.DB_USER: "root",
  password : process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "",
  database : process.env.NODE_ENV !== "test" ? process.env.DB_DATABASE : "test"
});

app.get("/db",
  function(req, res) {
    let options = {};
    dbClient.connect()
    dbClient.query('SELECT NOW()', (err, result) => {
      if (err) {
        res.status(500).send(err);
      }
      dbClient.end()
      res.send(result);
    });
  });

app.get("/cache", 
  function(req, res) {
    try{
      redisClient.set("rand000000000000", "OK");
      client.get("foo_rand000000000000", function(err, reply) {
        res.send(reply.toString()); // Will print `OK`
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));