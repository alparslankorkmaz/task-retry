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

dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const bodyParser = require("body-parser");
const app = express();

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(mongoSanitize());

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

const formSchema = Joi.object({
  firstname: Joi.string().max(50).required(),
  lastname: Joi.string().max(50).required(),
  companyname: Joi.string().max(50).required(),
  email: Joi.string().max(50).required(),
  address: Joi.string().max(50).required(),
  postcode: Joi.string().max(20).required(),
}).required();
formSchema.validate();

app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

app.get("/success", (req, res) => {
  res.render(__dirname + "/views/success.ejs");
});

app.post("/register", urlencodedParser, async (req, res, next) => {
  const { error, value } = formSchema.validate(req.body);

  if (error) {
    return res.send("Invalid Request.");
  } else {
    try {
      const newPar = new Participant({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        companyname: req.body.companyname,
        email: req.body.email,
        address: req.body.address,
        postcode: req.body.postcode,
      });
      await newPar.save();
      setTimeout(function () {
        res.redirect("/success");
      }, 2000);
    } catch (e) {
      next(e);
    }
  }
});

app.use((req, res, next) => {
  res.render(__dirname + "/views/error.ejs");
  next();
});

app.listen(3000);
