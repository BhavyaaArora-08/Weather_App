const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));

const hbs = require("hbs");

const partialsPath = path.join(__dirname, "../templates/partials");
const viewsPath = path.join(__dirname, "../templates/views");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/weather", (req, res) => {
  const app_id = "7689069d792769144e82f86ca3962436";
  const country = req.body.country;
  const city = req.body.city;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${app_id}&units=metric`;

  request({ url: url, json: true }, (err, { body }) => {
    if (err) {
      return console.log(err);
    }
    if (body.message) {
      return console.log(body.message);
    }
    const temp = body.main.temp;
    const weather = body.weather[0].description;
    const icon = body.weather[0].icon;
    const imgSrc = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    res.render("weather", { weather: weather, temp: temp, imgSrc: imgSrc });
  });
});

app.listen("3000", () => {
  console.log("Server is running on port 3000");
});
