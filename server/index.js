const express = require('express');
const app = express();
const port = process.env.port || 3000;

const redisClient = require("redis").createClient("redis://redis-session-storage:6379");

const { Client } = require('pg')
const dbClient = new Client({
  host :  "my-app-db",
  port : 5432,
  database : "test",
  user : "hackreactor",
  password : "password",
});
dbClient.connect()

app.get("/db",
  function(req, res) {
    dbClient.query('SELECT NOW()', (err, result) => {
      if (err) {
        res.status(500).send(err);
        dbClient.end();
      }
      // dbClient.end()
      res.json(result).send();
    });
  });

app.get("/cache", 
  function(req, res) {
    try{
      redisClient.set("rand000000000000", "OK");
      redisClient.get("rand000000000000", function(err, reply) {
        res.json(reply.toString()).send(); // Will print `OK`
      });
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));