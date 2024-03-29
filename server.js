if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Joi = require("joi");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const Participant = require("./models/participant");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/registration";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

// helmet bypass
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
];
const styleSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://cdn.jsdelivr.net/",
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:"],
      childSrc: ["blob:"],
    },
  })
);

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/src")));

// server side validation
const validateReg = (req, res, next) => {
  const formSchema = Joi.object({
    firstname: Joi.string().max(50).required(),
    lastname: Joi.string().max(50).required(),
    companyname: Joi.string().max(50).required(),
    email: Joi.string().email().lowercase().max(50).required(),
    address: Joi.string().max(50).required(),
    postcode: Joi.string().max(20).required(),
  }).required();

  const newReg = req.body;

  const { error } = formSchema.validate(newReg);

  if (error) {
    return res.send("Invalid request.");
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

app.get("/success", (req, res) => {
  res.render(__dirname + "/views/success.ejs");
});

app.post("/register", validateReg, async (req, res, next) => {
  const { firstname, lastname, companyname, email, address, postcode } =
    req.body;

  try {
    await Participant.create({
      firstname,
      lastname,
      companyname,
      email,
      address,
      postcode,
    });
    setTimeout(function () {
      res.redirect("/success");
    }, 2000);
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

app.use((req, res, next) => {
  res.render(__dirname + "/views/error.ejs");
  next();
});

app.listen(3000);
