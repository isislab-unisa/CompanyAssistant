## Get dei paramentri necessari alla configurazione di un account
```
GET /api/v1/providers/getAllParameters
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Creare un account
```
PUT /api/v1/providers/create
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |


### Corpo della richiesta

Il corpo della richiesta varia in base ai parametri di ogni Cloud Provider. I Parametri necessari per completare la richiesta si possono ottenere essettuando una get di tutti i parametri necessari


## Modificare un account
```
PUT /api/v1/providers/edit/[name]
```
### Parametri URI
**name:** nome dell' account

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |


### Corpo della richiesta

Il corpo della richiesta varia in base ai parametri di ogni Cloud Provider. I Parametri necessari per completare la richiesta si possono ottenere essettuando una get di tutti i parametri necessari

## Verificare se un account esiste
```
GET /api/v1/providers/exist/[name]
```

### Parametri URI
**name:** nome dell' account

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Cancellare un account
```
DELETE /api/v1/providers/delete/[name]
```
### Parametri URI
**name:** nome dell' account


### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Verificare se un account è online
```
GET /api/v1/providers/checkStatus/[name]
```
### Parametri URI
**name:** nome dell' account

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Get di tutti gli account
```
GET /api/v1/providers/getAll
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |

## Get dei nomi di tutti gli account
```
GET /api/v1/providers/getAllNames
```

### Autenticazione
Gli argomenti seguenti sono obbligatori:

| Nome           | Descrizione                                                |
| :------------- | ---------------------------------------------------------- |
| Authorization: | Obbligatorio. Impostare un Bearer token di accesso valido. |