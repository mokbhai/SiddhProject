### Ambulance Routes API Documentation

This API documentation outlines the endpoints available for ambulance-related operations.

**Base URL:** `/api/ambulances`

### Endpoints

---

#### 1. Create Ambulance

- **Endpoint:** `POST /new`
- **Description:** Register a new ambulance.
- **Request Body:**
  - `vehicleDetails` (object, required): Details of the ambulance vehicle.
  - `number` (string, required): Number plate of the ambulance.
  - `hospitalId` (string, required): ID of the hospital associated with the ambulance.
- **Success Response:**
  - **Code:** 201 CREATED
  - **Content:** `{ "message": "Ambulance added successfully", "result": <ambulance_details> }`
- **Error Responses:**
  - **Code:** 400 BAD REQUEST
  - **Content:** `{ "message": "All fields are required" }`
  - **Code:** 401 UNAUTHORIZED
  - **Content:** `{ "message": "Unauthorized" }`
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": <error_message> }`

#### 2. Get All Ambulances

- **Endpoint:** `GET /`
- **Description:** Retrieve all registered ambulances.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Array of ambulance objects
- **Error Responses:**
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": <error_message> }`

#### 3. Get All Ambulances by Hospital ID

- **Endpoint:** `GET of/hospital/:hospitalId`
- **Description:** Retrieve all ambulances associated with a specific hospital.
- **URL Parameters:**
  - `hospitalId` (string, required): ID of the hospital.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Array of ambulance objects
- **Error Responses:**
  - **Code:** 404 NOT FOUND
  - **Content:** `{ "message": "Hospital not found" }`
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": <error_message> }`

#### 4. Get Ambulance by ID

- **Endpoint:** `GET /:ambulanceId`
- **Description:** Retrieve ambulance details by ambulance ID.
- **URL Parameters:**
  - `id` (string, required): Ambulance ID.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Ambulance object
- **Error Responses:**
  - **Code:** 404 NOT FOUND
  - **Content:** `{ "message": "Ambulance not found" }`
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": <error_message> }`

#### 5. Update Ambulance by ID

- **Endpoint:** `POST /update/:ambulanceId`
- **Description:** Update ambulance details by ambulance ID.
- **URL Parameters:**
  - `id` (string, required): Ambulance ID.
- **Request Body:** (Fields to be updated)
  - Any fields present in the ambulance object.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** Updated ambulance object
- **Error Responses:**
  - **Code:** 404 NOT FOUND
  - **Content:** `{ "message": "Ambulance not found" }`
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": <error_message> }`

#### 6. Update Ambulance isOccupied

- **Endpoint:** `POST /isOccupied/:ambulanceId`
- **Description:** Update ambulance isOccupied by ambulance ID.
- **URL Parameters:**
  - `ambulanceId` (string, required): Ambulance ID.
- **Request Body:**
  - `isOccupied` (string, required): New isOccupied of the ambulance.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Ambulance isOccupied updated", "ambulance": <updated_ambulance_object> }`
- **Error Responses:**
  - **Code:** 404 NOT FOUND
  - **Content:** `{ "message": "Ambulance not found" }`
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": <error_message> }`

#### 7. Delete Ambulance by ID

- **Endpoint:** `DELETE /delete/:ambulanceId`
- **Description:** Delete ambulance by ambulance ID.
- **URL Parameters:**
  - `id` (string, required): Ambulance ID.
- **Request Body:**
  - `hospitalId` (string, required): ID of the hospital associated with the ambulance.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:** `{ "message": "Ambulance deleted successfully" }`
- **Error Responses:**
  - **Code:** 404 NOT FOUND
  - **Content:** `{ "message": "Ambulance not found" }`
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": <error_message> }`

#### 8. Count Ambulances

- **Endpoint:** `GET /count`
- **Description:** Get the count of active hospitals in the system.
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "message": "Active ambulances count retrieved successfully",
      "count": "<ambulance_count>"
    }
    ```
- **Error Responses:**
  - **Code:** 500 INTERNAL SERVER ERROR
  - **Content:** `{ "message": "Internal server error" }`
