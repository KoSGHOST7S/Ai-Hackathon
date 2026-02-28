# Bookmarks

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List bookmarksBookmarks::BookmarksController#index


### GET /api/v1/users/self/bookmarks


Returns the paginated list of bookmarks.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/bookmarks' \
     -H 'Authorization: Bearer <token>'
```


---

## Create bookmarkBookmarks::BookmarksController#create


### POST /api/v1/users/self/bookmarks


Creates a bookmark.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The name of the bookmark |
| url |  | string | The url of the bookmark |
| position |  | integer | The position of the bookmark. Defaults to the bottom. |
| data |  | string | The data associated with the bookmark |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/bookmarks' \
     -F 'name=Biology 101' \
     -F 'url=/courses/1' \
     -H 'Authorization: Bearer <token>'
```


---

## Get bookmarkBookmarks::BookmarksController#show


### GET /api/v1/users/self/bookmarks/:id


Returns the details for a bookmark.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/bookmarks/1' \
     -H 'Authorization: Bearer <token>'
```


---

## Update bookmarkBookmarks::BookmarksController#update


### PUT /api/v1/users/self/bookmarks/:id


Updates a bookmark


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| name |  | string | The name of the bookmark |
| url |  | string | The url of the bookmark |
| position |  | integer | The position of the bookmark. Defaults to the bottom. |
| data |  | string | The data associated with the bookmark |


#### Example Request:


```
curl -X PUT 'https://<canvas>/api/v1/users/self/bookmarks/1' \
     -F 'name=Biology 101' \
     -F 'url=/courses/1' \
     -H 'Authorization: Bearer <token>'
```


---

## Delete bookmarkBookmarks::BookmarksController#destroy


### DELETE /api/v1/users/self/bookmarks/:id


Deletes a bookmark


#### Example Request:


```
curl -X DELETE 'https://<canvas>/api/v1/users/self/bookmarks/1' \
     -H 'Authorization: Bearer <token>'
```
