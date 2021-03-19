const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json()); //is a method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.urlencoded({ extended: true })); //is a method inbuilt in express to recognize the incoming Request Object as strings or arrays
const path = require("path");
const testFolder = "fileCreated";

app.post("/api/files", (req, res) => {
  const filename = req.body.filename;
  const text = req.body.text;
  fs.writeFile(`./fileCreated/${filename}`, `${text}`, function (err, data) {
    if (err) {
      return console.log(err);
    }
    res.send("done");
    setTimeout(() => {
      try {
        fs.unlinkSync(`./fileCreated/${filename}`);
      } catch (err) {
        throw error;
      }
    }, 300000);
  });
});

app.get("/api/files", (req, res) => {
  fs.readdir(testFolder, (err, fileTitles) => {
    if (err) {
      return console.log(err);
    }
    res.send(fileTitles);
  });
});

app.get("/api/files/:filename", (req, res) => {
  const param = req.params.filename;
  fs.readFile(`./fileCreated/${param}`, "utf8", (err, fileContents) => {
    if (err) {
      res.send("File not found");
      return console.log(err);
    }
    res.send(fileContents);
  });
});

app.listen(9000);
