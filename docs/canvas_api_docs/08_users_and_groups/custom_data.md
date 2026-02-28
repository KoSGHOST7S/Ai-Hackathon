# Custom Data

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Store custom dataCustomDataController#set_data


### PUT /api/v1/users/:user_id/custom_data(/*scope)


Store arbitrary user data as JSON.


Arbitrary JSON data can be stored for a User. A typical scenario would be an external site/service that registers users in Canvas and wants to capture additional info about them.  The part of the URL that follows /custom_data/ defines the scope of the request, and it reflects the structure of the JSON data to be stored or retrieved.


The value self may be used for user_id to store data associated with the calling user. In order to access another userâs custom data, you must be an account administrator with permission to manage users.


A namespace parameter, ns , is used to prevent custom_data collisions between different apps.  This parameter is required for all custom_data requests.


A request with Content-Type multipart/form-data or Content-Type application/x-www-form-urlencoded can only be used to store strings.


Example PUT with multipart/form-data data:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/telephone' \
  -X PUT \
  -F 'ns=com.my-organization.canvas-app' \
  -F 'data=555-1234' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": "555-1234"
}

```


Subscopes (or, generated scopes) can also be specified by passing values to data [ subscope ].


Example PUT specifying subscopes:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/body/measurements' \
  -X PUT \
  -F 'ns=com.my-organization.canvas-app' \
  -F 'data[waist]=32in' \
  -F 'data[inseam]=34in' \
  -F 'data[chest]=40in' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": {
    "chest": "40in",
    "waist": "32in",
    "inseam": "34in"
  }
}

```


Following such a request, subsets of the stored data to be retrieved directly from a subscope.


Example GET from a generated scope


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/body/measurements/chest' \
  -X GET \
  -F 'ns=com.my-organization.canvas-app' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": "40in"
}

```


If you want to store more than just strings (i.e. numbers, arrays, hashes, true, false, and/or null), you must make a request with Content-Type application/json as in the following example.


Example PUT with JSON data:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data' \
  -H 'Content-Type: application/json' \
  -X PUT \
  -d '{
        "ns": "com.my-organization.canvas-app",
        "data": {
          "a-number": 6.02e23,
          "a-bool": true,
          "a-string": "true",
          "a-hash": {"a": {"b": "ohai"}},
          "an-array": [1, "two", null, false]
        }
      }' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": {
    "a-number": 6.02e+23,
    "a-bool": true,
    "a-string": "true",
    "a-hash": {
      "a": {
        "b": "ohai"
      }
    },
    "an-array": [1, "two", null, false]
  }
}

```


If the data is an Object (as it is in the above example), then subsets of the data can be accessed by including the objectâs (possibly nested) keys in the scope of a GET request.


Example GET with a generated scope:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/a-hash/a/b' \
  -X GET \
  -F 'ns=com.my-organization.canvas-app' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": "ohai"
}

```


On success, this endpoint returns an object containing the data that was stored.


Responds with status code 200 if the scope already contained data, and it was overwritten by the data specified in the request.


Responds with status code 201 if the scope was previously empty, and the data specified in the request was successfully stored there.


Responds with status code 400 if the namespace parameter, ns , is missing or invalid, or if the data parameter is missing.


Responds with status code 409 if the requested scope caused a conflict and data was not stored. This happens when storing data at the requested scope would cause data at an outer scope to be lost.  e.g., if /custom_data was {âfashion_appâ: {âhairâ: âblondeâ}} , but you tried to âPUT /custom_data/fashion_app/hair/style -F data=buzz` , then for the request to succeed,the value of /custom_data/fashion_app/hair would have to become a hash, and its old string value would be lost.  In this situation, an error object is returned with the following format:


```
{
  "message": "write conflict for custom_data hash",
  "conflict_scope": "fashion_app/hair",
  "type_at_conflict": "String",
  "value_at_conflict": "blonde"
}

```


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| ns | Required | string | The namespace under which to store the data.  This should be something other Canvas API apps arenât likely to use, such as a reverse DNS for your organization. |
| data | Required | JSON | The data you want to store for the user, at the specified scope.  If the data is composed of (possibly nested) JSON objects, scopes will be generated for the (nested) keys (see examples). |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/food_app' \
  -X PUT \
  -F 'ns=com.my-organization.canvas-app' \
  -F 'data[weight]=81kg' \
  -F 'data[favorites][meat]=pork belly' \
  -F 'data[favorites][dessert]=pistachio ice cream' \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "data": {
    "weight": "81kg",
    "favorites": {
      "meat": "pork belly",
      "dessert": "pistachio ice cream"
    }
  }
}
```


---

## Load custom dataCustomDataController#get_data


### GET /api/v1/users/:user_id/custom_data(/*scope)


Load custom user data.


Arbitrary JSON data can be stored for a User.  This API call retrieves that data for a (optional) given scope. See Store Custom Data for details and examples.


On success, this endpoint returns an object containing the data that was requested.


Responds with status code 400 if the namespace parameter, ns , is missing or invalid, or if the specified scope does not contain any data.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| ns | Required | string | The namespace from which to retrieve the data.  This should be something other Canvas API apps arenât likely to use, such as a reverse DNS for your organization. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/food_app/favorites/dessert' \
  -X GET \
  -F 'ns=com.my-organization.canvas-app' \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{
  "data": "pistachio ice cream"
}
```


---

## Delete custom dataCustomDataController#delete_data


### DELETE /api/v1/users/:user_id/custom_data(/*scope)


Delete custom user data.


Arbitrary JSON data can be stored for a User.  This API call deletes that data for a given scope.  Without a scope, all custom_data is deleted. See Store Custom Data for details and examples of storage and retrieval.


As an example, weâll store some data, then delete a subset of it.


Example PUT with valid JSON data:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data' \
  -X PUT \
  -F 'ns=com.my-organization.canvas-app' \
  -F 'data[fruit][apple]=so tasty' \
  -F 'data[fruit][kiwi]=a bit sour' \
  -F 'data[veggies][root][onion]=tear-jerking' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": {
    "fruit": {
      "apple": "so tasty",
      "kiwi": "a bit sour"
    },
    "veggies": {
      "root": {
        "onion": "tear-jerking"
      }
    }
  }
}

```


Example DELETE:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/fruit/kiwi' \
  -X DELETE \
  -F 'ns=com.my-organization.canvas-app' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": "a bit sour"
}

```


Example GET following the above DELETE:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data' \
  -X GET \
  -F 'ns=com.my-organization.canvas-app' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": {
    "fruit": {
      "apple": "so tasty"
    },
    "veggies": {
      "root": {
        "onion": "tear-jerking"
      }
    }
  }
}

```


Note that hashes left empty after a DELETE will get removed from the custom_data store. For example, following the previous commands, if we delete /custom_data/veggies/root/onion, then the entire /custom_data/veggies scope will be removed.


Example DELETE that empties a parent scope:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/veggies/root/onion' \
  -X DELETE \
  -F 'ns=com.my-organization.canvas-app' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": "tear-jerking"
}

```


Example GET following the above DELETE:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data' \
  -X GET \
  -F 'ns=com.my-organization.canvas-app' \
  -H 'Authorization: Bearer <token>'

```


Response:


```
{
  "data": {
    "fruit": {
      "apple": "so tasty"
    }
  }
}

```


On success, this endpoint returns an object containing the data that was deleted.


Responds with status code 400 if the namespace parameter, ns , is missing or invalid, or if the specified scope does not contain any data.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| ns | Required | string | The namespace from which to delete the data.  This should be something other Canvas API apps arenât likely to use, such as a reverse DNS for your organization. |


#### Example Request:


```
curl 'https://<canvas>/api/v1/users/<user_id>/custom_data/fruit/kiwi' \
  -X DELETE \
  -F 'ns=com.my-organization.canvas-app' \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
!!!javascript
{
  "data": "a bit sour"
}
```
