# Migration Issues

> Canvas API — Content Management  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List migration issuesMigrationIssuesController#index


### GET /api/v1/accounts/:account_id/content_migrations/:content_migration_id/migration_issues


### GET /api/v1/courses/:course_id/content_migrations/:content_migration_id/migration_issues


### GET /api/v1/groups/:group_id/content_migrations/:content_migration_id/migration_issues


### GET /api/v1/users/:user_id/content_migrations/:content_migration_id/migration_issues


Returns paginated migration issues


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/content_migrations/<content_migration_id>/migration_issues \
    -H 'Authorization: Bearer <token>'
```


---

## Get a migration issueMigrationIssuesController#show


### GET /api/v1/accounts/:account_id/content_migrations/:content_migration_id/migration_issues/:id


### GET /api/v1/courses/:course_id/content_migrations/:content_migration_id/migration_issues/:id


### GET /api/v1/groups/:group_id/content_migrations/:content_migration_id/migration_issues/:id


### GET /api/v1/users/:user_id/content_migrations/:content_migration_id/migration_issues/:id


Returns data on an individual migration issue


#### Example Request:


```
curl https://<canvas>/api/v1/courses/<course_id>/content_migrations/<content_migration_id>/migration_issues/<id> \
    -H 'Authorization: Bearer <token>'
```


---

## Update a migration issueMigrationIssuesController#update


### PUT /api/v1/accounts/:account_id/content_migrations/:content_migration_id/migration_issues/:id


### PUT /api/v1/courses/:course_id/content_migrations/:content_migration_id/migration_issues/:id


### PUT /api/v1/groups/:group_id/content_migrations/:content_migration_id/migration_issues/:id


### PUT /api/v1/users/:user_id/content_migrations/:content_migration_id/migration_issues/:id


Update the workflow_state of a migration issue


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| workflow_state | Required | string | Set the workflow_state of the issue. Allowed values: active , resolved |


#### Example Request:


```
curl -X PUT https://<canvas>/api/v1/courses/<course_id>/content_migrations/<content_migration_id>/migration_issues/<id> \
     -H 'Authorization: Bearer <token>' \
     -F 'workflow_state=resolved'
```
