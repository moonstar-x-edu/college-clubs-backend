# College Clubs Backend

This is a partial implementation of the API for our final project for Diseño de Sistemas. This repo contains the code of the Express API that will expose certain endpoints notably to get access to our system's main entities.

## Dependency Installation

In order to run this API you'll need to install the required dependencies with:

```text
npm install
```

Or in production with a frozen lock file with:

```text
npm ci
```

## Configuration

You'll need to either set the following environment variables or create a `.env` file with the following:

```text
HTTP_PORT=4000
```

## Running

If in development, you can run the server with reload-on-save with:

```text
npm run dev
```

If in production, you can run the server with:

```text
npm start
```

## Endpoint Documentation

### GET /api/students

Get all the students saved in the students database.

#### Response

```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "name": "Christian",
      "lastName": "Lopez",
      "code": "200613",
      "email": "email@example.com",
      "semester": 5,
      "career": "Computer Science",
      "birthday": "1999-07-29",
      "joinedAt": "2019-08-15",
      "id": "88c3196d-8f9d-4ae3-987e-eff690db50e0"
    },
    {
      "name": "Rai",
      "lastName": "Diaz",
      "code": "313223",
      "email": "email@example.com",
      "semester": 5,
      "career": "Computer Science",
      "birthday": "1999-07-29",
      "joinedAt": "2019-08-15",
      "id": "88c3196d-8f9d-4ae3-987e-eff690db50e0"
    },
  ]
}
```

### POST /api/students

Create a new student in the students database. Requires an `application/json` body with the following properties.

| Property | Type                | Description                                                   |
|----------|---------------------|---------------------------------------------------------------|
| name     | String **Required** | Student's name.                                               |
| lastName | String **Required** | Student's last name.                                          |
| code     | String **Required** | Student's code. Must be of **6** characters in length.        |
| email    | String **Required** | Student's email.                                              |
| semester | Number **Required** | Student's current semester. Must be between **1** and **15**. |
| career   | String **Required** | Student's career.                                             |
| birthday | String **Required** | Student's birthday. Must be **ISO8601 compliant**.            |
| joinedAt | String **Required** | Student's join date. Must be **ISO8601 compliant**.           |

#### Response

```json
{
  "success": true,
  "status": 201,
  "data": {
    "name": "Jose Luis",
    "lastName": "Contreras",
    "code": "124113",
    "email": "email@example.com",
    "semester": 5,
    "career": "Computer Science",
    "birthday": "1999-07-29",
    "joinedAt": "2019-08-15",
    "id": "88c3196d-8f9d-4ae3-987e-eff690db50e0"
  }
}
```

### GET /api/student/:id

Get a particular student from the students database.

#### Response

```json
{
  "success": true,
  "status": 200,
  "data": {
    "name": "Jose Luis",
    "lastName": "Contreras",
    "code": "124113",
    "email": "email@example.com",
    "semester": 5,
    "career": "Computer Science",
    "birthday": "1999-07-29",
    "joinedAt": "2019-08-15",
    "id": "88c3196d-8f9d-4ae3-987e-eff690db50e0"
  }
}
```

### DELETE /api/student/:id

Delete a particular student from the students database.

#### Response

```json
{
  "success": true,
  "status": 200,
  "data": {
    "name": "Jose Luis",
    "lastName": "Contreras",
    "code": "124113",
    "email": "email@example.com",
    "semester": 5,
    "career": "Computer Science",
    "birthday": "1999-07-29",
    "joinedAt": "2019-08-15",
    "id": "88c3196d-8f9d-4ae3-987e-eff690db50e0"
  }
}
```

### PUT /api/student/:id

Update a particular student from the students database. Requires an `application/json` body with the following properties.

| Property | Type   | Description                                                   |
|----------|--------|---------------------------------------------------------------|
| name     | String | Student's name.                                               |
| lastName | String | Student's last name.                                          |
| semester | Number | Student's current semester. Must be between **1** and **15**. |
| career   | String | Student's career.                                             |

> Only add the properties you wish to edit.

#### Response

```json
{
  "success": true,
  "status": 200,
  "data": {
    "name": "Jose Luis",
    "lastName": "Contreras",
    "code": "124113",
    "email": "email@example.com",
    "semester": 5,
    "career": "Computer Science",
    "birthday": "1999-07-29",
    "joinedAt": "2019-08-15",
    "id": "88c3196d-8f9d-4ae3-987e-eff690db50e0"
  }
}
```

### GET /api/clubs

Get all the clubs saved in the clubs database.

#### Response

```json
{
  "success": true,
  "status": 200,
  "data": [
    {
      "name": "New Club Name",
      "description": "My Club",
      "imageURL": "https://example.com/img.jpg",
      "createdAt": "2019-02-03",
      "id": "b49f8d44-2fb4-4d85-be8e-5678f35538d3"
    },
    {
      "name": "Club",
      "description": "My Club",
      "imageURL": "https://example.com/img.jpg",
      "createdAt": "2019-02-03",
      "id": "1794d4b0-4efa-4441-a38d-c238bc40069e"
    }
  ]
}
```

### POST /api/clubs

Create a new club in the clubs database. Requires an `application/json` body with the following properties.

| Property    | Type                | Description                                           |
|-------------|---------------------|-------------------------------------------------------|
| name        | String **Required** | Club's name.                                          |
| description | String              | Club's description. Can be empty or set to `null`.    |
| imageURL    | String **Required** | Club's image URL. Must be a valid URI.                |
| createdAt   | String **Required** | Club's creation date. Must be **ISO8601 compliant**.  |

#### Response

```json
{
  "success": true,
  "status": 201,
  "data": {
    "name": "Club",
    "description": "My Club",
    "imageURL": "https://example.com/img.jpg",
    "createdAt": "2019-02-03",
    "id": "1794d4b0-4efa-4441-a38d-c238bc40069e"
  }
}
```

### GET /api/club/:id

Get a particular club from the clubs database.

#### Response

```json
{
  "success": true,
  "status": 200,
  "data": {
    "name": "Club",
    "description": "My Club",
    "imageURL": "https://example.com/img.jpg",
    "createdAt": "2019-02-03",
    "id": "1ca625d9-8858-487a-ab61-1e6806237de3"
  }
}
```

### DELETE /api/club/:id

Delete a particular club from the clubs database.

#### Response

```json
{
  "success": true,
  "status": 200,
  "data": {
    "name": "Club",
    "description": "My Club",
    "imageURL": "https://example.com/img.jpg",
    "createdAt": "2019-02-03",
    "id": "1ca625d9-8858-487a-ab61-1e6806237de3"
  }
}
```

### PUT /api/club/:id

Update a particular club from the clubs database. Requires an `application/json` body with the following properties.

| Property    | Type    | Description                                        |
|-------------|---------|----------------------------------------------------|
| name        | String  | Club's name.                                       |
| description | String  | Club's description. Can be empty or set to `null`. |
| imageURL    | String  | Club's image URL. Must be a valid URI.             |

> Only add the properties you wish to edit.

#### Response

```json
{
  "success": true,
  "status": 200,
  "data": {
    "name": "New Club Name",
    "description": "My Club",
    "imageURL": "https://example.com/img.jpg",
    "createdAt": "2019-02-03",
    "id": "b49f8d44-2fb4-4d85-be8e-5678f35538d3"
  }
}
```

## Authors

This project was created in pair-programming by Raí Díaz, José Luis Contreras and Christian López.
