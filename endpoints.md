# Endpoints

| Name           | Method   | Path                                      | Description                                                             | Authenticated? |
| -------------- | -------- | ----------------------------------------- | ----------------------------------------------------------------------- | -------------- |
| Register       | `POST`   | `/auth`                                   | Adds a new user to the database                                         | No             |
| Login          | `POST`   | `/auth/login`                             | Creates a session on the server                                         | No             |
| Logout         | `GET`    | `/auth/logout`                            | Deletes a user's session on the server                                  | Yes            |
| Get User       | `GET`    | `/:alias`                                 | Returns data for specified user                                         | No             |
| Edit User      | `PATCH`  | `/:alias`                                 | Updates user object in the database                                     | Yes            |
| Delete User    | `DELETE` | `/:alias`                                 | Deletes specified user from the database                                | Yes            |
| Get Story      | `GET`    | `/:alias/story/:lastkey/:numresults`      | Gets all statuses created by the specified user                         | No             |
| Get Feed       | `GET`    | `/:alias/feed/:lastkey/:numresults`       | Gets all statuses from the users that the specified user is following   | No             |
| Follow         | `POST`   | `/friends`                                | Adds a user to the list of the users the current user is following      | Yes            |
| Unfollow       | `DELETE` | `/friends`                                | Removes a user from the list of the users the current user is following | Yes            |
| List Following | `GET`    | `/friends/following/:lastkey/:numresults` | Returns a list of users that the current user is following              | No             |
| List Followers | `GET`    | `/friends/followers/:lastkey/:numresults` | Returns a list of users that are following the current user             | No             |
| Add Status     | `POST`   | `/status`                                 | Adds a status from the current user to the database                     | Yes            |
| Get Status     | `GET`    | `/status/:id`                             | Returns a single status with the specified ID from the database         | No             |
| Get Hashtag    | `POST`   | `/status/:hashtag/:lastkey/:numresults`   | Returns a list of statuses that contain the specified hashtag           | No             |

# Payloads

| Name           | Method   | Request Headers | Request Body                                | Response Headers | Response Body `200`                          | Response Body `400`      | Response Body `500`      |
| -------------- | -------- | --------------- | ------------------------------------------- | ---------------- | -------------------------------------------- | ------------------------ | ------------------------ |
| Register       | `POST`   | `Content-Type`  | `{ alias, name, hashedPassword, photo }`    | -                | `{ code: 200, message }`                     | `{ code: 400, message }` | `{ code: 500, message }` |
| Login          | `POST`   | `Content-Type`  | `{ alias, hashedPassword }`                 | -                | `{ code: 200, message }`                     | `{ code: 400, message }` | `{ code: 500, message }` |
| Logout         | `GET`    | -               | -                                           | -                | `{ code: 200, message }`                     | `{ code: 400, message }` | `{ code: 500, message }` |
| Get User       | `GET`    | -               | -                                           | `Content-Type`   | `{ code: 200, message, user: User }`         | `{ code: 400, message }` | `{ code: 500, message }` |
| Edit User      | `PATCH`  | `Content-Type`  | `User Object`                               | `Content-Type`   | `{ code: 200, message, user: User }`         | `{ code: 400, message }` | `{ code: 500, message }` |
| Delete User    | `DELETE` | -               | -                                           | -                | `{ code: 200, message }`                     | `{ code: 400, message }` | `{ code: 500, message }` |
| Get Story      | `GET`    | -               | -                                           | `Content-Type`   | `{ code: 200, message, statuses: Status[] }` | `{ code: 400, message }` | `{ code: 500, message }` |
| Get Feed       | `GET`    | -               | -                                           | `Content-Type`   | `{ code: 200, message, statuses: Status[] }` | `{ code: 400, message }` | `{ code: 500, message }` |
| Follow         | `POST`   | `Content-Type`  | `{ alias }`                                 | `Content-Type`   | `{ code: 200, message, users: User[] }`      | `{ code: 400, message }` | `{ code: 500, message }` |
| Unfollow       | `POST`   | `Content-Type`  | `{ alias }`                                 | `Content-Type`   | `{ code: 200, message, users: User[] }`      | `{ code: 400, message }` | `{ code: 500, message }` |
| List Following | `GET`    | -               | -                                           | `Content-Type`   | `{ code: 200, message, users: User[] }`      | `{ code: 400, message }` | `{ code: 500, message }` |
| List Followers | `GET`    | -               | -                                           | `Content-Type`   | `{ code: 200, message, users: User[] }`      | `{ code: 400, message }` | `{ code: 500, message }` |
| Add Status     | `POST`   | `Content-Type`  | `Status Object`                             | -                | `{ code: 200, message }`                     | `{ code: 400, message }` | `{ code: 500, message }` |
| Get Status     | `GET`    | -               | -                                           | `Content-Type`   | `{ code: 200, message, status: Status }`     | `{ code: 400, message }` | `{ code: 500, message }` |
| Get Hashtag    | `POST`   | -               | -                                           | `Content-Type`   | `{ code: 200, message, statuses: Status[] }` | `{ code: 400, message }` | `{ code: 500, message }` |
