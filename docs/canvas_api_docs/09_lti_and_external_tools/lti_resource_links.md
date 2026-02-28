# Lti Resource Links

> Canvas API — LTI & External Tools  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List LTI Resource LinksLti::ResourceLinksController#index


### GET /api/v1/courses/:course_id/lti_resource_links


Returns all Resource Links in the specified course. This includes links that are associated with Assignments, Module Items, Collaborations, and that are embedded in rich content. This endpoint is paginated, and will return 50 links per page by default. Links are sorted by the order in which they were created.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include_deleted |  | boolean | Include deleted resource links and links associated with deleted content in response. Default is false. |
| per_page |  | integer | The number of registrations to return per page. Defaults to 50. |


#### Example Request:


```
This would return the first 50 LTI resource links for the course, with a Link header pointing to the next page
curl -X GET 'https://<canvas>/api/v1/courses/1/lti_resource_links' \
    -H "Authorization: Bearer <token>" \
```


---

## Show an LTI Resource LinkLti::ResourceLinksController#show


### GET /api/v1/courses/:course_id/lti_resource_links/:id


Return details about the specified resource link. The ID can be in the standard Canvas format (â1â), or in these special formats:

- resource_link_uuid:<uuid> - Find the resource link by its resource_link_uuid
- lookup_uuid:<uuid> - Find the resource link by its lookup_uuid


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include_deleted |  | boolean | Include deleted resource links in search. Default is false. |


#### Example Request:


```
This would return the specified LTI resource link
curl -X GET 'https://<canvas>/api/v1/courses/1/lti_resource_links/lookup_uuid:c522554a-d4be-49ef-b163-9c87fdc6ad6f' \
    -H "Authorization: Bearer <token>"
```


---

## Create an LTI Resource LinkLti::ResourceLinksController#create


### POST /api/v1/courses/:course_id/lti_resource_links


Create a new LTI Resource Link in the specified course with the provided parameters.


Caution! Resource Links are usually created by the tool via LTI Deep Linking. The tool has no knowledge of links created via this API, and may not be able to handle or launch them.


Links created using this API cannot be associated with a specific piece of Canvas content, like an Assignment, Module Item, or Collaboration. Links created using this API are only suitable for embedding in rich content using the canvas_launch_url provided in the API response.


This link will be associated with the ContextExternalTool available in this context that matches the provided url. If a matching tool is not found, the link will not be created and this will return an error.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| url | Required | string | The launch URL for this resource link. |
| title |  | string | The title of the resource link. |
| custom |  | Hash | Custom parameters to be sent to the tool when launching this link. |


#### Example Request:


```
This would create a new LTI resource link in the specified course
curl -X POST 'https://<canvas>/api/v1/courses/1/lti_resource_links' \
    -H "Authorization: Bearer <token>" \
    -d 'url=https://example.com/lti/launch/new_content_item/456' \
    -d 'title=New Content Item' \
    -d 'custom[hello]=world' \
```


---

## Bulk Create LTI Resource LinksLti::ResourceLinksController#bulk_create


### POST /api/v1/courses/:course_id/lti_resource_links/bulk


Create up to 100 new LTI Resource Links in the specified course with the provided parameters.


Caution! Resource Links are usually created by the tool via LTI Deep Linking. The tool has no knowledge of links created via this API, and may not be able to handle or launch them.


Links created using this API cannot be associated with a specific piece of Canvas content, like an Assignment, Module Item, or Collaboration. Links created using this API are only suitable for embedding in rich content using the canvas_launch_url provided in the API response.


Each link will be associated with the ContextExternalTool available in this context that matches the provided url. If a matching tool is not found, or any parameters are invalid, no links will be created and this will return an error.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| POST |  | string | body [Required, Array] The POST body should be a JSON array of objects containing the parameters for each link to create. |
| []url | Required | string | Each object must contain a launch URL. |
| []title |  | string | Each object may contain a title. |
| []custom |  | Hash | Custom parameters to be sent to the tool when launching this link. |


#### Example Request:


```
This would create a new LTI resource link in the specified course
curl -X POST 'https://<canvas>/api/v1/courses/1/lti_resource_links/bulk' \
    -H "Authorization: Bearer <token>" \
    --json '[{"url":"https://example.com/lti/launch/new_content_item/456","title":"New Content Item","custom":{"hello":"world"}}]'
```


---

## Update an LTI Resource LinkLti::ResourceLinksController#update


### PUT /api/v1/courses/:course_id/lti_resource_links/:id


Update the specified resource link with the provided parameters.


Caution! Changing existing links may result in launch errors.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| url |  | string | The launch URL for this resource link. Caution! URL must match the URL or domain of the tool associated with this resource link |
| custom |  | Hash | Custom parameters to be sent to the tool when launching this link. Caution! Changing these from what the tool provided could result in errors if the tool doesnât see what itâs expecting. |
| include_deleted |  | boolean | Update link even if it is deleted. Default is false. |
| context_external_tool_id |  | integer | The Canvas identifier for the LTI 1.3 External Tool that the LTI Resource Link was originally installed from. Caution! The resource link url must match the toolâs domain or url. |


#### Example Request:


```
This would update the specified LTI resource link
curl -X PUT 'https://<canvas>/api/v1/courses/1/lti_resource_links/1' \
    -H "Authorization: Bearer <token>" \
    -d 'url=https://example.com/lti/launch/new_content_item/456'
    -d 'custom[hello]=world'
```


---

## Delete an LTI Resource LinkLti::ResourceLinksController#destroy


### DELETE /api/v1/courses/:course_id/lti_resource_links/:id


Delete the specified resource link. The ID can be in the standard Canvas format (â1â), or in these special formats:

- resource_link_uuid:<uuid> - Find the resource link by its resource_link_uuid
- lookup_uuid:<uuid> - Find the resource link by its lookup_uuid


Only links that are not associated with Assignments, Module Items, or Collaborations can be deleted.


#### Example Request:


```
This would return the specified LTI resource link
curl -X DELETE 'https://<canvas>/api/v1/courses/1/lti_resource_links/lookup_uuid:c522554a-d4be-49ef-b163-9c87fdc6ad6f' \
    -H "Authorization: Bearer <token>"
```
