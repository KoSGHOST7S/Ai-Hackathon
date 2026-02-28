# Lti Results

> Canvas API — Assignments & Grades  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Show a collection of ResultsLti::Ims::ResultsController#index


### GET /api/lti/courses/:course_id/line_items/:line_item_id/results


Show existing Results of a line item. Can be used to retrieve a specific studentâs result by adding the user_id (defined as the lti_user_id or the Canvas user_id) as a query parameter (i.e. user_id=1000). If user_id is included, it will return only one Result in the collection if the result exists, otherwise it will be empty. May also limit number of results by adding the limit query param (i.e. limit=100)


---

## Show a ResultLti::Ims::ResultsController#show


### GET /api/lti/courses/:course_id/line_items/:line_item_id/results/:id


Show existing Result of a line item.
