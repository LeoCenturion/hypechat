# Hypechat API
API para la app Hypechat de la materia 75.52 Taller de Programacion 2 de la FIUBA

## Version: 1.0.0

### /login

#### POST
##### Summary:

Valida al usuario que quiere ingresar a la app

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

### /loginFacebook

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
| 400 | Bad login information | [Error](#error) |
| 500 | Server error | [Error](#error) |

### /profile/{userEmail}

#### GET
##### Summary:

Se muestran los datos (sin pws y token) del usuario al cual le corresponde el email del path (poner el mail sin las llaves en los costados).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | path | email del usuario del cual se quiere ver el perfil | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful Request | [userProfile](#userprofile) |
| 400 | email del path no existe. | [Error](#error) |
| 500 | Fallo el servidor | [Error](#error) |

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
| 500 | Fallo el servidor | [Error](#error) |

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

Se muestran todas las organizaciones(sin pws y token) del usuario al cual le corresponde el email del path (poner el mail sin las llaves en los costados).

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| email | path | email del usuario del cual se quiere ver todas las organizaciones | Yes | string |

##### Responses

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | Successful Request | object |
| 400 | email del path no existe. | [Error](#error) |
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

Responde si existe o no una organizacion con ese ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | organizacion id del usuario del cual se quiere ver si es valida | Yes | string |

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

Agregar un usuario a la organizacion

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

Setea un nuevo nombre a la organizacion

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

Setea un nuevo password a la organizacion

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

### Models


#### user

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| token | string | user login token | No |
| name | string | user name | No |
| nickname | string | user nickname | No |
| email | string | null | No |
| photo | string | url de la nueva foto del usuario | No |

#### signUpCredentials

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| psw | string | user password | Yes |
| name | string | user name | No |
| nickname | string | user nickname | No |
| email | string | null | Yes |
| photo | string | url de la nueva foto del usuario | No |

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
| photo | string | url de la nueva foto del usuario | No |

#### Error

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| code | int32 |  | No |
| message | string |  | No |