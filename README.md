# Graphql-API
A graphql-API for a connected postgresql database.

## Table of Contents
***
1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Deployment](#deployment)

## Installation
***
1. Clone repo
2. Install dependencies
```bash
npm install
```
3. Run the application
```bash
npm run serve
```

## Run application in Docker
***
1. Build image
```bash
docker build . -t graphqlapi
```
2. Run image
```bash
docker run -d -p 3000:3000 -e DB_HOSTNAME='<DatabaseHostName>' -e DB_NAME='<DatabaseName>'-e DB_USER='<DatabaseUsername>' -e DB_PW='<DatabaseUserPassword>' -e DB_PORT='<DatabasePort>' -e API_PORT='<ServicePort>' -e KEYCLOAK_CONFIG='{"clientId":"<ClientName>","bearerOnly":false,"serverUrl":"<KeyCloakAuthURL>","realm":"<RealmName>","credentials":{"secret":"<ClientSecret>"}}' -e KEYCLOAK_ALLUSER_LIST='<ListOfDefinedClientUsers(StringsSeparatedByComma)>'  graphqlapi
```
or (when .env file is created)
```bash
docker run -d -p 3000:3000 --env-file .env graphqlapi
```


## Configuration
***
Configuration is done by setting the environment variables listed below.

| Key             | Description                                 | Type      | Default   | Required   |
| :---            | :---                                        | :---      | :--       | :--        |
| `DB_HOSTNAME`   | Hostname of the postgres db service.        | `string`  | -         | Yes        |
| `DB_NAME`       | Database name of the postgres db.           | `string`  | -         | Yes        |
| `DB_USER`       | Database user of the postgres db.           | `string`  | -         | Yes        |
| `DB_PW`         | Users password of the postgres db.          | `string`  | -         | Yes        |
| `DB_PORT`       | HTTP port number of the postgres db service.| `string`  | -         | Yes        |
| `API_PORT`      | HTTP port number this service will run on.  | `string`  | `3000`    | Yes        |
| `KEYCLOAK_CONFIG`| Keycloak configuration JSON files.         | `string`  | -         | Yes        |
| `KEYCLOAK_ALLUSER_LIST`| List of defined Users for the stated Keycloak client. | `string`  | -   | Yes        |

The environment variables can be written in an .env file.

Examples for KEYCLOAK_CONFIG string and the KEYCLOAK_ALLUSER_LIST are shown below:
```
KEYCLOAK_CONFIG="{"clientId":"test-api","bearerOnly":false,"serverUrl":"https://keycloak-test.apps.osc.fokus.fraunhofer.de/keycloak/auth/","realm":"testProject","credentials":{"secret":"00000000-0000-0000-0000-000000000000"}}"
KEYCLOAK_ALLUSER_LIST="user, admin"
```

## Deployment
***
Deployment should be done using [Docker](https://www.docker.com/) containers.
Changes to the `develop` branch are deployed automatically to server X.
View the `.gitlab-ci.yml` file for details.

Keycloak should be configured with roles and users for the respective client.
[KeyCloak.org](https://www.keycloak.org/docs/latest/getting_started/index.html#creating-a-realm-and-a-user) provides some guidance through the Keycloak configuration.
Take care that 'VALID REDIRECT URIs' has only the value '*'. The same applies to 'Web Origins'. No other URLs have to be set in this configuration view.
