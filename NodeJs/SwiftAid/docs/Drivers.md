## API Documentation for Drivers

### Base API Endpoint

```
/drivers/
```

### Endpoints

#### 1. Sign Up

- **Description**: Registers a new driver.
- **HTTP Method**: POST
- **Endpoint**: `/signup`
- **Request Body**:
  - `fullname` (string): Full name of the driver.
  - `username` (string): Username chosen by the driver.
  - `email` (string): Email address of the driver.
  - `password` (string): Password for the account.
- **Response**:
  - Status Code: 201 (Created)
  - Body:
    - `message` (string): Confirmation message.
    - `token` (object): Access and refresh tokens.
    - `user` (object): Driver's details including `_id`, `username`, `name`, `email`, `photo`, and `accountType`.

#### 2. Login

- **Description**: Allows a registered driver to log in.
- **HTTP Method**: POST
- **Endpoint**: `/login`
- **Request Body**:
  - `email` (string): Email address of the driver.
  - `password` (string): Password for the account.
- **Response**:
  - Status Code: 200 (OK)
  - Body:
    - `message` (string): Confirmation message.
    - `token` (object): Access token for authentication.
    - `user` (object): Driver's details including `_id`, `username`, `name`, `email`, `photo`, and `accountType`.

#### 3. Get User by ID

- **Description**: Retrieves driver details by user ID.
- **HTTP Method**: GET
- **Endpoint**: `/getUserById/:id`
- **Request Parameter**:
  - `id` (string): User ID of the driver.
- **Response**:
  - Status Code: 200 (OK)
  - Body:
    - `message` (string): Confirmation message.
    - `user` (object): Driver's details excluding password.

#### 4. Check Username Availability

- **Description**: Checks if a username is available.
- **HTTP Method**: GET
- **Endpoint**: `/getUsername/:username`
- **Request Parameter**:
  - `username` (string): Username to check availability.
- **Response**:
  - Status Code: 200 (OK)
  - Body:
    - `message` (string): Confirmation message.
    - `existsUser` (boolean): Indicates whether the username is available.

#### 5. Update User Details

- **Description**: Updates driver details.
- **HTTP Method**: PUT
- **Endpoint**: `/updateUser/:id`
- **Request Parameter**:
  - `id` (string): User ID of the driver.
- **Request Body** (optional):
  - `fullname` (string): Updated full name of the driver.
  - `username` (string): Updated username.
  - `email` (string): Updated email address.
  - `phone` (string): Updated phone number.
  - `address` (string): Updated address.
  - `photo` (string): Updated photo URL.
  - `work` (string): Updated work information.
  - `familyDetails` (object): Updated family details.
- **Response**:
  - Status Code: 200 (OK)
  - Body:
    - `message` (string): Confirmation message.
    - `user` (object): Updated driver details excluding password.

#### 6. Count Active Users

- **Description**: Counts the number of active drivers.
- **HTTP Method**: GET
- **Endpoint**: `/countUsers`
- **Response**:
  - Status Code: 200 (OK)
  - Body:
    - `message` (string): Confirmation message.
    - `count` (number): Total count of active drivers.

### Helper Functions

#### 1. jwtToken

- **Description**: Generates JWT tokens (access and refresh tokens) for a user.
- **Parameters**:
  - `user` (object): User object containing `_id` and `username`.
- **Returns**:
  - `accessToken` (string): JWT access token.
  - `refreshToken` (string|null): JWT refresh token or null.

#### 2. verifyToken

- **Description**: Verifies the validity of an access token.
- **Parameters**:
  - `req` (object): HTTP request object.
  - `res` (object): HTTP response object.
  - `userId` (string): User ID to verify against the token.
- **Returns**:
  - `true` if token is valid and belongs to the user.
  - `false` if token is invalid or doesn't belong to the user.
  - `"missing"` if access token is missing from the request headers.
