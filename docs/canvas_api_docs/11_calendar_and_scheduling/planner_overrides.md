# Planner Overrides

> Canvas API — Calendar & Scheduling  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List planner overridesPlannerOverridesController#index


### GET /api/v1/planner/overrides


Retrieve a planner override for the current user


---

## Show a planner overridePlannerOverridesController#show


### GET /api/v1/planner/overrides/:id


Retrieve a planner override for the current user


---

## Update a planner overridePlannerOverridesController#update


### PUT /api/v1/planner/overrides/:id


Update a planner overrideâs visibilty for the current user


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| marked_complete |  | string | determines whether the planner item is marked as completed |
| dismissed |  | string | determines whether the planner item shows in the opportunities list |


---

## Create a planner overridePlannerOverridesController#create


### POST /api/v1/planner/overrides


Create a planner override for the current user


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| plannable_type | Required | string | Type of the item that you are overriding in the planner Allowed values: announcement , assignment , discussion_topic , quiz , wiki_page , planner_note , calendar_event , assessment_request , sub_assignment |
| plannable_id | Required | integer | ID of the item that you are overriding in the planner |
| marked_complete |  | boolean | If this is true, the item will show in the planner as completed |
| dismissed |  | boolean | If this is true, the item will not show in the opportunities list |


---

## Delete a planner overridePlannerOverridesController#destroy


### DELETE /api/v1/planner/overrides/:id


Delete a planner override for the current user
