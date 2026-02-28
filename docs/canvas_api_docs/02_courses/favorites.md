# Favorites

> Canvas API — Courses  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List favorite coursesFavoritesController#list_favorite_courses


### GET /api/v1/users/self/favorites/courses


Retrieve the paginated list of favorite courses for the current user. If the user has not chosen any favorites, then a selection of currently enrolled courses will be returned.


See the List courses API for details on accepted include[] parameters.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| exclude_blueprint_courses |  | boolean | When set, only return courses that are not configured as blueprint courses. |


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/favorites/courses \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```


---

## List favorite groupsFavoritesController#list_favorite_groups


### GET /api/v1/users/self/favorites/groups


Retrieve the paginated list of favorite groups for the current user. If the user has not chosen any favorites, then a selection of groups that the user is a member of will be returned.


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/favorites/groups \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```


---

## Add course to favoritesFavoritesController#add_favorite_course


### POST /api/v1/users/self/favorites/courses/:id


Add a course to the current userâs favorites.  If the course is already in the userâs favorites, nothing happens. Canvas for Elementary subject and homeroom courses can be added to favorites, but this has no effect in the UI.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id | Required | string | The ID or SIS ID of the course to add.  The current user must be registered in the course. |


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/favorites/courses/1170 \
  -X POST \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Length: 0'
```


---

## Add group to favoritesFavoritesController#add_favorite_groups


### POST /api/v1/users/self/favorites/groups/:id


Add a group to the current userâs favorites.  If the group is already in the userâs favorites, nothing happens.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id | Required | string | The ID or SIS ID of the group to add.  The current user must be a member of the group. |


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/favorites/group/1170 \
  -X POST \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'Content-Length: 0'
```


---

## Remove course from favoritesFavoritesController#remove_favorite_course


### DELETE /api/v1/users/self/favorites/courses/:id


Remove a course from the current userâs favorites.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id | Required | string | the ID or SIS ID of the course to remove |


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/favorites/courses/1170 \
  -X DELETE \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```


---

## Remove group from favoritesFavoritesController#remove_favorite_groups


### DELETE /api/v1/users/self/favorites/groups/:id


Remove a group from the current userâs favorites.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| id | Required | string | the ID or SIS ID of the group to remove |


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/favorites/groups/1170 \
  -X DELETE \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```


---

## Reset course favoritesFavoritesController#reset_course_favorites


### DELETE /api/v1/users/self/favorites/courses


Reset the current userâs course favorites to the default automatically generated list of enrolled courses


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/favorites/courses \
  -X DELETE \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```


---

## Reset group favoritesFavoritesController#reset_groups_favorites


### DELETE /api/v1/users/self/favorites/groups


Reset the current userâs group favorites to the default automatically generated list of enrolled group


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/favorites/group \
  -X DELETE \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```
