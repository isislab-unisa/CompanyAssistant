## Creare un gruppo
```
PUT /api/v1/groups/create/[name]
```
### Parametri URI
**name:** nome del gruppo

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |


### Corpo della richiesta

| Nome  | Tipo          | Descrizione                                                       |
| :---- | ------------- | ----------------------------------------------------------------- |
| tags  | Array(String) | Un array di stringhe contenente i tags da associare al gruppo     |
| users | Array(String) | Un array di stringhe contenente gli utenti da associare al gruppo |


## Cancellare un gruppo
```
DELETE /api/v1/groups/create/[name]
```
### Parametri URI
**name:** nome del gruppo

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Get di tutti i gruppi
```
GET /api/v1/groups/getAll
```
### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |



## Set dei tags appartenenti ad un gruppo

```
PATCH /api/v1/groups/setTags/[name]
```
### Parametri URI
**name:** nome del gruppo

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |


### Corpo della richiesta

| Nome  | Tipo          | Descrizione                                                       |
| :---- | ------------- | ----------------------------------------------------------------- |
| tags  | Array(String) | Un array di stringhe contenente i tags da associare al gruppo     |


## Verifivcare se un gruppo esiste

```
GET /api/v1/groups/exist/[name]
```
### Parametri URI
**name:** nome del gruppo

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

