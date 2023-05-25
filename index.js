const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const { allowedNodeEnvironmentFlags } = require("process");
const { Server } = require("http");
const app = express();
dotEnv.config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));

app.set("view engine", "ejs");

const Recipie = mongoose.model("Recipie", {
  recipieName: String,
  recipieTime: String,
  ingridients: Array,
  serves: String,
});

app.get("/", (req, res) => {
  res.send(console.log("everyhing aokay"));
  res.sendFile(__dirname + "/index.html");
});

app.get("/recipies", (req, res) => {
  Recipie.find()
    .then((recipies) => {
      res.json({ recipies });
    })
    .catch((err) => {
      res.json({ error: "Something went wrong" });
    });
});

app.post("/recipies", (req, res) => {
  const { recipieName, recipieTime, ingridients, serves } = req.body;
  const recipie = new Recipie({
    // recipieName: "Idli",
    // recipieTime: "15 mins",
    // ingridients: ["dal","water","salt"],
    // serves: "1 person",
    recipieName: recipieName,
    recipieTime: recipieTime,
    ingridients: ingridients,
    serves: serves,
  });
  recipie
    .save()
    .then(() => {
      res.json({ message: "recipie added successfully" });
    })
    .catch((err) => {
      res.json({ error: "something went wrong" });
    });
});

app.put("/recipies/:id", (req, res) => {
  let { id } = req.params;
  const { recipieName, recipieTime, ingridients, serves } = req.body;
  Recipie.findByIdAndUpdate(id, {
    recipieName: recipieName,
    recipieTime: recipieTime,
    ingridients: ingridients,
    serves: serves,
  })
    .then(() => {
      res.json({ message: "recipie updated successfully" });
    })
    .catch((err) => {
      res.json({ error: "something went wrong" });
    });
});

app.delete("/recipie/:id", (req, res) => {
    let {id} = req.params;
    Recipie.findByIdAndDelete(id).then((recipie) => {
        console.log(recipie)
        res.json({ message: "recipie deleted successfully" });
      })
      .catch((err) => {
        res.json({ error: "something went wrong" });
      });
})

app.listen(process.env.PORT, () => {
  console.log("listening on port 4000");
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connection established");
      console.log("server is running on port 4000");
    })

    .catch((err) => console.error("DB Connection failed", err));
});
