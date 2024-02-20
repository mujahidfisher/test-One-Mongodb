const express = require("express");
const app = express();
const port = 3000;
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

//middleware
app.use(express.json())


//db connection
let db;

connectToDb((err) => {
  if (!err) {
    // port
    app.listen(port, () => {
      console.log(`The server is running on port : ${port}👌`);
    });
    db = getDb();
  }
});

//controllers
app.get("/books", (req, res) => {
  let books = [];

  db.collection("books")
    .find()
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Could'nt fetch documents." });
    });
});

app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could'nt fetch documents." });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body
  db.collection("books")
  .insertOne(book)
  .then(result => {
    res.status(201).json(result)
  })
  .catch(err => {
    res.status(500).status({error: "Error could not post"})
  })

})

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could'nt fetch documents." });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
});

app.patch("/books/:id", (req, res) => {
  const updates = req.body
  const { id } = req.params;
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(id) }, {$set: updates})
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could'nt update documents." });
      });
  } else {
    res.status(500).json({ error: "Not a valid doc id" });
  }
})