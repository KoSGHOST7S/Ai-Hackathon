# Canvas Career

> Canvas API — AI & Smart Features  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Check if Canvas Career is enabledCareerExperienceController#enabled


### GET /api/v1/career/enabled


Returns whether the root account has Canvas Career (Horizon) enabled in at least one subaccount.


#### Example Request:


```
curl https://<canvas>/api/v1/career/enabled \
  -H 'Authorization: Bearer <token>'
```


#### Example Response:


```
{"enabled": true}
```


---

## Get current and available experiencesCareerExperienceController#experience_summary


### GET /api/v1/career/experience_summary


Returns the current userâs active experience and available experiences they can switch to.


#### Example Request:


```
curl https://<canvas>/api/v1/career/experience_summary \
  -H 'Authorization: Bearer <token>'
```


---

## Switch experienceCareerExperienceController#switch_experience


### POST /api/v1/career/switch_experience


Switch the current userâs active experience to the specified one.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| experience | Required | string | The experience to switch to. Allowed values: academic , career |


#### Example Request:


```
curl -X POST https://<canvas>/api/v1/career/switch_experience \
  -H 'Authorization: Bearer <token>' \
  -d 'experience=academic'
```


---

## Switch roleCareerExperienceController#switch_role


### POST /api/v1/career/switch_role


Switch the current userâs role within the current experience.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| role | Required | string | The role to switch to. Allowed values: learner , learning_provider |


#### Example Request:


```
curl -X POST https://<canvas>/api/v1/career/switch_role \
  -H 'Authorization: Bearer <token>' \
  -d 'role=learner'
```
