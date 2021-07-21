//                   main.js
//
//                Frontend script
//

// _______________________
// Imports and definitions
//

import Ajax from "./ajax.js";

const save_button = document.getElementById("save-button");
const delete_button = document.getElementById("delete-button");
const refresh_button = document.getElementById("refresh");
const editor_button = document.getElementById("editor");
const close_cross = document.getElementsByClassName("close")[0];

const update_address = document.getElementById("update-address");
const update_work_address = document.getElementById("update-work-address");

const select = document.querySelector("select");

const houses = document.getElementById("houses");
const address = document.getElementById("address");
const work_address = document.getElementById("work_address");
const price = document.getElementById("price");
const bedrooms = document.getElementById("bedrooms");
const bathrooms = document.getElementById("bathrooms");

const edit_card = document.getElementById("edit-card");
const edit_global_card = document.getElementById("edit-global-card");
const modal = document.getElementById("myModal");

let selected_house = ""; // house selected in editor
let editing = false; // editing enabled
let sort = "Price"; // by default sort properties by price

// _______________________
// Helpers
//

// Clone a template
const cloneTemplate = function (id) {
    return document.importNode(document.getElementById(id).content, true);
};

// _______________________
// Button events
//

// Refresh house list when refresh button pressed
refresh_button.onclick = function () {
    list_houses();
};

// Open modal when user presses editor button
editor_button.onclick = function () {
    modal.style.display = "block";
};

// Close modal when user presses cross
close_cross.onclick = function () {
    modal.style.display = "none";
    editing = false; // disable editing
    empty_edit(); // clear editor fields
};

// Close modal when user presses cross when the user
// clicks outside
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
        editing = false; // disable editing
        empty_edit(); // clear editor fields
    }
};

// Delete house when delete button pressed
delete_button.onclick = function () {

    modal.style.display = "none"; // hide editor

    editing = false; // disable editing
    empty_edit(); // clear editor fields

    delete_house(selected_house);
};

// Save house when save button pressed
save_button.onclick = () => save();

// Remove all house cards from view
const clear_houses = function () {
    while (houses.firstChild) { // iterate through all house cards
        houses.removeChild(houses.lastChild); // remove house card
    }
};

// Get formatted address when get address button pressed
update_address.onclick = () => get_formatted_address();

// Get formatted address when get address button pressed
update_work_address.onclick = () => get_formatted_work_address();

// Sort houses by key
const sort_houses = function (select) {
    sort = select.target.value; // set sort key
    list_houses(); // list houses
};

// Listen for change in sort list
select.addEventListener("input", sort_houses);

// ___________
// Load houses
//

// Render list of houses in view
const list_houses = function () {

    clear_houses(); // remove all houses from view

    // get house list
    Ajax.query({
        "type": "house_list",
        "sort": sort
    }).then(function (response_object) {
        // Create card for each house
        response_object.houses.map((h) => load_house(h));
    });
};

// Create card for a house given an object
const load_house = function (house) {

    // Clone card template
    const new_house = cloneTemplate("my-house");

    // Set ID name
    new_house.querySelector(
        "[name=ID]"
    ).id = (house.ID);

    // Set address
    new_house.querySelector(
        "[class=address]"
    ).textContent = house.Address;

    // Set price
    new_house.querySelector(
        "[name=price]"
    ).textContent = house.Price;

    // Calculate and set price per bedroom
    if (house.Bedrooms > 0) { // only possible if bedrooms > 0
        new_house.querySelector(
            "[name=price_pp]"
        ).textContent = Math.floor(house.Price / house.Bedrooms);
    } else {
        new_house.querySelector(
            "[name=price_pp]"
        ).textContent = NaN;
    }

    // Set bedrooms
    new_house.querySelector(
        "[name=bedrooms]"
    ).textContent = house.Bedrooms;

    // Set bathrooms
    new_house.querySelector(
        "[name=bathrooms]"
    ).textContent = house.Bathrooms;

    // Set tube time
    new_house.querySelector(
        "[name=tube_time]"
    ).textContent = house.Tube_time;

    // Set bike time
    new_house.querySelector(
        "[name=bike_time]"
    ).textContent = house.Bike_time;

    // Set distance
    new_house.querySelector(
        "[name=distance]"
    ).textContent = house.Distance;

    // Set house_id to identify house card
    new_house.querySelector(
        "[class=house]"
    ).id = (house.ID);

    // Edit button

    // Set house_id to identify edit button
    new_house.querySelector(
        "[name=house_id]"
    ).id = (house.ID);

    // Create edit button
    const new_edit_button = new_house.querySelector("[id=edit-button]");

    // Populate editor if edit button pressed
    new_edit_button.onclick = function () {
        // Get house ID to edit
        selected_house = new_edit_button.querySelector(
            "[name=house_id]"
        );
        populate_editor(selected_house.id);
    };

    // Create card
    houses.appendChild(new_house);

};

// ___________
// Edit houses
//

// Delete a house given its id
const delete_house = function (id) {

    // Send request
    Ajax.query({
        "type": "delete",
        "id": id
    }).then(
        list_houses() // refresh list
    );
};

// Empty the editor
const empty_edit = function () {

    edit_card.querySelector(
        "[id=address]"
    ).value = "";

    edit_card.querySelector(
        "[id=price]"
    ).value = "";

    edit_card.querySelector(
        "[id=bedrooms]"
    ).value = "";

    edit_card.querySelector(
        "[id=bathrooms]"
    ).value = "";

};

// Populate the editor with current valued
const populate_editor = function (id) {

    modal.style.display = "block"; // show editor modal

    editing = true; // enable editing

    const edit_house = document.getElementById(id); // get card

    selected_house = edit_house.id; // set house editing

    // Set current address
    edit_card.querySelector(
        "[id=address]"
    ).value = edit_house.querySelector(
        "[class=address]"
    ).textContent;

    // Set current price
    edit_card.querySelector(
        "[id=price]"
    ).value = edit_house.querySelector(
        "[name=price]"
    ).textContent;

    // Set current bedrooms
    edit_card.querySelector(
        "[id=bedrooms]"
    ).value = edit_house.querySelector(
        "[name=bedrooms]"
    ).textContent;

    // Set current bathrooms
    edit_card.querySelector(
        "[id=bathrooms]"
    ).value = edit_house.querySelector(
        "[name=bathrooms]"
    ).textContent;
};


const get_formatted_address = function () {

    Ajax.query({
        "type": "format_address",
        "address": address.value
    }).then(function (response_object) {
        edit_card.querySelector(
            "[name=formatted_address]"
        ).textContent = response_object;
    });

};

const get_formatted_work_address = function () {

    Ajax.query({
        "type": "format_work_address",
        "address": work_address.value
    }).then(function (response_object) {
        edit_global_card.querySelector(
            "[name=formatted_work_address]"
        ).textContent = response_object;
    });

};

// Save new values
const save = function () {

    // If was editing a card
    if (editing === true) {

        // Send edit query
        Ajax.query({
            "type": "edit",
            "ID": selected_house,
            "address": address.value,
            "price": price.value,
            "bedrooms": bedrooms.value,
            "bathrooms": bathrooms.value
        });
    } else {
    // If was creating a new card

        // Send add query
        Ajax.query({
            "type": "add",
            "address": address.value,
            "price": price.value,
            "bedrooms": bedrooms.value,
            "bathrooms": bathrooms.value
        });
    }

    modal.style.display = "none"; // hide editor

    editing = false; // disable editor

    list_houses(); // refresh houses list

    empty_edit(); // empty editor
};

list_houses(); // list houses on page load
select.selectedIndex = 0; // set default sort to "Price"