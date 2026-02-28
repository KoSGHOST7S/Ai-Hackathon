# Temporary Enrollment Pairings

> Canvas API — Miscellaneous  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List temporary enrollment pairingsTemporaryEnrollmentPairingsApiController#index


### GET /api/v1/accounts/:account_id/temporary_enrollment_pairings


Returns the list of temporary enrollment pairings for a root account.


---

## Get a single temporary enrollment pairingTemporaryEnrollmentPairingsApiController#show


### GET /api/v1/accounts/:account_id/temporary_enrollment_pairings/:id


Returns the temporary enrollment pairing with the given id.


---

## New TemporaryEnrollmentPairingTemporaryEnrollmentPairingsApiController#new


### GET /api/v1/accounts/:account_id/temporary_enrollment_pairings/new


Initialize an unsaved Temporary Enrollment Pairing.


---

## Create Temporary Enrollment PairingTemporaryEnrollmentPairingsApiController#create


### POST /api/v1/accounts/:account_id/temporary_enrollment_pairings


Create a Temporary Enrollment Pairing.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| workflow_state |  | string | The workflow state of the temporary enrollment pairing. |
| ending_enrollment_state |  | string | The ending enrollment state to be given to each associated enrollment when the enrollment period has been reached. Defaults to âdeletedâ if no value is given. Accepted values are âdeletedâ, âcompletedâ, and âinactiveâ. Allowed values: deleted , completed , inactive |


---

## Delete Temporary Enrollment PairingTemporaryEnrollmentPairingsApiController#destroy


### DELETE /api/v1/accounts/:account_id/temporary_enrollment_pairings/:id


Delete a temporary enrollment pairing
