### API Documentation for `Users`

This documentation provides details on the available endpoints for user-related operations under the base API path `/api/user`.

#### **Base URL**

```
/api/users
```

### **Endpoints**

#### **1. User Signup**

- **Endpoint:** `/signup`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**
  ```json
  {
    "fullname": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **201 Created:**
    ```json
    {
      "success": true,
      "message": "User created successfully",
      "user": {
        "fullname": "string",
        "email": "string"
      },
      "token": "string"
    }
    ```
  - **400 Bad Request:** Missing fields or invalid input.
  - **409 Conflict:** Email already registered.

#### **2. User Login**

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "success": true,
      "message": "Login Successfully",
      "user": {
        "fullname": "string",
        "email": "string"
      },
      "token": "string"
    }
    ```
  - **400 Bad Request:** Missing fields or invalid input.
  - **401 Unauthorized:** Invalid email or password.

#### **3. Count Users**

- **Endpoint:** `/count`
- **Method:** `GET`
- **Description:** Returns the total number of users.
- **Responses:**
  - **200 OK:**
    ```json
    {
      "count": "number"
    }
    ```

#### **4. Get User by ID**

- **Endpoint:** `/:id`
- **Method:** `GET`
- **Description:** Retrieves a user by their ID.
- **Parameters:**
  - `id` (path parameter): The ID of the user.
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "found",
      "user": {
        "fullname": "string",
        "email": "string"
      }
    }
    ```
  - **400 Bad Request:** Invalid user ID.
  - **404 Not Found:** User not found.

#### **5. Update User by ID**

- **Endpoint:** `/update/:id`
- **Method:** `POST`
- **Description:** Updates user details by their ID.
- **Parameters:**
  - `id` (path parameter): The ID of the user.
- **Request Body:**
  ```json
  {
    "fullname": "string",
    "email": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "User updated successfully",
      "user": {
        "fullname": "string",
        "email": "string"
      }
    }
    ```
  - **400 Bad Request:** Invalid user ID or email already registered.
  - **404 Not Found:** User not found.

#### **6. Get User by Username**

- **Endpoint:** `/uname/:username`
- **Method:** `GET`
- **Description:** Retrieves a user by their username.
- **Parameters:**
  - `username` (path parameter): The username of the user.
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "found",
      "user": {
        "fullname": "string",
        "email": "string"
      }
    }
    ```
  - **404 Not Found:** User not found.

#### **7. Change Password**

- **Endpoint:** `/change-password`
- **Method:** `POST`
- **Description:** Changes the password for a user.
- **Request Body:**
  ```json
  {
    "userId": "string",
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Password changed successfully"
    }
    ```
  - **400 Bad Request:** Missing fields or invalid input.
  - **401 Unauthorized:** Current password is incorrect.
  - **404 Not Found:** User not found.

### **Error Handling**

All endpoints may return the following error responses:

- **400 Bad Request:** Invalid input or missing required fields.
- **401 Unauthorized:** Authentication failed.
- **404 Not Found:** Resource not found.
- **500 Internal Server Error:** An unexpected error occurred.

### **Notes**

- Ensure to handle JWT tokens for authentication where required.
- Validate all inputs to prevent security vulnerabilities.

This documentation provides a comprehensive overview of the user-related API endpoints, their expected inputs, and responses.
