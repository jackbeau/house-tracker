import house from "../house.js";
import fc from "fast-check";
import property from "./property.js";

const house_keys = fc.constantFrom(
    "Address",
    "Price",
    "Bedrooms",
    "Bathrooms",
    "Distance",
    "Tube_time",
    "Bike_time"
);

const house_list = fc.array(fc.record({
    "ID": fc.integer({min: 0}),
    "Address": fc.string(),
    "Price": fc.string(),
    "Bedrooms": fc.string(),
    "Bathrooms": fc.string(),
    "Distance": fc.string(),
    "Tube_time": fc.string(),
    "Bike_time": fc.string()
}), {minLength: 1});

const new_house_values = fc.record({
    "Address": fc.string(),
    "Price": fc.string(),
    "Bedrooms": fc.string(),
    "Bathrooms": fc.string(),
    "Distance": fc.string(),
    "Tube_time": fc.string(),
    "Bike_time": fc.string()
});

describe("House edition rules", function () {
    property(
        "Editing a value for a specific house must be saved",
        [house_keys, fc.string(), fc.integer()],
        function (key, value, id) {
            let test_house = house.create_template_house([], id);
            test_house = house.set_param(id, test_house)(key, value);
            return test_house[0][key] === value;
        }
    );

    property(
        "Setting a parameter for any house must be saved",
        [house_keys, fc.string(), house_list, fc.float(0, 1)],
        function (key, value, list, rand_i) {

            if (house.check_unique_ID(house_list) !== 0) {
                return true;
            }

            const i = Math.floor(rand_i * list.length);
            const ID = list[i].ID;
            list = house.set_param(ID, list)(key, value);
            return list[list.length - 1][key] === value;
        }
    );

    property(
        "Setting a parameter must not change the number of houses",
        [house_keys, fc.string(), house_list],
        function (key, value, list) {

            if (house.check_unique_ID(list) !== 0) {
                return true;
            }

            const pre_house_num = list.length;
            const i = Math.floor(Math.random() * list.length);
            const ID = list[i].ID;
            list = house.set_param(ID, list)(key, value);

            return list.length === pre_house_num;
        }
    );
});

describe("House creation rules", function () {
    property(
        "When adding a house, any parameters set must be saved",
        [house_list, new_house_values],
        function (list, house_values) {

            const new_ID = house.generate_unique_id(list);
            list = house.create_template_house(list, new_ID);

            if (house.check_unique_ID(list) !== 0) {
                return true;
            }

            const expected_house = {
                "ID": new_ID,
                "Address": house_values.Address,
                "Price": house_values.Price,
                "Bedrooms": house_values.Bedrooms,
                "Bathrooms": house_values.Bathrooms,
                "Distance": house_values.Distance,
                "Tube_time": house_values.Tube_time,
                "Bike_time": house_values.Bike_time
            };

            list = house.save_house(
                new_ID,
                list
            )(
                house_values.Address,
                house_values.Price,
                house_values.Bedrooms,
                house_values.Bathrooms,
                house_values.Distance,
                house_values.Tube_time,
                house_values.Bike_time
            );

            return (JSON.stringify(expected_house) === JSON.stringify(
                list[list.length - 1]
            ));
        }
    );

    property(
        "When adding a house, the total number of houses must increase by 1",
        [house_list],
        function (list) {

            const pre_house_num = list.length;

            const new_ID = house.generate_unique_id(list);
            list = house.create_template_house(list, new_ID);

            if (house.check_unique_ID(list) !== 0) {
                return true;
            }

            return (pre_house_num === list.length - 1);
        }
    );

});


describe("House removal rules", function () {
    property(
        "When deleting a house, the total number of houses must decrease by 1",
        [house_list],
        function (list) {

            const pre_house_num = list.length;

            const i = Math.floor(Math.random() * list.length);
            const ID = list[i].ID;

            if (house.check_unique_ID(list) !== 0) {
                return true;
            }

            list = house.delete_house(list)(ID);

            return (pre_house_num === list.length + 1);
        }
    );

    property(
        "When deleting a house, all other houses in list must be unaffected",
        [house_list, fc.float(0, 1)],
        function (list, rand_i) {

            if (house.check_unique_ID(list) !== 0) {
                return true;
            }

            const pre_house_list = list;
            let i;

            if (list.length === 1) {
                i = 0;
            } else {
                i = Math.floor(rand_i * list.length);
            }
            const ID = list[i].ID;


            pre_house_list.splice(i, 1);

            list = house.delete_house(list)(ID);
            // debugger;

            return (JSON.stringify(pre_house_list) === JSON.stringify(list));
        }
    );

});