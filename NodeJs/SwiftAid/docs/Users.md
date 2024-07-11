### User Routes API Documentation

This API documentation outlines the endpoints available for user-related operations.

**Base URL:** `/api/users`

### Endpoints

---

#### 1. User Signup

- **Endpoint:** `POST /signup`
- **Description:** Register a new user.
- **Request Body:**
  - `fullname` (string, required): Full name of the user.
  - `username` (string, required): Unique username.
  - `email` (string, required): User's email address.
  - `password` (string, required): User's password.
- **Success Response:**
  - **Code:** 201 CREATED
  - **Content:** (Refer to User Authentication API documentation for response details)
- **Error Responses:**
  - (Refer to User Authentication API documentation for error responses)

#### 2. User Login

- **Endpoint:** `POST /login`
- **Description:** Authenticate user and generate access token.
- **Request Body:**
  - `email` (string, required): User's email address.
  - `password` (string, required): User's password.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** (Refer to User Authentication API documentation for response details)
- **Error Responses:**
  - (Refer to User Authentication API documentation for error responses)

#### 3. Count Users

- **Endpoint:** `GET /count`
- **Description:** Get the count of active users in the system.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Active user count retrieved successfully",
      "count": "<user_count>"
    }
    ```
- **Error Responses:**
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": "Internal server error" }`

#### 4. Get User by ID

- **Endpoint:** `GET /:id`
- **Description:** Get user details by user ID.
- **URL Parameters:**
  - `id` (string, required): User ID.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** (Refer to User Authentication API documentation for response details)
- **Error Responses:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "message": "Invalid user ID" }`
  - **Code:** 401 UNAUTHORIZED
  - **Content:** `{ "message": "Unauthorized" }`
  - **Code:** 404 NOT FOUND
  - **Content:** `{ "message": "User not found" }`
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": "Internal server error" }`

#### 5. Update User by ID

- **Endpoint:** `POST /update/:id`
- **Description:** Update user details by user ID.
- **URL Parameters:**
  - `id` (string, required): User ID.
- **Request Body:** (Fields to be updated)
  - `fullname` (string): Updated full name of the user.
  - `username` (string): Updated username.
  - `email` (string): Updated email address.
  - `phone` (string): Updated phone number.
  - `address` (string): Updated address.
  - `photo` (string): Updated photo URL.
  - `profession` (string): Updated profession.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** (Refer to User Authentication API documentation for response details)
- **Error Responses:**
  - (Refer to "Get User by ID" error responses)

#### 6. Check Username Availability

- **Endpoint:** `GET /uname/:username`
- **Description:** Check if the username is available.
- **URL Parameters:**
  - `username` (string, required): Username to check.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "available" or "not available",
      "isAvailable": true or false
    }
    ```
- **Error Responses:**
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": "Internal server error" }`
