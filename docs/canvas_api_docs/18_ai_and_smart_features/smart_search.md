# Smart Search

> Canvas API — AI & Smart Features  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Search course contentSmartSearchController#search


### BETA: This API endpoint is not finalized, and there could be breaking changes before its final release.


### GET /api/v1/courses/:course_id/smartsearch


Find course content using a meaning-based search


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| q | Required | string | The search query |
| filter[] |  | string | Types of objects to search. By default, all supported types are searched. Supported types include pages , assignments , announcements , and discussion_topics . |
| include[] |  | string | Optional information to include with each search result: modules An array of module objects that the search result belongs to. status The published status for all results and the due_date for all assignments. Allowed values: status , modules |
