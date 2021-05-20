const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
let cors = require("cors");

const app = express();
const port = 9000;

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/KeeperAppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsShema = new mongoose.Schema({
  title: String,
  content: String,
});
const Item = mongoose.model("Item", itemsShema);

const item1 = new Item({
  title: "Loki",
  content: "Marvel",
});

const item2 = new Item({
  title: "JAy",
  content: "Kakkar",
});

const defaultArray = [item1, item2];

app.get("/", (req, res) => {
  // res.send("Hello World");
  Item.find({}, (err, data) => {
    if (data.length === 0) {
      Item.insertMany(defaultArray, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("SuccessFully Inserted");
          res.redirect("/");
        }
      });
    } else {
      console.log(data + "       Get(/)");

      // res.write(res.json(data));

      console.log("Exists" + data.length);
      res.send(data);
    }
    //FOR Axios Use
  });
  // res.send()
});

app.get("/api/users", (req, res) => {
  Item.find({}, (err, data) => {
    if (err) {
      console.log(err + "               ERROR");
    } else {
      console.log("Appii/Users");
      // console.log(res.json(data));
      res.send(data);

      // res.json(data + "            Get(api/users)");
    }
  });
  // res.json();
});

// app.post("/api/user", (req, res) => {
//   const notes = req.body;
//   console.log("Adding user:::::", notes);
//   // users.push(user);
//   // res.json(req.body.notes)
//   res.json("user addedd" + res.body );
// });

app.post("/api/user", (req, res) => {
  const notes = req.body;
  console.log("Adding user:::::", notes.title + "    " + notes.content);

  res.json("user addedd");
  const newNote = new Item(notes);
  newNote.save();
});




// app.post("/api", (req, res) => {
//   const dataNote = JSON.parse(req.body.data);

//   const newNotes = {
//     title: req.body.title,
//     content: req.body.content,
//   };
//   console.log(newNotes);
//   console.log(res.json);
// });

app.listen(port, () => {
  console.log(`server listens at http://localhost:${port}`);
});
