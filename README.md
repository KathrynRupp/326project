# 326 Project

## Group Members

| Name           | GitHub Username  |
| -------------- | ---------------- |
| Kathryn Rupp   | KathrynRupp      |
| Nathan Ho      | nathanho06092006 |
| Anika Mukka    | anika-mukka      |
| Xuan Thien Bui | thien952006      |

## Working Agreement:

- Day-to-day communication: iMessage group chat and school emails, mostly concentrated on Mondays and Wednesdays when group members are free
- What "done" means for a PR: A PR is "done" if it passes review from at least one teammate
- Conflict resolution: We plan to resolve disagreements by having a conversation as a group to either choose one option or compromise between them

## Project Domain:

Our project domain is a borrowing forum for students. In this forum, students can lend and borrow necessary items for their college life such as calculators, textbooks, formal clothing, kitchen supplies, etc. The forum would help students save money by allowing them to have items they only need occasionally instead of purchasing new items with much higher prices. This forum will also encourage students to use their items more reasonably, in order to share useful items with other students in the community. We believe our forum would align with the Computing for the Common Good since it supports college students to have the greatest studying conditions.

## Setup:

- Clone the repository to your local machine, open up the project folder, and open it with "cd project".
- Install the required dependencies by running "npm install" in the terminal.
- Start MongoDB by running "dc-up mongo" and populate the CSS with "npm run build:css".
- Start the server with "npm start".
- You can visit any of the three routes that are currently included:
  - The home page: "http://localhost:3000/"
  - The health check route: "http://localhost:3000/health"
  - The signup page: "http://localhost:3000/signup"
  - The login page: "http://localhost:3000/login"
  - The listings page: "http://localhost:3000/listings"
  - The requests page: "http://localhost:3000/requests"

## Running the Tests

- Run `npm test` from the "326Project" folder. The tests use mocks, so MongoDB does not need to be running.
- The tests live in the `__tests__/` folder in two files:
  - `listingService.test.js` covers the listings service rules (required fields, whitespace-only input, valid category)
  - `requestService.test.js` covers the requests service rules (required fields, valid category, valid needed-by date)
- Both files replace the repository with `jest.unstable_mockModule`, so the service rules are tested without a real database.

## Features:

### The Listings Page

The first feature we created was the listings feature. This page is meant to be a forum where people can post the things they want to lend out. You can GET, POST, PUT, and DELETE from the page, meaning you can freely see, add, change, or remove any of the listings on the forum at the moment:

- "http://localhost:3000/listings" is where you can see all the listings, status code 200
- Add a new listing with the add button (all fields must be added except the description, which is optional); returns a status code 201 and the updated page with the listing
- Update a listing with the edit button; returns a status code 200 with the updated page with the updated listing
- Delete a listing with the delete button (an HTMX interaction); returns a status code 200 and the listing is removed from the page

### The Requests Page

The next feature is very similar to the first, but the major difference is that people are posting to request an item they are seeking out. You can GET and POST from the page:

- "http://localhost:3000/requests" is where you can see all of the requests, status code 200
- Add a new request with the form (all fields must be added except the description and needed by date, which are optional); returns a status code 201 and the updated page with the request. If something required is missing or invalid, the server returns a 400 error.

## System Diagram

```text
                                                      +-----------------------+
                                                      | server.js             |
                                                      | GET /health (public)  |
                                                      | express-session       |
                                                      | + connect-mongo       |
                                                      +-----------+-----------+
                                                                  |
                                       +--------------------------+--------------------------+-----------------------------------------------------+
                                       |                          |                          |                                                     |
                                       v                          v                          v                                                     v
                           +-----------------------+  +-----------------------+  +-----------------------+  +-----------------------+  +-----------------------+
                           | routes/listings.js    |  | routes/pages.js       |  | routes/requests.js    |  | views/login.ejs       |  | routes/auth.js        |
                           | requireLogin          |  +-----------+-----------+  | requireLogin          |  | views/signup.ejs      |<-| /signup /login        |
                           +-----------+-----------+              |              +-----------+-----------+  +-----------------------+  +-----------+-----------+
                                       |                          |                          |                                                     |
                                       |                          v                          |                                                     |
                                       |              +-----------------------+              |                                                     |
                                       |              | views/home.ejs        |              |                                                     |
                                       |              +-----------+-----------+              |                                                     |
                                       |                          v                          |                                                     |
                                       |              +-----------------------+              |                                                     |
                                       |              | partials/header.ejs   |              |                                                     |
                                       |              +-----------------------+              |                                                     |
                                       |                                                     |                                                     |
                                       v                                                     v                                                     v
                           +-----------------------+  +-----------------------+  +-----------------------+                             +-----------------------+
+-----------------------+  | controllers/          |--| asyncHandler.js       |--| controllers/          |  +-----------------------+  | services/             |
| views/listings.ejs    |<-| listingsController.js |  +-----------------------+  | requestsController.js |->| views/requests.ejs    |  | authService.js        |
+-----------+-----------+  +-----------+-----------+                             +-----------+-----------+  +-----------+-----------+  | bcrypt                |
            v                          |                                                     |                          v              +-----------+-----------+
+-----------------------+              |              +-----------------------+              |              +-----------------------+              |
| public/listings.js    |--------------+------------->| public/style.css      |<-------------+--------------| public/requests.js    |              |
+-----------------------+              v              +-----------------------+              v              +-----------------------+              |
                           +-----------------------+  +-----------------------+  +-----------------------+                                         |
+-----------------------+  | services/             |<-| dtos/listingsDto.js   |  | services/             |  +-----------------------+              |
| __tests__/            |->| listingsService.js    |  +-----------------------+  | requestsService.js    |<-| __tests__/            |              |
| listingService.test.js|  | isOwnerOrAdmin (403)  |                             +-----------+-----------+  | requestService.test.js|              |
+-----------------------+  +-----------+-----------+                                         |              +-----------------------+              |
                                       |                                                     |                                                     |
                                       |                                                     |                                                     |
                                       v                                                     v                                                     v
                           +-----------------------+  +-----------------------+  +-----------------------+                             +-----------------------+
                           | repositories/         |<-| result.js             |  | repositories/         |                             | models/User.js        |
                           | listingsRepository.js |  +-----------------------+  | requestsRepository.js |                             | role: member|admin    |
                           +-----------+-----------+                             +-----------+-----------+                             +-----------+-----------+
                                       |                                                     |                                                     |
                                       |                                                     |                                                     |
                                       v                                                     v                                                     v
                           +-----------------------------------------------------------------------------------------------------------------------------------+
                           | MongoDB (users, sessions, listings, requests)                                                                                     |
                           +-----------------------------------------------------------------------------------------------------------------------------------+
```

## Design Decisions

### Kathryn Rupp

#### Sprint 2

One design decision I made was to include a validation function in the listingsRepository, in order to validate whether a listing's id is valid or not according to mongoose's standards. Even though this makes it so that there is validation in the repository, it makes it so that the service above it does not have to write/read from the database or make use of Mongoose. I felt that this was better than the alternative because it means mongoose and the database only have to be accessed in one place, and seems like it most strictly conforms to the four-layer architecture that we learned about in class.

#### Sprint 3

I followed the unit's approach to creating the HTMX interaction for the delete button in the listings route. An alternative would be what we did before: a click listener in public/listings.js that called fetchJSON with DELETE and then removed the list item from the DOM by hand. I think the HTMX version is better for our app because the delete button now carries its own URL (hx-delete) and confirm test (hx-confirm) as attributes. Since listings.js also builds new cards in the browser, a listing added without a page reload works as soon as htmx.process sees it, and the server-rendered and browser-built cards use the same button markup.

#### Sprint 4

For this sprint, I made the health check route before the express-session middleware and made it return { "status": ok }, to let a user know the app is running without having to be logged in. An alternative would be having a health check route that is able to give more information about what is running, e.g., whether the database is connected. The reason I chose the simple version is because the health check should simply answer whether or not the app is running. Including a database connection check would have made the construction of the route more complex, because it would have to connect to the repository because that is the only place that touches the database. This approach makes it so that the route responds with "ok" even if the database is down.

### Anika Mukka

#### Sprint 2

One design decision I made was to put validation in requestsService.js instead of putting it only in the controller. The service checks that title and requesterName are present, that category is one of the allowed values, and that neededBy is a real date and throws a 400 error with an error message if any check fails. This was the way we did it in class, so I just followed the same procedure here. The alternative is to do these checks in requestsController.js, where the request body is read. The controller handles the HTTP part of this project, so putting the validation there would mix business rules in with code that deals with req and res. If anything else ever creates a request, the rules would have to be copied, and testing a rule would mean building a fake req and res first. But if the rules are in the service layer, every caller gets them automatically, and a test can just call the function with a bad input and check that it throws an error.

#### Sprint 3

My main task was to implement Tailwind to our sprint where I followed unit 15's approach. One decision I made for the Tailwind restyle was to build the repeated patterns with @apply in src/input.css, instead of writing the full list of utility classes on every element. The alternative to this is to repeat the utilities inline everywhere. This would have been much more difficult since listings.js and requests.js build our cards in the browser so every change would have meant editing the same long class strings in the views and in the scripts, and one missed spot would make newly added items look different from the ones the server renders. With the named class (what I implemented) it all lives in one place and the views and the scripts say card. This is better for our project since it is all in src/input.css and stays more organized.

#### Sprint 4
One design decision I made was storing sessions in MongoDB with express-session and connect-mongo. I mainly chose this approach because that is what we learned in Unit 17 but after considering alternatives this still seemed like the best option. An alternative to this method would be the hand-built in-memory session map from the main example. The map is shorter and easier to read, but it lives in the server's memory, so every restart logs every user out, and we restart the server constantly while building. This would also stop working if the app ever ran on more than one server because each one would have its own map. With connect-mongo a session lives in the same database as our listings and requests, so a restart doesn't end it and the browser only holds a signed random id. The cost of doing my method is two extra packages and one more collection in the database.

### Nathan Ho

#### Sprint 2

I followed the units approach without weighing anything. One decision I chose to take was to add a dropdown menu I modified from MDN here: (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select), instead of the standard free-text entry we've been practicing in class.
The error message sent back when I was first testing the program was vague for me, "Your listing was not saved. title, name of lister, and correct category are required." I had assumed that my code was failing somewhere like having a typo, but I just didn't add a valid field for the category.
Adding the field was a bit more work than doing the standard free-text we've done in class, but it makes the program easier to use for people who haven't looked at the code, especially when the said categories aren't listed anywhere within the user interface. It does make it more tedious to go back and add another category every single time you want to incorporate a different category into the code, but I think the programs ease of use with a drop down menu outweighs that, as well as the "other" category is a catch all for categories not listed, so we wouldn't even need to add new categories.

#### Sprint 3

I followed the units approach without weighing anything. I was in charge of doing the mock tests for the listings services.

One decision I made was to trim the whitespace in the service layer instead of doing it within the controller. This ensures that the data being handed to the server is always clean and formatted, as every single input has to go through the service layer, so it makes sense to clean the data within the service, instead of repeatedly trimming the data in the each controller, which would cause a lot of duplicated code. This also ensures that the code passes onto the database will always be properly formatted

#### Sprint 4

One decision I made was to have the authorization checks within the service layer rather than something like the controller. Similar to sprint 3, although it's entirely possible to handle the authorization within the controller, handling it within the service ensures that every single input that reaches the server is clean. The data can come in from multiple places other than the controller, but the one place that it always passes through is the service, so by authorizing it within the service, it ensures that the server always has clean data.

### Xuan Thien Bui

#### Sprint 2

My design decision was to split views into partials. I put the site header and navigation in one file, views/partials/header.ejs, and include it from each page with <%- include('partials/header') %>. The alternative was to paste the header markup directly into listings.ejs, requests.ejs, and home.ejs. However, I think the partial is better because the navigation is defined once.

#### Sprint 3

I was responsible for writing tests for requests services. My design decision was replace the repository with jest.unstable_mockModule, so requestsService run against fake create, findById, and removeById functions. The alternative way was to test against a real MongoDB. I think my way (mocking) is better because the rules tested are all in the services, and none of them needs a database to run. On the other hand, testing against a real MongoDB would need a database setup. This may cause slower tests and a failed test suite for anyone who has not started it.

#### Sprint 4

I was responsible for accessibility audit part. When a listing is deleted with HTMX, the row (and the button that had focus) is removed, so the browser drops keyboard focus to the top of the page. I fixed this in an htmx:beforeSwap handler that moves focus to the next row's Delete button, or the previous rows, or the page heading if the list is now empty, and announce the deletion in a live region. The alternative way is to always send focus to one fixed place after a delete, such as the Listings heading. I think my shipped version is better. Moving to neighbor row is better because a keyboard user clearing out several listings wouldn't have to Tab through eight stops before reaching the list again after every delete.

## Sprint 3 Changes

We did not have to change the repository to use MongoDB because we chose to implement that during Sprint 2. This means each of the /requests and /listings repositories have their own respective MongoDB collection. Additionally, both the listings and requests services have tests (see Running the Tests).

We turned the delete button on the listings page into an HTMX interaction. The shared header and the home, listings, and requests pages are styled with Tailwind utility classes and are responsive. The forms stack in one column on a phone and spread into rows on wider screens.

## Sprint 4 Changes

### Authentication

In order to sign up, navigate to http://localhost:3000/signup and enter your name, email, and password. In order to log in, navigate to http://localhost:3000/login, and enter your email and matching password.

We used session-based authentication with express-session and connect-mongo. We chose it because the session data will live on the server, so the browser only holds a signed httpOnly cookie. Passwords are hashed with bcrypt in authService before they are stored, and only the hash is saved.

### Authorization

For authorization, we decided to make two roles: member and admin. Every account is created with the member role by default, and the signup form cannot set a role.

The authorization rule that you can test is that only the owner of a listing or an admin can edit or delete it. Any other user will get a 403 error. To check this manually, you can (1) log in as user A and create a listing, (2) log out, then log in as a different user B and try to delete it, which fails with a 403, and (3) log in as user A and try again, and see that it succeeds. To check it automatically, run "npm test" in the terminal and verify that there are no errors.

### Accessibility Audit

| Found                                                                             | Fix                                                                                                                                       | How to check                                                                                                              |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Category dropdowns had no accessible name, and text inputs relied on placeholders | Every input and select is wrapped in a label with sr-only text, including the edit form built in listings.js                              | Run an axe or Lighthouse scan: no missing-label errors                                                                    |
| Focus was lost to the top of the page after delete, edit, save, cancel, and add   | Focus moves to the next row's Delete button (or the heading), the first field of the edit form, the row's Edit button, or the title field | Tab to Delete, press Enter, confirm: focus stays on the next row. Press Edit: focus is in the first field. Escape cancels |
| Placeholder text was 3.05:1                                                       | placeholder:text-slate-500 (4.76:1)                                                                                                       | DevTools color picker on a placeholder                                                                                    |
| Primary button and input focus rings were 1.67:1 and 1.33:1                       | Darker ring with an offset (5.86:1)                                                                                                       | Tab to Add Listing: a clear blue ring appears                                                                             |
| Edit and Delete buttons had no context for screen readers                         | aria-label with the item title                                                                                                            | Inspect a button: aria-label is Delete `<title>`                                                                          |

### Health Check Route

GET /health returns { "status": "ok" } with a status 200. The route does not require logging in so anybody can see if the server is healthy. It can be checked manually by visiting http://localhost:3000/health while the server is running and while you are logged out to confirm that the page returns { "status": "ok" } for anybody.
