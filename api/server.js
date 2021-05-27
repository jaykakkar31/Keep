const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
let cors = require("cors");
const bcrypt = require("bcrypt"); //3
const saltRounds = 14;
// const passport =require("passport-local")
const passport = require("passport");
const session = require("express-session"); //1
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();
const port = 9000;
var sessionId;
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/KeeperAppDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

mongoose.set("useFindAndModify", false);
const itemsShema = new mongoose.Schema({
  title: String,
  content: String,
});
const userSchema = new mongoose.Schema({
  email: "",
  username: "",
  password: "",
  notes: itemsShema,

});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" }); //1

const User = mongoose.model("user", userSchema);
const Item = mongoose.model("Item", itemsShema);

passport.use(User.createStrategy()); //1
// passport.use(
//   new LocalStrategy(
//     { usernameField: "email", passwordField: "password" },
//     User.authenticate()
//   )
// );
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// passport.serializeUser(User.serializeUser());//1
// passport.deserializeUser(User.deserializeUser());//1

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
      //FOR Axios Use

      res.send(data);
    }
  });
});

app
  .route("/api/users")
  .post((req, res) => {
    const notes = req.body;
    console.log("Adding user:::::", notes.title + "    " + notes.content);

    res.json("user addedd");
    const newNote = new Item(notes);
    newNote.save();
  })
  .get((req, res) => {
      console.log(JSON.stringify(req.sessionID) + " Auth");
 
      console.log(JSON.stringify(req.passport) + " Auth");
      Item.find({}, (err, data) => {
        if (err) {
          console.log(err + "               ERROR");
        } else {
          console.log("Appii/Users");
          res.send(data);
        }
      });

  })
  .delete((req, res) => {
    const notesData = req.body;
    const id = notesData._id;
    console.log(JSON.stringify(req.body) + "DELETE");
    console.log(" Delete from server " + notesData._id);
    Item.findByIdAndRemove(id, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data + "  SUceesss");
        res.send(data);
      }
    });
  });

app.post("/login", (req, res) => {
  const login = req.body;
  console.log(login.password + " ddddddd");
  User.findOne({ email: login.email }, (err, data) => {
    console.log(data + " DATA FROM FINDONE");
    if (data !== null) {
      if (err) {
        console.log(err);
      } else {
        req.login(data, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log(data);
            passport.authenticate("local")(req, res, () => {
              data.sessionId = JSON.stringify(req.sessionID);
              data.save()
              console.log(req.sessionID + " Autt");
              res.write(
                JSON.stringify({
                  bool: true,
                  username: data.username,
                })
              );
              // res.write(data.username)
              res.send();
              // res.send()
            });
          }
        });
        // bcrypt.compare(req.body.password, data.password, (err, result) => {
        //   if (result === true) {
        //     res.json(true);
        //   } else {
        //     res.json("Password Is incorrect*");
        //   }
        // });
        // if (data.password === req.body.password) {
        //               res.json(true);

        //   console.log("PASWWORD CHECK");
        // } else {
        //   res.json("Password Is incorrect*");
        // }
      }
    } else {
      res.write(
        JSON.stringify({
          bool: false,
          username: "",
        })
      );
      // res.write(data.username)
      res.send();
      // res.json("Invalid email or password*");
    }
  });
});

app.post("/register", (req, res) => {
  const register = req.body;

  User.register(
    { email: req.body.email, username: req.body.username },

    req.body.password,

    function (err, user) {
      if (err) {
        console.log(err);
        //  res.redirect("/register");
      } else {
        console.log("REGISTERED " + user);
        passport.authenticate("local")(req, res, function () {
          res.json("success");
        });
      }
    }
  );

  // console.log(JSON.stringify(register) + "ddddddd");
  // bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
  //   const newUser = new User({
  //     email: req.body.email,
  //     username: req.body.username,
  //     password: hash,
  //   });
  //   newUser.save((err) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("SuccessFully Inserted ");
  //       res.json("success");
  //     }
  //   });
  // });
});

app.listen(port, () => {
  console.log(`server listens at http://localhost:${port}`);
});
