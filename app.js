const express = require("express");
//bring keys
const keys = require("./config/keys");
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require("stripe")(keys.stripeSecretKey);

const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

// Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//static folder for images and stylesheet
app.use(express.static(`${__dirname}/public`));

//index route  ==> passing publishable key
app.get("/", (req, res) => {
  res.render("index", {
    stripePublishableKey: keys.stripePublishableKey,
  }); //to render index , we need middleware dependcies
});

app.get("/success", (req, res) => {
  res.render("success"); //to render index , we need middleware dependcies
});

/// Charge Route
app.post("/charge", (req, res) => {
  const amount = 2500;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "Web Development Ebook",
        currency: "usd",
        customer: customer.id,
      })
    )
    .then((charge) => res.render("success"));
});
const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
