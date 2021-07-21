//                 Google_API.js
//
// Module to synchronously interact with Google API
//             Creates google_api Object
//             Uses functional programing
//

// _______________________
// Imports and definitions
//
import https from "https";

const google_api = Object.create(null);

const api_key = "";

// ________________
// Requests handler
//

// Create an https request given specific parameters
function httpsRequest(params, postData) {

    // Use promise to asynchronously receive response
    return new Promise(function (resolve, reject) {
        // Create https request
        var req = https.request(params, function (res) {

            // Return no result on error code
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return resolve("No value");
            }

            var body = []; // Create array to accumulate data

            // When data received add it to the array
            res.on("data", function (chunk) {
                body.push(chunk);
            });

            // Resolve promise on end
            res.on("end", function () {
                try {
                    // Concat and parse body as JSON
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e); // reject on error
                }
                resolve(body); // resolve and return body
            });
        });
        // Return no result on request error
        req.on("error", function () {
            resolve("No value");
        });
        if (postData) {
            req.write(postData); //write postData if provided
        }
        req.end(); // end request
    });
}

// ________________
// Module functions
//

// Given an address, return the formatted address from the API
google_api.generate_formatted_address = function (address) {

    return new Promise(function (resolve) {

        // Request parameters
        const req_address = address.split(" ").join("+");
        const req_path = "/maps/api/geocode/json?address=";

        const params = {
            host: "maps.googleapis.com",
            port: 443,
            method: "GET",
            path: req_path + req_address + "&key=" + api_key
        };

        // Create request
        httpsRequest(params).then(function (body) {
            // Try to get result from callback
            try {
                resolve(body.results[0].formatted_address);
            } catch { // Otherwise return error
                resolve("No addresses were found");
            }
        });
    });
};

// Given an start and end address, estimate the public transport
// travel time from the API
google_api.calculate_tube_info = function (start_address, end_address) {

    return new Promise(function (resolve) {

        // Request parameters
        const req_start_address = start_address.split(" ").join("+");
        const req_end_address = end_address.split(" ").join("+");
        const req_path = "/maps/api/distancematrix/json?units=metric&origins=";
        const req_options = "&mode=transit";

        const params = {
            host: "maps.googleapis.com",
            port: 443,
            method: "GET",
            path: req_path + req_start_address + req_options
            + "&destinations=" + req_end_address + "&key=" + api_key
        };

        // Create request
        httpsRequest(params).then(function (body) {
            // Try to get result from callback
            try {
                resolve(body.rows[0].elements[0].duration.text);
            } catch { // Otherwise return error
                resolve("No addresses were found");
            }
        });
    });
};

// Given an start and end address, estimate the cycling travel time from the API
google_api.calculate_cycling_info = function (start_address, end_address) {

    return new Promise(function (resolve) {

        // Request parameters
        const req_start_address = start_address.split(" ").join("+");
        const req_end_address = end_address.split(" ").join("+");
        const req_path = "/maps/api/distancematrix/json?units=metric&origins=";
        const req_options = "&mode=bicycling";

        const params = {
            host: "maps.googleapis.com",
            port: 443,
            method: "GET",
            path: req_path + req_start_address + req_options
            + "&destinations=" + req_end_address + "&key=" + api_key
        };

        // Create request
        httpsRequest(params).then(function (body) {
            // Try to get result from callback
            try {
                resolve(body.rows[0].elements[0].duration.text);
            } catch { // Otherwise return error
                resolve("No addresses were found");
            }
        });
    });
};

// Given an start and end address, estimate the distance from the API
google_api.calculate_distance = function (start_address, end_address) {

    return new Promise(function (resolve) {


        // Request parameters
        const req_start_address = start_address.split(" ").join("+");
        const req_end_address = end_address.split(" ").join("+");
        const req_path = "/maps/api/distancematrix/json?units=metric&origins=";
        const req_options = "&mode=walking";

        const params = {
            host: "maps.googleapis.com",
            port: 443,
            method: "GET",
            path: req_path + req_start_address + req_options
            + "&destinations=" + req_end_address + "&key=" + api_key
        };


        // Create request
        httpsRequest(params).then(function (body) {
            // Try to get result from callback
            try {
                resolve(body.rows[0].elements[0].distance.text);
            } catch { // Otherwise return error
                resolve("No addresses were found");
            }
        });
    });
};

export default Object.freeze(google_api);