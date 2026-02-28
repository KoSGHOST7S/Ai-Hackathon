# Communication Channels

> Canvas API — Users & Groups  
> Source: https://canvas.instructure.com/doc/api/all_resources.html

---

## List user communication channelsCommunicationChannelsController#index


### GET /api/v1/users/:user_id/communication_channels


Returns a paginated list of communication channels for the specified user, sorted by position.


#### Example Request:


```
curl https://<canvas>/api/v1/users/12345/communication_channels \
     -H 'Authorization: Bearer <token>'
```


---

## Create a communication channelCommunicationChannelsController#create


### POST /api/v1/users/:user_id/communication_channels


Creates a new communication channel for the specified user.


#### Request Parameters:

| Parameter |  | Type | Description |
| --- | --- | --- | --- |
| communication_channel[address] | Required | string | An email address or SMS number. Not required for âpushâ type channels. |
| communication_channel[type] | Required | string | The type of communication channel. In order to enable push notification support, the server must be properly configured (via sns_creds in Vault) to communicate with Amazon Simple Notification Services, and the developer key used to create the access token from this request must have an SNS ARN configured on it. Allowed values: email , sms , push |
| communication_channel[token] |  | string | A registration id, device token, or equivalent token given to an app when registering with a push notification provider. Only valid for âpushâ type channels. |
| skip_confirmation |  | boolean | Only valid for site admins and account admins making requests; If true, the channel is automatically validated and no confirmation email or SMS is sent. Otherwise, the user must respond to a confirmation message to confirm the channel. |


#### Example Request:


```
curl https://<canvas>/api/v1/users/1/communication_channels \
     -H 'Authorization: Bearer <token>' \
     -d 'communication_channel[address]=new@example.com' \
     -d 'communication_channel[type]=email' \
```


---

## Delete a communication channelCommunicationChannelsController#destroy


### DELETE /api/v1/users/:user_id/communication_channels/:id


### DELETE /api/v1/users/:user_id/communication_channels/:type/:address


Delete an existing communication channel.


#### Example Request:


```
curl https://<canvas>/api/v1/users/5/communication_channels/3
     -H 'Authorization: Bearer <token>
     -X DELETE
```


---

## Delete a push notification endpointCommunicationChannelsController#delete_push_token


### DELETE /api/v1/users/self/communication_channels/push


#### Example Request:


```
curl https://<canvas>/api/v1/users/self/communication_channels/push
     -H 'Authorization: Bearer <token>
     -X DELETE
     -d 'push_token=<push_token>'
```
