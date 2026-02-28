# Proficiency Ratings

> Canvas API — Outcomes & Competencies  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create/update proficiency ratingsOutcomeProficiencyApiController#create


### POST /api/v1/accounts/:account_id/outcome_proficiency


### POST /api/v1/courses/:course_id/outcome_proficiency


Create or update account-level proficiency ratings. These ratings will apply to all sub-accounts, unless they have their own account-level proficiency ratings defined.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| ratings[][description] |  | string | The description of the rating level. |
| ratings[][points] |  | integer | The non-negative number of points of the rating level. Points across ratings should be strictly decreasing in value. |
| ratings[][mastery] |  | integer | Indicates the rating level where mastery is first achieved. Only one rating in a proficiency should be marked for mastery. |
| ratings[][color] |  | integer | The color associated with the rating level. Should be a hex color code like â00FFFFâ. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/accounts/<account_id>/outcome_proficiency' \
     -X POST \
     -F 'ratings[][description]=Exceeds Mastery' \
     -F 'ratings[][points]=4' \
     -F 'ratings[][color]=02672D' \
     -F 'ratings[][mastery]=false' \
     -F 'ratings[][description]=Mastery' \
     -F 'ratings[][points]=3' \
     -F 'ratings[][color]=03893D' \
     -F 'ratings[][mastery]=true' \
     -F 'ratings[][description]=Near Mastery' \
     -F 'ratings[][points]=2' \
     -F 'ratings[][color]=FAB901' \
     -F 'ratings[][mastery]=false' \
     -F 'ratings[][description]=Below Mastery' \
     -F 'ratings[][points]=1' \
     -F 'ratings[][color]=FD5D10' \
     -F 'ratings[][mastery]=false' \
     -F 'ratings[][description]=Well Below Mastery' \
     -F 'ratings[][points]=0' \
     -F 'ratings[][color]=E62429' \
     -F 'ratings[][mastery]=false' \
     -H "Authorization: Bearer <token>"
```


---

## Get proficiency ratingsOutcomeProficiencyApiController#show


### GET /api/v1/accounts/:account_id/outcome_proficiency


### GET /api/v1/courses/:course_id/outcome_proficiency


Get account-level proficiency ratings. If not defined for this account, it will return proficiency ratings for the nearest super-account with ratings defined. Will return 404 if none found.


```
Examples:
  curl https://<canvas>/api/v1/accounts/<account_id>/outcome_proficiency \
      -H 'Authorization: Bearer <token>'

```
