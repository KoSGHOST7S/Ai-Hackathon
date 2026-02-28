# Progress

> Canvas API — Analytics & Reporting  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Query progressProgressController#show


### GET /api/v1/progress/:id


Return completion and status information about an asynchronous job


---

## Cancel progressProgressController#cancel


### POST /api/v1/progress/:id/cancel


Cancel an asynchronous job associated with a Progress object If you include âmessageâ in the POSTed data, it will be set on the Progress and returned. This is handy to distinguish between cancel and fail for a workflow_state of âfailedâ.
