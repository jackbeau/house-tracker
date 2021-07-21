//                          Handler.js
//
// Module to act asynchronously on messages received from client
//                      Creates Handler Object
//

// _______________________
// Imports and definitions
//

import house from "./house.js";
import google_api from "./google_api.js";

const Handler = Object.create(null);

let my_property_list = []; // Server storage of all properties
let work_address = "";

// Handler provides object will all saved properties
Handler.house_list = function (request_object, ignore) {

    // Sort properties
    my_property_list = house.sort(my_property_list, request_object.sort);

    // Return all properties
    return Promise.resolve({"houses": my_property_list});
};

// Handler adds a new house to my_property_list
Handler.add = function (request_object, ignore) {

    // Resolve with promise due to Google API calls
    return new Promise(function () {
        // Generate unique ID for house
        const new_ID = house.generate_unique_id(my_property_list);

        // Generate template
        my_property_list = house.create_template_house(
            my_property_list,
            new_ID
        );

        // Set values provided from request
        my_property_list = house.save_house(
            new_ID,
            my_property_list
        )(
            request_object.address,
            request_object.price,
            request_object.bedrooms,
            request_object.bathrooms
        );

        // Calculate metrics with Google API
        calculate_metrics(new_ID, request_object.address);
    });
};

// Handler edits an existing property and saves to my_property_list
Handler.edit = function (request_object, ignore) {

    // Set values provided from request
    my_property_list = house.save_house(
        parseInt(request_object.ID),
        my_property_list
    )(
        request_object.address,
        request_object.price,
        request_object.bedrooms,
        request_object.bathrooms
    );

    // Calculate metrics with Google API
    calculate_metrics(parseInt(request_object.ID), request_object.address);

    // Return all properties
    return Promise.resolve({"houses": my_property_list});
};

// Handler deletes house using its ID
Handler.delete = function (request_object, ignore) {
    // Delete house
    my_property_list = house.delete_house(my_property_list)(request_object.id);
    // Return all properties
    return Promise.resolve({"houses": my_property_list});
};

// Calculate formatted address and travel times
const calculate_metrics = function (ID, address) {
    // Format address using Google API
    google_api.generate_formatted_address(address).then(
        function (result) {
            // Update address with new value
            my_property_list = house.save_house(
                ID,
                my_property_list
            )(result);
        }
    );

    // Set tube travel time
    google_api.calculate_tube_info(address, work_address).then(
        function (result) {
            // Update tube time with new value
            my_property_list = house.set_param(
                ID,
                my_property_list
            )("Tube_time", result);
        }
    );

    // Set bike travel time
    google_api.calculate_cycling_info(address, work_address).then(
        function (result) {
            // Update bike time with new value
            my_property_list = house.set_param(
                ID,
                my_property_list
            )("Bike_time", result);
        }
    );

    // Set distance
    google_api.calculate_distance(address, work_address).then(
        function (result) {
            // Update distance with new value
            my_property_list = house.set_param(
                ID,
                my_property_list
            )("Distance", result);
        }
    );
};

// Handler adds a new house to my_property_list
Handler.format_address = function (request_object, ignore) {

    return new Promise(function (resolve) {

        // Create request
        google_api.generate_formatted_address(request_object.address).then(
            function (body) {
                // On callback resolve promise and return formatted address
                resolve(body);
            }
        );
    });
};


// Handler adds a new house to my_property_list
Handler.format_work_address = function (request_object, ignore) {

    return new Promise(function (resolve) {

        // Create request
        google_api.generate_formatted_address(request_object.address).then(
            function (body) {
                // On callback resolve promise and return formatted work address
                resolve(body);
                work_address = body;
            }
        );
    });
};
export default Object.freeze(Handler);