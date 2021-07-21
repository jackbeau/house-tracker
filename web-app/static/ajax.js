//                   Ajax.js
//
//        Module to interact with backend
//

// _______________________
// Imports and definitions
//
const Ajax = Object.create(null);

const fetch = window.fetch;
const json = (response) => response.json();

// Send query
Ajax.query = function (request_object) {
    // Convert body to JSON
    const body = JSON.stringify(request_object);

    // Send POST request
    return fetch("/", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json); // Parse response
};

export default Object.freeze(Ajax);