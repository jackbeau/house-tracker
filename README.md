# Housing Comparison Tool - 2021 Computing Coursework

## Brief
The objective was to make a tool to compare housing options. After entering the address of a property as well as additional information such as the price, number of bedrooms and bathrooms, the Google Maps API is used to calculate the actual address, travel times and distance from a specific location (such as where the user works), making it easier to sort through housing options.

Users can also easily sort through the properties by price, bedroom and bathroom number, distance and travel times.

## Coding
The code was separated in two parts with the frontend and the backend.

The backend was split into 3 modules. One module was responsible for storing the list of homes and for interacting with the houses. For instance it contained the functions to add, edit or remove houses. The second module contained the functions to connect to the Google API through http POST requests embedded in Promises. Both of these modules were entirely written in functional programming style making use of purity. The last module was the handler for the server, allowing the interaction between the client and the backend.

Meanwhile the frontend javascript files interacted between the server and the UI, listing the houses, and setting up the interaction for the buttons.

## UX/UI
The UI was designed to be as simple as possible. The editor panel allows users to easily add houses and also change the general settings such as the work address to calculate metrics from. A popup was used for the editor to hide it when not needed. The same popup was used to both edit and add houses to simplify the user experience.

A refresh button at the top allows the user to easily refresh the view and calculate the metrics once again, whilst the sort selector allows for an effortless sorting experience.

The color scheme was kept simple and consistent, all buttons were grouped in a banner for simplicity and rounded corners were used to make the UI more appealing.

CSS animations were also added to the popup to enhance the user experience.

## Data
Houses are stored as objects within a list on the server side. When the user adds or edits a house, an ajax request is sent to the server to update the list of houses. A second function on the server is then called to calculate the metrics with the Google API before updating the house's object once again and sending that back to the client where it can be displayed.

Currently, no sessions are setup so all users would see the same list of houses, but in a proper implementation sessions would be used to make sure each user had a separate experience.

## Debugging
Bugs would commonly occur. I found the best solution was to often place console.log() calls at certain locations to find where the code was failing, I would then use breakpoints to see the value of each variable at every stage and determine the issue. If that failed I would add a debugger; line to the code and would then run each line of code manually in the debugging console to get a better understanding of what was going wrong.

When it came to writing the test functions, I decided to write them for the parts of my code that would fail the most often, that being adding and editing houses.

One of the issues I got was handling error codes from the Google API which would cause my entire code to crash if no travel time could be calculated. Once having identified where this issue originated from, I added a try and catch error function to better handle these errors.

## Best Practice
I found that using a consistent naming scheme for variables makes code far easier to troubleshoot and understand. Although annoying to write, comments to make it simple to go back the next day and remember what every line of code did. Formatting my code and splitting it into sections (notably the css) also made it more readable and easier to debug.

Sometimes, functions would get quite confusing, so I would make a brief flowchart of the function I was planning on writing to get a full understanding of it and better plan its implementation.
