# Profile

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get user profileProfileController#settings


### GET /api/v1/users/:user_id/profile


Returns user profile data, including user id, name, and profile pic.


When requesting the profile for the user accessing the API, the userâs calendar feed URL and LTI user id will be returned as well.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | Array of additional information to include. âlinksâ include the userâs profile links in the response as an array of objects with url and title fields âuser_servicesâ include names and links for the userâs connected services âuuidâ include the userâs uuid in the response Allowed values: links , user_services , uuid |


---

## List avatar optionsProfileController#profile_pics


### GET /api/v1/users/:user_id/avatars


A paginated list of the possible user avatar options that can be set with the user update endpoint. The response will be an array of avatar records. If the âtypeâ field is âattachmentâ, the record will include all the normal attachment json fields; otherwise it will include only the âurlâ and âdisplay_nameâ fields. Additionally, all records will include a âtypeâ field and a âtokenâ field. The following explains each field in more detail


The type of avatar record, for categorization purposes.


The url of the avatar


A unique representation of the avatar record which can be used to set the avatar with the user update endpoint. Note: this is an internal representation and is subject to change without notice. It should be consumed with this api endpoint and used in the user update endpoint, and should not be constructed by the client.


A textual description of the avatar record


the internal id of the attachment


the content-type of the attachment


the filename of the attachment


the size of the attachment


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/1/avatars.json' \
     -H "Authorization: Bearer <token>"
```


#### Example Response:


```
[
  {
    "type":"gravatar",
    "url":"https://secure.gravatar.com/avatar/2284...",
    "token":<opaque_token>,
    "display_name":"gravatar pic"
  },
  {
    "type":"attachment",
    "url":<url to fetch thumbnail of attachment>,
    "token":<opaque_token>,
    "display_name":"profile.jpg",
    "id":12,
    "content-type":"image/jpeg",
    "filename":"profile.jpg",
    "size":32649
  },
  {
    "type":"no_pic",
    "url":"https://<canvas>/images/dotted_pic.png",
    "token":<opaque_token>,
    "display_name":"no pic"
  }
]
```
