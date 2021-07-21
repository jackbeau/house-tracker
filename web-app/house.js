//                          House.js
//
//               Module to manipulate house object
//                     Creates House Object
//                   Uses function programing
//

const house = Object.create(null);

// __________________
// Helper functions
//

// Generate a unique ID
house.generate_unique_id = function (my_property_list) {
    // If no houses exist set ID to 0
    if (my_property_list.length === 0) {
        return 0;
    }
    // Otherwise use next biggest unique available ID
    const largest_ID = my_property_list.reduce((a, x) => (
        a.ID >= x.ID
        ? a
        : x
    ));

    return largest_ID.ID + 1;
};

// Get all IDs from a house list
const get_all_IDs = (house_list) => house_list.map((h) => h.ID);

// Find any duplicated values in a list
const findDuplicates = (arr) => arr.filter(
    (item, index) => arr.indexOf(item) !== index
);

// Check is every ID in a house_list is unique
house.check_unique_ID = function (house_list) {
    return findDuplicates(get_all_IDs(house_list)).length;
};

// __________________
// New house creation
//

// Define template structure for house
const house_template = {
    "ID": 0,
    "Address": "",
    "Price": 0,
    "Bedrooms": 0,
    "Bathrooms": 0,
    "Distance": 0,
    "Tube_time": 0,
    "Bike_time": 0
};

// Returns a new house with a given id
const new_house = function (id) {
    let temp_house = house_template; // duplicate template
    temp_house.ID = id; // set id
    return temp_house;
};

// Add new house to list of houses
const add_house = (list, id) => list.concat(new_house(id));

// Add template house to house list
house.create_template_house = function (my_property_list, id) {
    my_property_list = add_house(my_property_list, id);
    return my_property_list;
};

// __________________
// House modification
//

// Get a specific house from all the houses with a specific ID
const get_house = function (list) {
    return function (ID) {
        // Filter list of all properties and return first
        // house with requested ID
        return list.filter((house) => String(house.ID) === String(ID))[0];
    };
};

// Set the value of a specific key for a house
// Provide the key, house and value to be set
const set_value = function (key) {
    return function (house) {
        return function (value) {
            // Create temporary house to keep code pure
            let house_temp = Object.assign({}, house);
            house_temp[key] = value; //set new value
            return house_temp;
        };
    };
};

// Set address given the house and the address, returns house
const set_address = (house, value) => set_value("Address")(house)(value);

// Set price given the house and the price, returns house
const set_price = (house, value) => set_value("Price")(house)(value);

// Set bedrooms given the house and the bedrooms, returns house
const set_bedrooms = (house, value) => set_value("Bedrooms")(house)(value);

// Set bathrooms given the house and the bathrooms, returns house
const set_bathrooms = (house, value) => set_value("Bathrooms")(house)(value);

// Set distance given the house and the distance, returns house
const set_distance = (house, value) => set_value("Distance")(house)(value);

// Set tube time given the house and the tube time, returns house
const set_tube_time = (house, value) => set_value("Tube_time")(house)(value);

// Set bike time given the house and the bike time, returns house
const set_bike_time = (house, value) => set_value("Bike_time")(house)(value);

// _________________
// General functions
//

// Save house info
house.save_house = function (id, my_property_list) {

    // Check if every ID in the list is unique
    if (house.check_unique_ID(my_property_list) !== 0) {
        throw new Error("ID not unique");
    }

    // Get house using ID
    let h = get_house(my_property_list)(id);

    // Set default values if none provided
    return function (
        address = h.Address,
        price = h.Price,
        bedrooms = h.Bedrooms,
        bathrooms = h.Bathrooms,
        distance = h.Distance,
        tube_time = h.Tube_time,
        bike_time = h.Bike_time
    ) {

        // Set new values
        h = set_address(h, address);
        h = set_price(h, price);
        h = set_bedrooms(h, bedrooms);
        h = set_bathrooms(h, bathrooms);
        h = set_distance(h, distance);
        h = set_tube_time(h, tube_time);
        h = set_bike_time(h, bike_time);

        // Delete old house from house list
        my_property_list = house.delete_house(my_property_list)(id);

        // Add new house to house list
        my_property_list = my_property_list.concat(h);

        // Return all houses
        return my_property_list;
    };
};

// Set specific house parameter
house.set_param = function (id, my_property_list) {

    // Check if every ID in the list is unique
    if (house.check_unique_ID(my_property_list) !== 0) {
        throw new Error("ID not unique");
    }

    // Get house using ID
    let h = get_house(my_property_list)(id);


    return function (param, value) {

        // Set new value for specific parameter
        h = set_value(param)(h)(value);

        // Delete old house from house list
        my_property_list = house.delete_house(my_property_list)(id);

        // Add new house to house list
        my_property_list = my_property_list.concat(h);

        // Return all houses
        return my_property_list;
    };
};

// Delete a house from the list given its ID
house.delete_house = function (list) {
    return function (ID) {
        // Filter list of all properties and remove first
        // house with requested ID
        return list.filter((house) => String(house.ID) !== String(ID));
    };
};

// Sort houses in a list by key
house.sort = (list, key) => list.sort((a, b) => (
    parseInt(a[key]) > parseInt(b[key]) // if element bigger than previous one
    ? 1 // keep current position
    : -1 // invert
));

export default Object.freeze(house);