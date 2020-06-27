# Technical Assessment
NOTE: The majority of the work for this position will be using JS with ES6 syntax.
## Overview
Please complete this exercise with node.js and ES6. This exercise is intended to take no longer than 4 hours.  Please limit the detail of your solution with that time in mind.  Please include a README with your submission detailing your solution.

For example, 
```
Do the endpoints need to be secured?  I assumed not for this exercise but would suggest adding authorization in the future.
```
## Problem
Lets assume Cascade Fintech has contracted you to build a small **RESTful API** to support their new user tracking software.  

Data does not need to be persisted between server restarts. 

## Data definition

### User
- email
  - string - x
  - This field is required to create a new user - x
  - The system must only allow 1 user per unique email address - x
- password
  - string - x
  - This field is required to create a new user - x
- phone number 
  - number
  - This field is required to create a new user - x
  - When provided, the phone number must follow this pattern ########## - x
### Event
- type
  - This field is required to create a new event
  - The value can be any non-empty string
 
## Data examples

The following input json would create a user
```json
{
  "email": "tester@cascadefintech.com",
  "password": "VegansRule",
  "phone": "3332221111"
}
```
___
The following input json would create an event with the type LOGIN
```json
{
  "type": "LOGIN"
}
```
___

The following use cases should be satisfied to get user event data
- return all failed login events for all users - x
- return all login events for a single user - x
- return all events for the day before last - x
- return all events for the week before not including session timeout

The json data returned should at least have the following elements
```json
[
  {
    "type": "LOGIN",
    "created: 47239847298347
  }
]
```
where `created` is the date the event was created.  Choose the format that works best. 
___

## Submission
Choose one of the following
- Come back to this repository and submit a pull request of your solution.
