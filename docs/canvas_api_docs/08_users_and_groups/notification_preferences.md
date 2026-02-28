# Notification Preferences

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List preferencesNotificationPreferencesController#index


### GET /api/v1/users/:user_id/communication_channels/:communication_channel_id/notification_preferences


### GET /api/v1/users/:user_id/communication_channels/:type/:address/notification_preferences


Fetch all preferences for the given communication channel


---

## List of preference categoriesNotificationPreferencesController#category_index


### GET /api/v1/users/:user_id/communication_channels/:communication_channel_id/notification_preference_categories


Fetch all notification preference categories for the given communication channel


---

## Get a preferenceNotificationPreferencesController#show


### GET /api/v1/users/:user_id/communication_channels/:communication_channel_id/notification_preferences/:notification


### GET /api/v1/users/:user_id/communication_channels/:type/:address/notification_preferences/:notification


Fetch the preference for the given notification for the given communication channel


---

## Update a preferenceNotificationPreferencesController#update


### PUT /api/v1/users/self/communication_channels/:communication_channel_id/notification_preferences/:notification


### PUT /api/v1/users/self/communication_channels/:type/:address/notification_preferences/:notification


Change the preference for a single notification for a single communication channel


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| notification_preferences[frequency] | Required | string | The desired frequency for this notification |


---

## Update preferences by categoryNotificationPreferencesController#update_preferences_by_category


### PUT /api/v1/users/self/communication_channels/:communication_channel_id/notification_preference_categories/:category


Change the preferences for multiple notifications based on the category for a single communication channel


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| category |  | string | The name of the category. Must be parameterized (e.g. The category âCourse Contentâ should be âcourse_contentâ) |
| notification_preferences[frequency] | Required | string | The desired frequency for each notification in the category |


---

## Update multiple preferencesNotificationPreferencesController#update_all


### PUT /api/v1/users/self/communication_channels/:communication_channel_id/notification_preferences


### PUT /api/v1/users/self/communication_channels/:type/:address/notification_preferences


Change the preferences for multiple notifications for a single communication channel at once


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| notification_preferences[<X>][frequency] | Required | string | The desired frequency for <X> notification |
