const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
// const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    console.log(firstName + lastName + email);

    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            },
        },
        ],
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us19.api.mailchimp.com/3.0/lists/4a9db352af";

    const options = {
        method: "POST",
        auth: "dev:3c7c57a579be54f2c0608235119cc346-us19",
    };

    const request = https.request(url, options, function (response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            //if console.log gives error unhandled event also write and end then check
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is listening on port 3000");
});


//api key
// 3c7c57a579be54f2c0608235119cc346-us19

// list id
// 4a9db352af