# Pages

> Canvas API — Modules & Pages  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Show front pageWikiPagesApiController#show_front_page


### GET /api/v1/courses/:course_id/front_page


### GET /api/v1/groups/:group_id/front_page


Retrieve the content of the front page


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/123/front_page
```


---

## Duplicate pageWikiPagesApiController#duplicate


### POST /api/v1/courses/:course_id/pages/:url_or_id/duplicate


Duplicate a wiki page


#### Example Request:


```
curl -X POST -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/pages/14/duplicate
```


---

## Update/create front pageWikiPagesApiController#update_front_page


### PUT /api/v1/courses/:course_id/front_page


### PUT /api/v1/groups/:group_id/front_page


Update the title or contents of the front page


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| wiki_page[title] |  | string | The title for the new page. NOTE: changing a pageâs title will change its url. The updated url will be returned in the result. |
| wiki_page[body] |  | string | The content for the new page. |
| wiki_page[editing_roles] |  | string | Which user roles are allowed to edit this page. Any combination of these roles is allowed (separated by commas). âteachersâ Allows editing by teachers in the course. âstudentsâ Allows editing by students in the course. âmembersâ For group wikis, allows editing by members of the group. âpublicâ Allows editing by any user. Allowed values: teachers , students , members , public |
| wiki_page[notify_of_update] |  | boolean | Whether participants should be notified when this page changes. |
| wiki_page[published] |  | boolean | Whether the page is published (true) or draft state (false). |


#### Example Request:


```
curl -X PUT -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/front_page \
-d wiki_page[body]=Updated+body+text
```


---

## List pagesWikiPagesApiController#index


### GET /api/v1/courses/:course_id/pages


### GET /api/v1/groups/:group_id/pages


A paginated list of the wiki pages associated with a course or group


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| sort |  | string | Sort results by this field. Allowed values: title , created_at , updated_at |
| order |  | string | The sorting order. Defaults to âascâ. Allowed values: asc , desc |
| search_term |  | string | The partial title of the pages to match and return. |
| published |  | boolean | If true, include only published paqes. If false, exclude published pages. If not present, do not filter on published status. |
| include[] |  | string | âenrollmentsâ: Optionally include the page body with each Page. If this is a block_editor page, returns the block_editor_attributes. Allowed values: body |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/123/pages?sort=title&order=asc
```


---

## Create pageWikiPagesApiController#create


### POST /api/v1/courses/:course_id/pages


### POST /api/v1/groups/:group_id/pages


Create a new wiki page


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| wiki_page[title] | Required | string | The title for the new page. |
| wiki_page[body] |  | string | The content for the new page. |
| wiki_page[editing_roles] |  | string | Which user roles are allowed to edit this page. Any combination of these roles is allowed (separated by commas). âteachersâ Allows editing by teachers in the course. âstudentsâ Allows editing by students in the course. âmembersâ For group wikis, allows editing by members of the group. âpublicâ Allows editing by any user. Allowed values: teachers , students , members , public |
| wiki_page[notify_of_update] |  | boolean | Whether participants should be notified when this page changes. |
| wiki_page[published] |  | boolean | Whether the page is published (true) or draft state (false). |
| wiki_page[front_page] |  | boolean | Set an unhidden page as the front page (if true) |
| wiki_page[publish_at] |  | DateTime | Schedule a future date/time to publish the page. This will have no effect unless the âScheduled Page Publicationâ feature is enabled in the account. If a future date is supplied, the page will be unpublished and wiki_page[published] will be ignored. |


#### Example Request:


```
curl -X POST -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/pages \
-d wiki_page[title]=New+page
-d wiki_page[body]=New+body+text
```


---

## Show pageWikiPagesApiController#show


### GET /api/v1/courses/:course_id/pages/:url_or_id


### GET /api/v1/groups/:group_id/pages/:url_or_id


Retrieve the content of a wiki page


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
     https://<canvas>/api/v1/courses/123/pages/the-page-identifier
```


---

## Update/create pageWikiPagesApiController#update


### PUT /api/v1/courses/:course_id/pages/:url_or_id


### PUT /api/v1/groups/:group_id/pages/:url_or_id


Update the title or contents of a wiki page


NOTE: You cannot specify the ID when creating a page. If you pass a numeric value as the page identifier and that does not represent a page ID that already exists, it will be interpreted as a URL.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| wiki_page[title] |  | string | The title for the new page. NOTE: changing a pageâs title will change its url. The updated url will be returned in the result. |
| wiki_page[body] |  | string | The content for the new page. |
| wiki_page[editing_roles] |  | string | Which user roles are allowed to edit this page. Any combination of these roles is allowed (separated by commas). âteachersâ Allows editing by teachers in the course. âstudentsâ Allows editing by students in the course. âmembersâ For group wikis, allows editing by members of the group. âpublicâ Allows editing by any user. Allowed values: teachers , students , members , public |
| wiki_page[notify_of_update] |  | boolean | Whether participants should be notified when this page changes. |
| wiki_page[published] |  | boolean | Whether the page is published (true) or draft state (false). |
| wiki_page[publish_at] |  | DateTime | Schedule a future date/time to publish the page. This will have no effect unless the âScheduled Page Publicationâ feature is enabled in the account. If a future date is set and the page is already published, it will be unpublished. |
| wiki_page[front_page] |  | boolean | Set an unhidden page as the front page (if true) |


#### Example Request:


```
curl -X PUT -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/pages/the-page-identifier \
-d 'wiki_page[body]=Updated+body+text'
```


---

## Delete pageWikiPagesApiController#destroy


### DELETE /api/v1/courses/:course_id/pages/:url_or_id


### DELETE /api/v1/groups/:group_id/pages/:url_or_id


Delete a wiki page


#### Example Request:


```
curl -X DELETE -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/pages/the-page-identifier
```


---

## List revisionsWikiPagesApiController#revisions


### GET /api/v1/courses/:course_id/pages/:url_or_id/revisions


### GET /api/v1/groups/:group_id/pages/:url_or_id/revisions


A paginated list of the revisions of a page. Callers must have update rights on the page in order to see page history.


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/pages/the-page-identifier/revisions
```


---

## Show revisionWikiPagesApiController#show_revision


### GET /api/v1/courses/:course_id/pages/:url_or_id/revisions/latest


### GET /api/v1/groups/:group_id/pages/:url_or_id/revisions/latest


### GET /api/v1/courses/:course_id/pages/:url_or_id/revisions/:revision_id


### GET /api/v1/groups/:group_id/pages/:url_or_id/revisions/:revision_id


Retrieve the metadata and optionally content of a revision of the page. Note that retrieving historic versions of pages requires edit rights.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| summary |  | boolean | If set, exclude page content from results |


#### Example Request:


```
curl -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/pages/the-page-identifier/revisions/latest
```


```
curl -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/pages/the-page-identifier/revisions/4
```


---

## Revert to revisionWikiPagesApiController#revert


### POST /api/v1/courses/:course_id/pages/:url_or_id/revisions/:revision_id


### POST /api/v1/groups/:group_id/pages/:url_or_id/revisions/:revision_id


Revert a page to a prior revision.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| revision_id | Required | integer | The revision to revert to (use the List Revisions API to see available revisions) |


#### Example Request:


```
curl -X POST -H 'Authorization: Bearer <token>' \
https://<canvas>/api/v1/courses/123/pages/the-page-identifier/revisions/6
```
