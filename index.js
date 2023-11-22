const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
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
        auth: "mudigo:c6c8e97e5b7da9e3cd79b4f5fb63c3a7-us12"
    };

    const request = https.request(url, options, function(response) {
        let data = '';

        response.on('data', function(chunk) {
            data += chunk;
        });

        response.on('end', function() {
            const mailchimpResponse = JSON.parse(data);

            if (response.statusCode === 200) {
                console.log(mailchimpResponse);
                res.status(200).json({ message: "Subscription successful!" }); // Send a JSON response back to the client
            } else {
                console.error(mailchimpResponse);
                res.status(response.statusCode).json({ message: "Subscription failed. Please try again." }); // Send an error response
            }
        });
    });

    request.on('error', function(error) {
        console.error('Error making Mailchimp API request:', error);
        res.status(500).json({ message: "Internal server error. Please try again later." }); // Send an error response
    });

    request.write(jsonData);
    request.end();
});

// Export the express app as the handler for serverless functions
module.exports = app;
