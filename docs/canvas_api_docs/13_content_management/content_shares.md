# Content Shares

> Canvas API — Content Management  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Create a content shareContentSharesController#create


### POST /api/v1/users/:user_id/content_shares


Share content directly between two or more users


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| receiver_ids | Required | Array | IDs of users to share the content with. |
| content_type | Required | string | Type of content you are sharing. Allowed values: assignment , discussion_topic , page , quiz , module , module_item |
| content_id | Required | integer | The id of the content that you are sharing |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/content_shares \
      -d 'content_type=assignment' \
      -d 'content_id=1' \
      -H 'Authorization: Bearer <token>' \
      -X POST
```


---

## List content sharesContentSharesController#index


### GET /api/v1/users/:user_id/content_shares/sent


### GET /api/v1/users/:user_id/content_shares/received


Return a paginated list of content shares a user has sent or received. Use self as the user_id to retrieve your own content shares. Only linked observers and administrators may view other usersâ content shares.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/content_shares/received'
```


---

## Get unread shares countContentSharesController#unread_count


### GET /api/v1/users/:user_id/content_shares/unread_count


Return the number of content shares a user has received that have not yet been read. Use self as the user_id to retrieve your own content shares. Only linked observers and administrators may view other usersâ content shares.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/content_shares/unread_count'
```


---

## Get content shareContentSharesController#show


### GET /api/v1/users/:user_id/content_shares/:id


Return information about a single content share. You may use self as the user_id to retrieve your own content share.


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/self/content_shares/123'
```


---

## Remove content shareContentSharesController#destroy


### DELETE /api/v1/users/:user_id/content_shares/:id


Remove a content share from your list. Use self as the user_id. Note that this endpoint does not delete other usersâ copies of the content share.


#### Example Request:


```
curl -X DELETE 'https://<canvas>/api/v1/users/self/content_shares/123'
```


---

## Add users to content shareContentSharesController#add_users


### POST /api/v1/users/:user_id/content_shares/:id/add_users


Send a previously created content share to additional users


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| receiver_ids |  | Array | IDs of users to share the content with. |


#### Example Request:


```
curl -X POST 'https://<canvas>/api/v1/users/self/content_shares/123/add_users?receiver_ids[]=789'
```


---

## Update a content shareContentSharesController#update


### PUT /api/v1/users/:user_id/content_shares/:id


Mark a content share read or unread


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| read_state |  | string | Read state for the content share Allowed values: read , unread |


#### Example Request:


```
curl -X PUT 'https://<canvas>/api/v1/users/self/content_shares/123?read_state=read'
```
