const Jimp = require("jimp");
const express = require("express");
const app = express(); // app variable la express server vangikurom
const fs = require("fs");
const request = require("request"); //request library to download
let cache = {};
app.get("/memegen/api/:imageTxt", (req, res) => {
  processImage(req, res);
});

const refreshCache = (cache, src) => {
  const image = cache[src];
  // delete D and readd D so D becomes most recently used
  delete cache[src];
  cache[src] = image.clone();
};

const writeToCache = (cache, src, img) => {
  const cacheKeys = Object.keys(cache);
  if (cacheKeys.length >= 10) {
    //least used will be deleted if called again and will be added recently.
    delete cache[cacheKeys[0]];
  }
  cache[src] = img.clone();
};

const processImage = (req, res) => {
  const src = req.query.src;
  const url = src || "https://placeimg.com/640/480/any";
  const blur = req.query.blur;
  const black = req.query.black;
  const imageTxt = req.params["imageTxt"];
  let fontPromise;
  if (black) {
    fontPromise = Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  } else {
    fontPromise = Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  }

  // check if it exists in cache
  if (cache[src]) {
    const image = cache[src];
    refreshCache(cache, src);
    processFontAndImage(fontPromise, blur, image, imageTxt, res);
  } else {
    Jimp.read(url)
      .then((image) => {
        if(src) {
          writeToCache(cache, src, image);
        }
        processFontAndImage(fontPromise, blur, image, imageTxt, res);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const processFontAndImage = (fontPromise, blur, image, imageTxt, res) => {
  fontPromise.then((font) => {
    if (blur) {
      image.blur(+blur);
    }
    image.print(font, 10, 10, imageTxt);
    image.getBuffer(Jimp.MIME_PNG, (err,buffer) =>{
      res.writeHead(200, {
        'Content-Type': 'image/png',
      });
      res.write(buffer,'binary');
      res.end(null, 'binary');
    })
  });
};

app.listen(8500);
