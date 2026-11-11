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

- Clone the repository to your local machine, and run "npm install" within the terminal within the folder "326Project"
- Start MongoDB by running "dc-up mongo"
- Run "npm start" within the terminal to start the server on your machine. This server opens on your machine, with the port 3000.
- You can visit any of the three routes that are currently included:
  - The home page: "http://localhost:3000/"
  - The listings page: "http://localhost:3000/listings"
  - The requests page: "http://localhost:3000/requests"

## Running the Tests

- Run `npm test` from the "326Project" folder. The tests use mocks, so MongoDB does not need to be running.
- The tests live in the `__tests__/` folder in two files:
  - `listingsService.test.js` covers the listings service rules (required fields, whitespace-only input, valid category)
  - `requestsService.test.js` covers the requests service rules (required fields, valid category, valid needed-by date)
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
                                                      +------------+
                                      +---------------+ server.js  +----------------+
                                      |               +-----+------+                |
                                      |                     |                       |
                                      v                     v                       v
                           +--------------------+   +-----------------+  +-------------------+
                           | routes/listings.js |   | routes/pages.js |  |routes/requests.js |
                           +----------+---------+   +--------+--------+  +----------+--------+
                                      |                      |                      |
                                      |                 +----v-----+                |
         +----------------+-----------v------------+    |public/   |    +-----------v-----------+------------+
+--------v---------+      |     controllers/       |    | style.css|    |   controllers/        |    +-------v-----------+
|views/listings.ejs|      | listingsController.js  |    +----------+    | requestsController.js |    |views/requests.ejs |
+--------+---------+      +-----------+------------+                    +------------+----------+    +-------+-----------+
         |                            |                                              |                       |
+--------v---------+       +----------v---------+    +--------------+     +----------v---------+      +------v-----------+
|public/listings.js|       |      services/     |    |dtos/         |     |    services/       |      |public/requests.js|
+--------+---------+       | listingsService.js <--+-+listingsDto.js|     | requestsService.js |      +-------+----------+
         |                 +----------+---------+  | +--------------+     +----------+---------+              |
         |                            |            |                                 |                        |
         |               +------------v----------+ |    +---------+       +----------v----------+             |
         |               |     repositories/     | +----+result.js|       |   repositories/     |             |
         |               | listingsRepository.js | |    +---------+       |requestsRepository.js|             |
         |               +-----------------------+ |                      +---------------------+             |
         |                                         |    +----------------------------+                        |
         |                                         +----+tests/listingService.test.js|                        |
         |                                              +----------------------------+                        |
         |                                           +------------------+                                     |
         +------------------------------------------>| public/style.css |<------------------------------------+
                                                     +------------------+
```

## Design Decisions

### Kathryn Rupp

#### Sprint 2

One design decision I made was to include a validation function in the listingsRepository, in order to validate whether a listing's id is valid or not according to mongoose's standards. Even though this makes it so that there is validation in the repository, it makes it so that the service above it does not have to write/read from the database or make use of Mongoose. I felt that this was better than the alternative because it means mongoose and the database only have to be accessed in one place, and seems like it most strictly conforms to the four-layer architecture that we learned about in class.

#### Sprint 3

I followed the unit's approach to creating the HTMX interaction for the delete button in the listings route. An alternative would be what we did before: a click listener in public/listings.js that called fetchJSON with DELETE and then removed the list item from the DOM by hand. I think the HTMX version is better for our app because the delete button now carries its own URL (hx-delete) and confirm test (hx-confirm) as attributes. Since listings.js also builds new cards in the browser, a listing added without a page reload works as soon as htmx.process sees it, and the server-rendered and browser-built cards use the same button markup.

### Anika Mukka

#### Sprint 2

One design decision I made was to put validation in requestsService.js instead of putting it only in the controller. The service checks that title and requesterName are present, that category is one of the allowed values, and that neededBy is a real date and throws a 400 error with an error message if any check fails. This was the way we did it in class, so I just followed the same procedure here. The alternative is to do these checks in requestsController.js, where the request body is read. The controller handles the HTTP part of this project, so putting the validation there would mix business rules in with code that deals with req and res. If anything else ever creates a request, the rules would have to be copied, and testing a rule would mean building a fake req and res first. But if the rules are in the service layer, every caller gets them automatically, and a test can just call the function with a bad input and check that it throws an error.

#### Sprint 3

My main task was to implement Tailwind to our sprint where I followed unit 15's approach. One decision I made for the Tailwind restyle was to build the repeated patterns with @apply in src/input.css, instead of writing the full list of utility classes on every element. The alternative to this is to repeat the utilities inline everywhere. This would have been much more difficult since listings.js and requests.js build our cards in the browser so every change would have meant editing the same long class strings in the views and in the scripts, and one missed spot would make newly added items look different from the ones the server renders. With the named class (what I implemented) it all lives in one place and the views and the scripts say card. This is better for our project since it is all in src/input.css and stays more organized.

### Nathan Ho

#### Sprint 2

I followed the units approach without weighing anything. One decision I chose to take was to add a dropdown menu I modified from MDN here: (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select), instead of the standard free-text entry we've been practicing in class.
The error message sent back when I was first testing the program was vague for me, "Your listing was not saved. title, name of lister, and correct category are required." I had assumed that my code was failing somewhere like having a typo, but I just didn't add a valid field for the category.
Adding the field was a bit more work than doing the standard free-text we've done in class, but it makes the program easier to use for people who haven't looked at the code, especially when the said categories aren't listed anywhere within the user interface. It does make it more tedious to go back and add another category every single time you want to incorporate a different category into the code, but I think the programs ease of use with a drop down menu outweighs that, as well as the "other" category is a catch all for categories not listed, so we wouldn't even need to add new categories.

#### Sprint 3

I followed the units approach without weighing anything. I was in charge of doing the mock tests for the listings services. One decision I made was to change my code back in sprint 2 to incorporate strictly white spaces failing the test as well. I decided to do this, as a plain white space is basically the same as an empty entry.
Although I could've chosen to allow just white spaces, I decided against it, as it doesn't really follow our programs structure well. A strictly white space is giving zero information about the field, so the listing would be less comprehensible. Say you put a listing for an item under the category "other". Without the title, what are you trying to list for other people to borrow? Disallowing the use of white spaces just makes more sense, and allowing it doesn't really provide anything other than giving the user more freedom with their inputs.

### Xuan Thien Bui

#### Sprint 2

My design decision was to split views into partials. I put the site header and navigation in one file, views/partials/header.ejs, and include it from each page with <%- include('partials/header') %>. The alternative was to paste the header markup directly into listings.ejs, requests.ejs, and home.ejs. However, I think the partial is better because the navigation is defined once.
####Sprint 3
I was responsible for writing tests for requests services. My design decision was replace the repository with jest.unstable_mockModule, so requestsService run against fake create, findById, and removeById functions. The alternative way was to test against a real MongoDB. I think my way (mocking) is better because the rules tested are all in the services, and none of them needs a database to run.

## Sprint 3 Changes

We did not have to change the repository to use MongoDB because we chose to implement that during Sprint 2. This means each of the /requests and /listings repositories have their own respective MongoDB collection. Additionally, both the listings and requests services have tests (see Running the Tests).

We turned the delete button on the listings page into an HTMX interaction. The shared header and the home, listings, and requests pages are styled with Tailwind utility classes and are responsive. The forms stack in one column on a phone and spread into rows on wider screens.
