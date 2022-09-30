## Creare un nuovo utente

```
PUT /api/v1/users/create
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

### Corpo della richiesta

| Nome     | Tipo   | Descrizione                      |
| :------- | ------ | -------------------------------- |
| username | String | L'username dell'utente           |
| password | String | La password associata all'utente |
| lastname | String | Il cognome dell'utente           |
| name     | String | Il nome dell'utente              |
| role     | String | Il ruolo associato all'utente    |


## Cancellare un utente

```
DELETE /api/v1/users/get/[username]
```
### Parametri URI
**username:** l'usernmae dell'utente

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |


## Cancellare un utende da un gruppo

```
DELETE /api/v1/users/deleteSingleGroup/[username]
```
### Parametri URI
**username:** l'usernmae dell'utente

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

### Corpo della richiesta

| Nome     | Tipo   | Descrizione            |
| :------- | ------ | ---------------------- |
| username | String | L'username dell'utente |
| group    | String | Il nome del gruppo     |



## Get di tutti gli utenti

```
GET /api/v1/users/getAll
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Verificare se un utente esiste

```
GET /api/v1/users/exist/[username]
```
### Parametri URI
**username:** l'usernmae dell'utente

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Get del ruolo dell'utente che ha effettuato l'accesso

```
GET /api/v1/users/role/
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |