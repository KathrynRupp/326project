# 326 Project

## Group Members

| Name           | GitHub Username  |
| -------------- | ---------------- |
| Kathryn Rupp   | KathrynRupp      |
| Nathan Ho      | nathanho06092006 |
| Anika Mukka    | anika-mukka      |
| Xuan Thien Bui | thien952006      |

Working Agreement:

## Working Agreement:

- Day-to-day communication: iMessage group chat and school emails, mostly concentrated on Mondays and Wednesdays when group members are free
- What "done" means for a PR: A PR is "done" if it passes review from at least one teammate
- Conflict resolution: We plan to resolve disagreements by having a conversation as a group to either choose one option or compromise between them

Project Domain:

## Project Domain:

Our project domain is a borrowing forum for students. In this forum, students can lend and borrow necessary items for their college life such as calculators, textbooks, formal clothing, kitchen supplies, etc. The forum would help students save money by allowing them to have items they only need occasionally instead of purchasing new items with much higher prices. This forum will also encourage students to use their items more reasonably, in order to share useful items with other students in the community. We believe our forum would align with the Computing for the Common Good since it supports college students to have the greatest studying conditions.

## Setup:

- Clone the repository to your local machine, and run "npm install" within the terminal within the folder "326 Project"
- Run "npm start" within the terminal to start the server on your machine. This server opens on your machine, with the port 3000.
- You can visit any of the three routes that are currently included:
  - The home page: "http://localhost:3000/"
  - The listings page: "http://localhost:3000/listings"
  - The requests page: "http://localhost:3000/requests"

## Features:

### The Listings Page

The first feature we created was the listings feature. This page is meant to be a forum where people can post the things they want to lend out. You can GET, POST, PUT, and DELETE from the page, meaning you can freely see, add, change, or remove any of the listings on the forum at the moment:

- http://localhost:3000/listings" is where you can see all the listings, status code 200
- Add a new listing with the add button (all fields must be added except the description, which is optional); returns a status code 201 and the updated page with the listing
- Update a listing with the edit button; returns a status code 200 with the updated page with the updated listing
- Delete a listing with the delete button; returns a status code 204 with the updated page without that listing

### The Requests Page

The next feature is very similar to the first, but the major difference is that people are posting to request an item they are seeking out. You can GET, PUT, POST, and DELETE from the page:

- "http://localhost:3000/requests" is where you can see all of the listings, status code 200
- Add a new request with the add button (all fields must be added except the description, which is optional); returns a status code 201 and the updated page with the request
- Update a request with the edit button; returns a status code 200 with the updated page with the request
- Delete a request with the delete button; returns a status code 204 with the updated page without that listing.

## System Diagram

## Design Decisions

### Kathryn Rupp

One design decision I made was to include a validation function in the listingsRepository, in order to validate whether a listing's id is valid or not according to mongoose's standards. Even though this makes it so that there is validation in the repository, it makes it so that the service above it does not have to write/read from the database or make use of Mongoose. I felt that this was better than the alternative because it means mongoose and the database only have to be accessed in one place, and seems like it most strictly conforms to the four-layer architecture that we learned about in class.

### Anika Mukka

One design decision I made was to put validation in requestsService.js instead of putting it only in the controller. The service checks that title and requesterName are present, that category is one of the allowed values, and that neededBy is a real date and throws a 400 error with an error message if any check fails. This was the way we did it in class, so I just followed the same procedure here. The alternative is to do these checks in requestsController.js, where the request body is read. The controller handles the HTTP part of this project, so putting the validation there would mix business rules in with code that deals with req and res. If anything else ever creates a request, the rules would have to be copied, and testing a rule would mean building a fake req and res first. But if the rules are in the service layer, every caller gets them automatically, and a test can just call the function with a bad input and check that it throws an error.

### Nathan Ho

### Xuan Thien Bui
