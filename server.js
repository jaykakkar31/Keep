require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// let cors = require("cors");
const bcrypt = require("bcrypt"); //3
const saltRounds = 14;
// const passport =require("passport-local")
const passport = require("passport");
const session = require("express-session"); //1
const passportLocalMongoose = require("passport-local-mongoose");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var findOrCreate = require("mongoose-findorcreate"); //5

const path=require("path")
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_Id);
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT||9000;

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

mongoose.connect(
	"mongodb+srv://admin-jay:admin-jay@cluster0.0hrwx.mongodb.net/KeeperDB?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);
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
	notes: [itemsShema],
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" }); //1
userSchema.plugin(findOrCreate);
const User = mongoose.model("user", userSchema);
const Item = mongoose.model("Item", itemsShema);

passport.use(User.createStrategy()); //1

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

const item1 = new Item({
	title: "Loki",
	content: "Marvel",
});

const item2 = new Item({
	title: "JAy",
	content: "Kakkar",
});

const defaultArray = [item1, item2];

const whitelist = [
	"http://localhost:3000",
	"http://localhost:9000",
	// "https://shrouded-journey-38552.herokuapp.com",
];
const corsOptions = {
	origin: function (origin, callback) {
		console.log("** Origin of request " + origin);
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			console.log("Origin acceptable");
			callback(null, true);
		} else {
			console.log("Origin rejected");
			callback(new Error("Not allowed by CORS"));
		}
	},
};


app.use(cors(corsOptions));



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

		

			console.log("Exists" + data.length);
			//FOR Axios Use

			res.send(data);
		}
	});
});

app.post("/api/googleLogin", (req, res) => {
	console.log(JSON.stringify(req.body) + "  Api/Login");
	const { tokenId, googleId } = req.body;

	client
		.verifyIdToken({ idToken: tokenId, audience: process.env.CLIENT_Id })
		.then((response) => {
			const { email_verified, name, email } = response.payload;

			if (email_verified) {
				User.findOne({ email: email }, (err, foundUser) => {
					if (err) {
						return res.status(400).json({
							error: "Something went wrong",
						});
					} else {
						if (foundUser) {
							console.log("Notes Available  " + foundUser.notes);
							res.send(foundUser);
						} else {
							const newUser = new User({
								email: email,
								username: name,
							});
							newUser.save((err, data) => {
								if (err) {
									console.log(err);
								}
								res.send(newUser);
							});
						}
					}
				});
			}

			console.log(JSON.stringify(response.payload) + " PAYLOAD");
		});
});

app.post("/api/facebookLogin", (req, res) => {
	console.log(JSON.stringify(req.body) + "  Api/Login");

	const { accessToken, userID } = req.body;

	fetch(
		`https://graph.facebook.com/${userID}?fields=id,name,email&access_token=${accessToken}`,
		{
			method: "post",
		}
	)
		.then((response) => response.json())
		.then((response) => {
			const { id, name, email } = response;

			User.findOne({ email: email }, (err, foundUserByID) => {
				if (err) {
					console.log(err);
				} else {
					if (foundUserByID) {
						console.log("Notes Available  " + foundUserByID);
						res.send(foundUserByID);
					} else {
						const newUser = new User({
							email: email,
							username: name,
						});
						newUser.save((err) => {
							if (err) {
								console.log(err);
							} else {
								res.send(newUser);
							}
						});
					}
				}
			});
		});
});

app.post("/api/users/:email", (req, res) => {
	const notesReqData = req.body;
	console.log("Adding user:::::" + JSON.stringify(notesReqData.note));

	User.findOne({ email: req.params.email }, (err, data) => {
		data.notes.push(notesReqData.note);
		data.save();
		console.log(JSON.stringify(data));
		res.send("USER ADDED");
	});
});

app.delete("/api/users/:email", (req, res) => {
	const notesData = req.body;
	const id = notesData._id;
	console.log(JSON.stringify(id) + "DELETE");
	console.log(" Delete from server " + notesData._id);
	User.findOne({ email: req.params.email }, (err, foundUser) => {
		if (err) {
			console.log(err);
		} else {
			var newArr = foundUser.notes.filter((i) => {
				console.log(
					i._id.toString().localeCompare(id.toString()) + " Value of i"
				);
				return i._id.toString().localeCompare(id.toString()) !== 0 && i;
			});

			console.log(newArr);
			foundUser.notes = newArr;
			foundUser.save();
			console.log("  SUceesss Note Removed");
			res.send(foundUser);
		}
	});
});

app.get("/api/users/:email", (req, res) => {
	User.findOne({ email: req.params.email }, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Appii/Users");
			res.send(data);
		}
	});
});

app.post("/login", (req, res) => {
	const login = req.body;
	var count = 0;
	User.findOne({ email: login.email }, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			if (data !== null) {
				bcrypt.compare(req.body.password, data.password, (err, result) => {
					if (result === true) {
						res.send(data);
					} else {
						res.send("Password Is incorrect");
					}
				});
			} else {
				console.log(data + "Login Fail");

				res.send("Invalid email or password");
			}
		}
	});
});

app.patch("/forgotPass", (req, res) => {
	const details = req.body;
	console.log(details);

	User.findOne({ email: req.body.email }, (err, foundUser) => {
		if (err) {
			console.log(err);
		} else {
			if (foundUser) {
				foundUser.setPassword(req.body.password, (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("PasswordReset Success");
						foundUser.save();
					}
				});
			} else {
				console.log("USER Doesnot exist");
			}
		}
	});
});

app.post("/register", (req, res) => {
	const register = req.body;
	User.findOne({ email: req.body.email }, (err, foundUser) => {
		if (foundUser) {
			res.json("Failure");
		} else {
			bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
				const newUser = new User({
					email: req.body.email,
					username: req.body.username,
					password: hash,
				});
				newUser.save((err) => {
					if (err) {
						console.log(err);
					} else {
						console.log("SuccessFully Inserted ");
						res.json("success");
					}
				});
			});
		}
	});
});



if (process.env.NODE_ENV === "production") {
	// Serve any static files
	app.use(express.static(path.join(__dirname, "client/build")));
	// Handle React routing, return all requests to React app
	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "client/build", "index.html"));
	});
}

app.listen(port, () => {
	console.log(`server listens at http://localhost:${port}`);
});
