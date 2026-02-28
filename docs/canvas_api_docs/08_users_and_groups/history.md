# History

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List recent history for a userHistoryController#index


### GET /api/v1/users/:user_id/history


Return a paginated list of the userâs recent history. History entries are returned in descending order, newest to oldest. You may list history entries for yourself (use self as the user_id), for a student you observe, or for a user you manage as an administrator. Note that the per_page pagination argument is not supported and the number of history entries returned per page will vary.
