//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended:true}));

const n_port = 3000;

app.get("/", (req, res)=>{
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  var fn = req.body.txt_top;
  var ln = req.body.txt_middle;
  var e = req.body.txt_bottom;

  const data = {
    members : [
      {
        email_address: e,
        status: "subscribed",
        merge_fields:{
          FNAME : fn,
          LNAME : ln,
        }
      }
    ]
  };

  const JSON_data = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/9004c10ef3";

  const options = {
    method: "POST",
    auth: "khaledr:07ab9a1911f60243152806ea997273a3-us1",
  };

  const request = https.request(url, options, (response)=>{
    response.on("data", function(data){
      const errorCount = JSON.parse(data).error_count;

      if(response.statusCode >=200 && response.statusCode <= 299){
        if(errorCount == 0){
          res.sendFile(__dirname + "/sucess.html");
        }else {
          res.sendFile(__dirname + "/failure.html");
        }
      }

    });
    response.on("error", function(){
      console.log("خطاااااااااااااااااااا");
    });
  });

  request.write(JSON_data);
  request.end();

  // res.send("result is : " + fn + ln + e);
});

app.post("/fail", (req, res)=>{
  res.redirect("/");
});


app.listen(process.env.PORT || n_port, ()=>{
  console.log("Server is listening at port ${n_port}.");
});

//07ab9a1911f60243152806ea997273a3-us1
//9004c10ef3
//https://usX.api.mailchimp.com/3.0/lists/{list_id}
