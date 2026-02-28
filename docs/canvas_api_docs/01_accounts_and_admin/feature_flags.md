# Feature Flags

> Canvas API — Accounts & Admin  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List featuresFeatureFlagsController#index


### GET /api/v1/courses/:course_id/features


### GET /api/v1/accounts/:account_id/features


### GET /api/v1/users/:user_id/features


A paginated list of all features that apply to a given Account, Course, or User.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| hide_inherited_enabled |  | boolean | When true, feature flags that are enabled in a higher context and cannot be overridden will be omitted. |


#### Example Request:


```
curl 'http://<canvas>/api/v1/courses/1/features' \
  -H "Authorization: Bearer <token>"
```


---

## List enabled featuresFeatureFlagsController#enabled_features


### GET /api/v1/courses/:course_id/features/enabled


### GET /api/v1/accounts/:account_id/features/enabled


### GET /api/v1/users/:user_id/features/enabled


A paginated list of all features that are enabled on a given Account, Course, or User. Only the feature names are returned.


#### Example Request:


```
curl 'http://<canvas>/api/v1/courses/1/features/enabled' \
  -H "Authorization: Bearer <token>"
```


#### Example Response:


```
["fancy_wickets", "automatic_essay_grading", "telepathic_navigation"]
```


---

## List environment featuresFeatureFlagsController#environment


### GET /api/v1/features/environment


Return a hash of global feature options that pertain to the Canvas user interface. This is the same information supplied to the web interface as ENV.FEATURES .


#### Example Request:


```
curl 'http://<canvas>/api/v1/features/environment' \
  -H "Authorization: Bearer <token>"
```


#### Example Response:


```
{ "telepathic_navigation": true, "fancy_wickets": true, "automatic_essay_grading": false }
```


---

## Get feature flagFeatureFlagsController#show


### GET /api/v1/courses/:course_id/features/flags/:feature


### GET /api/v1/accounts/:account_id/features/flags/:feature


### GET /api/v1/users/:user_id/features/flags/:feature


Get the feature flag that applies to a given Account, Course, or User. The flag may be defined on the object, or it may be inherited from a parent account. You can look at the context_id and context_type of the returned object to determine which is the case. If these fields are missing, then the object is the global Canvas default.


#### Example Request:


```
curl 'http://<canvas>/api/v1/courses/1/features/flags/fancy_wickets' \
  -H "Authorization: Bearer <token>"
```


---

## Set feature flagFeatureFlagsController#update


### PUT /api/v1/courses/:course_id/features/flags/:feature


### PUT /api/v1/accounts/:account_id/features/flags/:feature


### PUT /api/v1/users/:user_id/features/flags/:feature


Set a feature flag for a given Account, Course, or User. This call will fail if a parent account sets a feature flag for the same feature in any state other than âallowedâ.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| state |  | string | âoffâ The feature is not available for the course, user, or account and sub-accounts. âallowedâ (valid only on accounts) The feature is off in the account, but may be enabled in sub-accounts and courses by setting a feature flag on the sub-account or course. âonâ The feature is turned on unconditionally for the user, course, or account and sub-accounts. Allowed values: off , allowed , on |


#### Example Request:


```
curl -X PUT 'http://<canvas>/api/v1/courses/1/features/flags/fancy_wickets' \
  -H "Authorization: Bearer " \
  -F "state=on"
```


---

## Remove feature flagFeatureFlagsController#delete


### DELETE /api/v1/courses/:course_id/features/flags/:feature


### DELETE /api/v1/accounts/:account_id/features/flags/:feature


### DELETE /api/v1/users/:user_id/features/flags/:feature


Remove feature flag for a given Account, Course, or User.  (Note that the flag must be defined on the Account, Course, or User directly.)  The object will then inherit the feature flags from a higher account, if any exist.  If this flag was âonâ or âoffâ, then lower-level account flags that were masked by this one will apply again.


#### Example Request:


```
curl -X DELETE 'http://<canvas>/api/v1/courses/1/features/flags/fancy_wickets' \
  -H "Authorization: Bearer <token>"
```
