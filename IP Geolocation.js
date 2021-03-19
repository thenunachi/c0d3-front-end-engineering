const express = require("express");
const fetch = require("node-fetch");
const app = express();
let visitorCount = 0;
let countMap = {};
app.get("/api/visitors", (req, res) => {
  res.json(countMap);
});
app.get("/visitors", (req, res) => {
  let ipaddress = req.ip.replace("::ffff:", "").replace("::1", "") || "8.8.8.8";//to stimulate external locations.
  fetch(`https://js5.c0d3.com/location/api/ip/${ipaddress}`, {
    method: "GET",
    headers: {
      "x-forwarded-for": ipaddress,
    },
  })
    .then((res) => res.json())
    .catch((e) => res.send("ERROR")) // error in location api call
    .then((result) => {
      countMap[result.cityStr] = (countMap[result.cityStr] || 0) + 1;
      let Obj = Object.entries(countMap);
      let Object1 = Obj.reduce((acc, e) => {
        acc = acc + e;
        return acc + "<br>";
      }, "");
      res.send(`
      <div id="googleMap" style="width:100%;height:400px;"></div>
      <script>
function myMap() {
var mapProp= {
  center:new google.maps.LatLng(${result.ll[0]},${result.ll[1]}),
  zoom:5,
};
var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}
</script>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&amp&callback=myMap"></script>
      <h1>
      
      The cities our visitors come from <br>
      ${Object1}
      
      </h1> `);
    });
});
app.listen(9000);
