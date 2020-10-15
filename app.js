const express = require('express');
const app = express();
const request = require('request');
require("dotenv").config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/subscribe", (req, res) => {
    if(
        req.body.captcha === "" ||
        req.body.captcha === null ||
        req.body.captcha === undefined
        ) {
            res.json({success: false, message: "Please enter a valid captcha..."});

    } else {
        // Secret key
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        // Verify URL
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

        // Make request to verify URL
        request(verifyUrl, (err, response, body) => {
            body = JSON.parse(body);
            // If not succesfull
            if(body.success !== undefined && !body.success) {

                res.json({success: false, message: "Failed captcha verification"});
            } else {
                res.json({success: true, message: "captcha passed!!!"});
            }

        })

    }
})

const port = 5000;
app.listen(port, () => console.log(`listening on port ${port}`))


