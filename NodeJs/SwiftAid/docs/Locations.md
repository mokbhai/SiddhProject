## Location API Documentation

### Overview

This API allows you to manage location data. You can retrieve, store, update, and delete location information using the provided endpoints.

### Base URL

```
/api
```

### Authentication

No authentication is required to access these endpoints.

### Error Responses

- **400 Bad Request**: If the request is malformed or missing required parameters.
- **404 Not Found**: If the requested resource does not exist.
- **500 Internal Server Error**: If there is an unexpected error on the server side.

### Endpoints

#### 1. Retrieve Location by ID

- **URL**: `/locations/get/:id`
- **Method**: `GET`
- **Description**: Retrieves location data by its ID.
- **Parameters**:
  - `id`: ID of the location.
- **Responses**:
  - **200 OK**: Location data retrieved successfully.
    ```json
    {
      "lat": 40.7128,
      "long": -74.006
    }
    ```
  - **404 Not Found**: If the location is not found in the cache.
    ```json
    {
      "error": "Location not found in cache"
    }
    ```
  - **500 Internal Server Error**: If there is a server-side error.

#### 2. Store Location

- **URL**: `/locations/post/:id`
- **Method**: `POST`
- **Description**: Stores location data with the provided ID.
- **Parameters**:
  - `id`: ID of the location.
  - `lat`: Latitude of the location.
  - `long`: Longitude of the location.
- **Responses**:
  - **200 OK**: Location stored successfully.
    ```json
    {
      "message": "Location stored successfully"
    }
    ```
  - **500 Internal Server Error**: If there is a server-side error.

#### 3. Store Location in Cache

- **URL**: `/locations/temp/:id`
- **Method**: `POST`
- **Description**: Stores location data in cache with the provided ID.
- **Parameters**:
  - `id`: ID of the location.
  - `lat`: Latitude of the location.
  - `long`: Longitude of the location.
- **Responses**:
  - **200 OK**: Location stored successfully.
    ```json
    {
      "message": "Location stored successfully"
    }
    ```
  - **500 Internal Server Error**: If there is a server-side error.

#### 4. Delete Location by ID

- **URL**: `/locations/delete/:id`
- **Method**: `DELETE`
- **Description**: Deletes location data by its ID from the cache.
- **Parameters**:
  - `id`: ID of the location.
- **Responses**:
  - **204 No Content**: Location deleted successfully.
  - **404 Not Found**: If the location is not found in the cache.
    ```json
    {
      "message": "Location not found in cache"
    }
    ```
  - **500 Internal Server Error**: If there is a server-side error.
