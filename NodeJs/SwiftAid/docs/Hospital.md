### Hospital Routes API Documentation

This API documentation outlines the endpoints available for hospital-related operations.

**Base URL:** `/api/hospitals`

### Endpoints

---

#### 1. Hospital Signup

- **Endpoint:** `POST /signup`
- **Description:** Register a new hospital.
- **Request Body:**
  - `name` (string, required): Name of the hospital.
  - `email` (string, required): Hospital's email address.
  - `password` (string, required): Hospital's password.
- **Success Response:**
  - **Code:** 201 CREATED
  - **Content:** (Refer to Hospital Authentication API documentation for response details)
- **Error Responses:**
  - (Refer to Hospital Authentication API documentation for error responses)

#### 2. Hospital Login

- **Endpoint:** `POST /login`
- **Description:** Authenticate hospital and generate access token.
- **Request Body:**
  - `email` (string, required): Hospital's email address.
  - `password` (string, required): Hospital's password.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** (Refer to Hospital Authentication API documentation for response details)
- **Error Responses:**
  - (Refer to Hospital Authentication API documentation for error responses)

#### 3. Get Hospital by ID

- **Endpoint:** `GET /:id`
- **Description:** Get hospital details by hospital ID.
- **URL Parameters:**
  - `id` (string, required): Hospital ID.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** (Refer to Hospital Authentication API documentation for response details)
- **Error Responses:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "message": "Invalid user ID" }`
  - **Code:** 401 UNAUTHORIZED
  - **Content:** `{ "message": "Unauthorized" }`
  - **Code:** 404 NOT FOUND
  - **Content:** `{ "message": "Hospital not found" }`
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": "Internal server error" }`

#### 4. Update Hospital by ID

- **Endpoint:** `POST /update/:id`
- **Description:** Update hospital details by hospital ID.
- **URL Parameters:**
  - `id` (string, required): Hospital ID.
- **Request Body:** (Fields to be updated)
  - `name` (string): Updated name of the hospital.
  - `email` (string): Updated email address.
  - `phone` (string): Updated phone number.
  - `address` (string): Updated address.
  - `photo` (string): Updated photo URL.
  - `work` (string): Updated work information.
  - `familyDetails` (string): Updated family details.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** (Refer to Hospital Authentication API documentation for response details)
- **Error Responses:**
  - (Refer to "Get Hospital by ID" error responses)

#### 5. Count Hospitals

- **Endpoint:** `GET /count`
- **Description:** Get the count of active hospitals in the system.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Active hospital count retrieved successfully",
      "count": "<hospital_count>"
    }
    ```
- **Error Responses:**
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": "Internal server error" }`
