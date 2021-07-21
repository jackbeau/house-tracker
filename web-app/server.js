    //             Housing Assistant

    //     A webapp that calculates metrics
    // to make it easier to compare housing options

    //             By: Jack Beaumont
    //         Summer 2021 Computing Coursework

//
// Imports
//

import express from "express";
import session from "express-session";
import Handler from "./handler.js";

//
// Express server setup
//

const port = 8080;
const app = express();

// Setup session for local user storage
app.use(session({
    "secret": "a1652321-1c7d-468b-b6a2-4fddc4fde562",
    "resave": false,
    "saveUninitialized": false
}));

app.use("/", express.static("web-app/static"));

app.use("/", express.json());

// POST method route
app.post("/", function (req, res) {
    const request_object = req.body;

    // In case session data is empty
    if (!req.session.data) {
        req.session.data = {};
    }

    // Call specific handler to act on request and return response to client
    Handler[request_object.type](request_object, req.session.data).then(
        function (response_object) {
            res.json(response_object);
        }
    );
});

//
// Start local server
//

app.listen(port, function () {
    console.log(`Listening on port ${port} = http://localhost:${port}`);
});