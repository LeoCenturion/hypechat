# Hypechat API
API para la app Hypechat de la materia 75.52 Taller de Programacion 2 de la FIUBA

## Version: 1.0.0

### /login

#### POST
##### Summary:

Validate the user who wants to access the application.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| loginInfo | body |  | Yes | [loginCredentials](#logincredentials) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | [user](#user) |
| 404 | Bad login information | [Error](#error) |
| 500 | Server error | [Error](#error) |

### /signUp

#### POST
##### Summary:

Receives user information through the body and registers it as a new user if it doesn't already exists.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userSignUpData | body |  | Yes | [signUpCredentials](#signupcredentials) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Succesful request | [user](#user) |
| 500 | Server error | [Error](#error) |

### /logFacebook

#### POST
##### Summary:

sends user's facebook token for login.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| facebookToken | body |  | Yes | [facebookLoginCredentials](#facebooklogincredentials) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | [user](#user) |
| 500 | Server error | [Error](#error) |

### /profile/{userEmail}

#### GET
##### Summary:

returns data (without pws and token) of the user to which the route's email corresponds (put the email without the keys on the sides).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | path | email of the user that you want to see the profile. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful Request | [userProfile](#userprofile) |
| 400 | incalid user email | [Error](#error) |
| 500 | Server error | [Error](#error) |

### /profile

#### PUT
##### Summary:

updates information fields (with exception of the token), of the user identified by the token, provided in the body.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userProfile | body |  | No | [user](#user) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | string |
| 500 | Server error | [Error](#error) |

### /password

#### PUT
##### Summary:

updates password of the user identified by the token, provided in the body.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| user | body |  | No | [user](#user) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | string |
| 500 | Fallo el servidor | [Error](#error) |

### /organizations/{userEmail}

#### GET
##### Summary:

returns all the organizations (without pws and token) of the user to whom the route's email corresponds (put the email without the keys on the sides).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | path | email of the user you want to see all organizations. | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful Request | object |
| 400 | invalid user email | [Error](#error) |
| 500 | Server error | [Error](#error) |

### /privateMsj

#### GET
##### Description:

returns all user's private messages in the organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| datos | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid email | [Error](#error) |
| 401 | invalid id organization | [Error](#error) |
| 500 | Server error | [Error](#error) |

### /idOrganizationValid/{organizationID}

#### GET
##### Description:

Answer whether or not there is an organization with that identification

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | organizacion id | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | sucssusful request | object |
| 400 | Invalid Request | object |

### /organization

#### POST
##### Description:

Create a new organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| data | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 500 | Request Invalida! | object |

### /userOrganization

#### POST
##### Description:

Add a user to the organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| datos | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | Request Invalida! | object |
| 401 | Request Invalida! | object |
| 404 | Request Invalida! | object |

### /organization/{token}/{organizationID}

#### GET
##### Description:

returns information of organization with id "{organizationID}"

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | path | user token | Yes | string |
| organizationID | path | organization id | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 404 | Request Invalida! | object |
| 500 | Request Invalida! | object |

### /nameOrganization

#### PUT
##### Description:

updates organization's name

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| datos | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 404 | Request Invalida! | object |
| 500 | Request Invalida! | object |

### /pswOrganization

#### PUT
##### Description:

updates organization's password

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| datos | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | Request Invalida! | object |

### /recoveredPassword

#### GET
##### Summary:

returns a token with which the password can be recovered

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userEmail | body |  | Yes | object |

#### PUT
##### Summary:

updates user's password with the recovered token

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userData | body |  | Yes | object |

### /organization/senderMenssage

#### GET
##### Summary:

returns message without restrected organization words

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| message | body |  | Yes | object |

### organization/restrictedWords/{id}/{token}

#### GET
##### Summary:

returns organization's restricted words

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| OrdanizationID and userToken | path | organization's id and user's token | Yes | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 404 | organization dose not exist | [Error](#error) |
| 406 | user is not organization's member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

#### PUT
##### Summary:

add a new restricted word to the organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| restrictedWords | body |  | Yes | object |
| organizationID and userToken | path | organization's id and user's token | Yes | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 401 | user is not authorized | [Error](#error) |
| 404 | user or organization dose not exist | [Error](#error) |
| 406 | user is not organization's member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

#### DELETE
##### Summary:

delete an organization's restricted word

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| restrictedWord | body |  | Yes | object |
| organizationID and userToken | path | organization's id and user's token | Yes | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 401 | user is not authorized | [Error](#error) |
| 404 | user or organization dose not exist | [Error](#error) |
| 406 | user is not organization's member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /answerQuestions/{userEmail}/{asw1}/{asw2}

#### GET
##### Summary:

returns recover password token if "asw1" and "asw2" are correct

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| asw1, asw2, userEmail | path | answers for secret questions of userEmail | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user email | [Error](#error) |
| 401 | incorrect answers | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /secretQuestions/{userEmail}

#### GET
##### Summary:

returns userEmail's secret questions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userEmail | path |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user email | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /answersQuestions/{token}

#### GET
##### Summary:

returns answers of secret questions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | path | token of user | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /secretQuestios

#### PUT
##### Summary:

returns answers of secret questions

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, question1, question2, answer1, answer2 | body | token of user | Yes | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /location/{token}/{email}

#### GET
##### Summary:

returns to token's user longitude and latitude of email's user

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, email | path | token of user | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /location

#### PUT
##### Summary:

updates user location (longitude and/or latitude)

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, lotitud, longitud | body | longitude and latitude of token's user | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /registration/months/{token}

#### GET
##### Summary:

returns the number of users who registered in the last four months

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token | path |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | [ object ] |
| 400 | invalid token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /registration/year/{token}/{year}

#### GET
##### Summary:

returns the number of users who registered on year "{year}"

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, year | path |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /logout/{token}

#### GET
##### Summary:

updates user token_notifications to ' '

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, year | path |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /organization/user

#### POST
##### Summary:

adds user to organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, idOrganization, email, psw | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 401 | user is organization's member | [Error](#error) |
| 404 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /organization/name

#### PUT
##### Summary:

updates organization name

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, name | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 500 | Server faild | [Error](#error) |

### /organization/password

#### PUT
##### Summary:

updates organization password

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, psw | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 500 | Server faild | [Error](#error) |

### /moderator

#### PUT
##### Summary:

assignates a user as moderator

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, userEmail | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 404 | invalid organization | [Error](#error) |
| 405 | user is moderator | [Error](#error) |
| 406 | user is not member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /revokeModerator

#### PUT
##### Summary:

revokes a user as moderator

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, userEmail | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 404 | invalid organization | [Error](#error) |
| 405 | user is not moderator | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /member/{token}/{id}/{email}

#### DELETE
##### Summary:

revokes a user as moderator

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, OrganizationID, email | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 404 | invalid organization | [Error](#error) |
| 405 | user's email is owner | [Error](#error) |
| 406 | user is not member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /welcomeOrganization

#### PUT
##### Summary:

updates welcome message of organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, welcome | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | welcome message can not be null | [Error](#error) |
| 404 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /photoOrganization

#### PUT
##### Summary:

updates photo of organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, photo | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | photo can not be null | [Error](#error) |
| 404 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /locations/{token}/{id}

#### GET
##### Summary:

returns locations of organization's members

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, photo | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 404 | invalid organization or user token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /moderator/{token}/{id}/{email}

#### GET
##### Summary:

returns status 200 if user email is owner or moderator

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, email | path |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 400 | user is not moderator and user is not owner | [Error](#error) |
| 404 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /organization/restrictedWords/{id}/{token}

#### GET
##### Summary:

returns restricted words of organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id | path |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 404 | invalid user token or organization | [Error](#error) |
| 406 | user is not member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

#### PUT
##### Summary:

adds a restricted word of organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id | path |  | Yes |  |
| restrictedWords | body | restricted word to add | No |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 401 | user has not permission | [Error](#error) |
| 404 | invalid user token or organization | [Error](#error) |
| 406 | user is not member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

#### DELETE
##### Summary:

deletes a restricted word of organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id | path |  | Yes |  |
| restrictedWords | body | restricted word to delete | No |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 401 | user has not permission | [Error](#error) |
| 404 | invalid user token or organization | [Error](#error) |
| 406 | user is not member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /message

#### POST
##### Summary:

returns message without restricted words

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userToken, message, organizationID, channelName | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid user token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /mention

#### POST
##### Summary:

returns array with users's emails that were mentioned

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, message | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 400 | invalid user token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /messages/{token}

#### GET
##### Summary:

returns array with users's emails that were mentioned

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, message | body |  | Yes |  |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | [ object ] |
| 400 | invalid user token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /allOrg

#### GET
##### Summary:

returns array with all organizations

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | [ object ] |
| 500 | Server faild | [Error](#error) |

### /channel

#### POST
##### Summary:

create new channel

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| channel | body |  | No | [Channel](#channel) |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid organization | [Error](#error) |
| 405 | name of channel alredy exist | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /channelValid/{id}/{name}

#### GET
##### Summary:

create new channel

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id, name | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 400 | name of channel alredy exist | [Error](#error) |
| 403 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /channel/users

#### POST
##### Summary:

add user to channel

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, name, mo_email, emails | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 400 | name of channel alredy exist | [Error](#error) |
| 404 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /channel/user

#### POST
##### Summary:

add user to channel

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, name, email | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 400 | name of channel alredy exist | [Error](#error) |
| 403 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /channel/user/{token}/{id}/{name}/{email}

#### DELETE
##### Summary:

delete user from channel

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, name, email | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 400 | email does not exist | [Error](#error) |
| 402 | invalid channel | [Error](#error) |
| 403 | user is not organization's member | [Error](#error) |
| 404 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /privateChannel

#### PUT
##### Summary:

set message privation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, name, private | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid channel | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /privateChannel/{token}/{id}/{name}

#### GET
##### Summary:

updates channel privation

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, name | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid channel | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /description

#### PUT
##### Summary:

updates description of channel

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, name, description | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid channel | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /description/{token}/{id}/{name}

#### GET
##### Summary:

returns desfription of channel "{name}" from organization with id "{id}"

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, name | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid channel | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /welcomeChannel

#### PUT
##### Summary:

updates welcome message of channel

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, organizationID, name, welcome | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid channel | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /welcomeChannel/{token}/{id}/{name}

#### GET
##### Summary:

returns welcome message of channel "{name}" from organization with id "{id}"

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, name | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid channel | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /channel/{token}/{id}/{name}

#### DELETE
##### Summary:

returns welcome message of channel "{name}" from organization with id "{id}"

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, name | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 404 | invalid organization | [Error](#error) |
| 405 | invalid channel | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /channels/user

#### POST
##### Summary:

returns channels that user is member on organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, email | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 400 | invalid user | [Error](#error) |
| 404 | invalid organization | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /channelsAvailable/user

#### POST
##### Summary:

returns channels that user is member on organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, email | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | [ string ] |
| 400 | invalid user | [Error](#error) |
| 404 | invalid organization | [Error](#error) |
| 405 | user is not member | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /channel/mention

#### POST
##### Summary:

returns push notification to user mentioned

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, channel, message | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request |  |
| 400 | invalid user token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /allChannel

#### GET
##### Summary:

returns array with all channels

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | [ object ] |
| 500 | Server faild | [Error](#error) |

### /tito

#### POST
##### Summary:

check if tito was mentioned and tell him the message

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, channel, message | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /privateChats/{token}/{id}

#### GET
##### Summary:

returns user's private message in specific organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /privateChats/{token}

#### GET
##### Summary:

returns user's private message in no organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user token | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /privateChat/{token}/{email}/{id}

#### GET
##### Summary:

returns information of private chat between user token and user email in organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, email, id | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user token | [Error](#error) |
| 404 | user email is not member of organization | [Error](#error) |
| 405 | there is not private chat between users | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /privateChat/{token}/{email}

#### GET
##### Summary:

returns information of private chat between user token and user email in NO organization

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, email | path |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user token | [Error](#error) |
| 404 | user email is not member of organization | [Error](#error) |
| 405 | there is not private chat between users | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /privateChat

#### POST
##### Summary:

creates a private chat

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, email | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user token | [Error](#error) |
| 404 | invalid user email | [Error](#error) |
| 405 | already exist a private chat | [Error](#error) |
| 406 | invalid organization id | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### /privateChat/mention

#### POST
##### Summary:

sends push notification to user mentioned

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| token, id, email, message | body |  | No | object |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful request | object |
| 400 | invalid user token or user email | [Error](#error) |
| 404 | send notification error | [Error](#error) |
| 500 | Server faild | [Error](#error) |

### Models


#### user

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | user login token | No |
| name | string | user name | No |
| nickname | string | user nickname | No |
| email | string | null | No |
| photo | string | url potho | No |

#### signUpCredentials

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| psw | string | user password | Yes |
| name | string | user name | No |
| nickname | string | user nickname | No |
| email | string | null | Yes |
| photo | string | url photo | No |

#### logInCredentials

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string | user email | Yes |
| psw | string | user password | Yes |

#### facebookLogInCredentials

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | user token asigned by facebook api | Yes |

#### userProfile

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | user name | No |
| nickname | string | user nickname | No |
| email | string | null | No |
| photo | string | url photo | No |

#### Channel

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| name | string | channel name | No |
| id | string | id organization where channel was created | No |
| desc | string | description | No |
| owner | string |  | No |
| welcome | string | welcome message | No |

#### Error

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | int32 |  | No |
| message | string |  | No |