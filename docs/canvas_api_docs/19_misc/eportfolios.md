# Eportfolios

> Canvas API — Miscellaneous  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## Get all ePortfolios for a UserEportfoliosApiController#index


### GET /api/v1/users/:user_id/eportfolios


Get a list of all ePortfolios for the specified user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| include[] |  | string | deleted Include deleted ePortfolios. Only available to admins who can moderate_user_content. Allowed values: deleted |


---

## Get an ePortfolioEportfoliosApiController#show


### GET /api/v1/eportfolios/:id


Get details for a single ePortfolio.


---

## Delete an ePortfolioEportfoliosApiController#delete


### DELETE /api/v1/eportfolios/:id


Mark an ePortfolio as deleted.


---

## Get ePortfolio PagesEportfoliosApiController#pages


### GET /api/v1/eportfolios/:eportfolio_id/pages


Get details for the pages of an ePortfolio


---

## Moderate an ePortfolioEportfoliosApiController#moderate


### PUT /api/v1/eportfolios/:eportfolio_id/moderate


Update the spam_status of an eportfolio. Only available to admins who can moderate_user_content.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| spam_status |  | string | The spam status for the ePortfolio Allowed values: marked_as_spam , marked_as_safe |


---

## Moderate all ePortfolios for a UserEportfoliosApiController#moderate_all


### PUT /api/v1/users/:user_id/eportfolios


Update the spam_status for all active eportfolios of a user. Only available to admins who can moderate_user_content.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| spam_status |  | string | The spam status for all the ePortfolios Allowed values: marked_as_spam , marked_as_safe |


---

## Restore a deleted ePortfolioEportfoliosApiController#restore


### PUT /api/v1/eportfolios/:eportfolio_id/restore


Restore an ePortfolio back to active that was previously deleted. Only available to admins who can moderate_user_content.
