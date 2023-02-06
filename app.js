const express = require('express');
const https = require('https');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/weather.html");
});

app.post("/", function(req,res) {
  const query = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units=metric&appid=dcca6e769cae7113a339005f3d846d1f";
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data",function(data) {
      const weatherdata = JSON.parse(data);
      const temp = weatherdata.main.temp;
      const weatherDescr = weatherdata.weather[0].description;
      const icon = weatherdata.weather[0].icon;
      const iconurl = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
      // res.write("<h1>The temperature in "+query+" is " + temp + " degree celsius</h1>");
      // res.write("<p>The weather in "+query+" is " + weatherDescr + "<p>");
      // res.write("<img src=" +iconurl+ ">");
      res.write(`
        <!DOCTYPE html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8">
          <title>`+query+`</title>

          <!-- Bootstrap core CSS -->
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

        </head>
        <body>
          <div class="jumbotron">
            <h1 class="display-4">`+query+`</h1>
            <p class="lead">The temperature in `+query+` is ` + temp + ` degree celsius</p>
            <p class="lead">The weather in `+query+` is ` + weatherDescr + `</p>
            <img src=`+iconurl+`>
            <hr class="my-4">
            <p>Enjoy!</p>
            <form action="/try" method="post">
              <button class="btn btn-primary btn-lg btn-warning" type = "submit" name="button">Try again</button>
            </form>
          </div>
        </body>
      </html>`);
      res.send();
          })
        })
      });

app.post("/try", function(req,res){
  res.redirect("/");
})

app.listen(3000,function(){
  console.log("Server is running on port 3000 baby");
})
