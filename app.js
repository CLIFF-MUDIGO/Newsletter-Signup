const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); // Import the 'https' module instead of 'request'
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    
    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/98dc67adc7";
    const options = {
        method: "POST",
        auth: "mudigo:564c855c4c45cb79d2d0bc0bd38a48f3-us12"
    };

    const request = https.request(url, options, function(response) {
        let data = '';

        response.on('data', function(chunk) {
            data += chunk;
        });

        response.on('end', function() {
            console.log(JSON.parse(data));
            res.send("Subscription successful!"); // Send a response back to the client
        });
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000");
});
