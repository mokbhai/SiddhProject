import NodeCache from "node-cache";
import { Location } from "../models/LocationModel.js";

const cache = new NodeCache({ stdTTL: 86400 });

// Controller function to get location by ID
const getLocationById = (req, res) => {
  try {
    const { id } = req.params;
    // Retrieve location data from cache using the provided ID
    const locationData = cache.get(id);

    // Check if data exists in cache
    if (!locationData) {
      return res.status(404).json({ error: "Location not found in cache" });
    }

    // Send location data as response
    return res.status(200).json(locationData);
  } catch (error) {
    console.error("Error retrieving location from cache:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Controller function to store location data
const storeLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, long, accountType, isOcuppied } = req.body;

    // Check if location already exists in the database
    let location = await Location.findById(id);

    if (!location) {
      // If location doesn't exist, create a new one
      const newLocation = new Location({
        _id: id,
        lat,
        long,
        accountType,
        isOcuppied,
      });
      // Save the new location to the database
      await newLocation.save();
    } else {
      // If location exists, update its coordinates
      location.lat = lat;
      location.long = long;
      // Save the updated location to the database
      await location.save();
    }

    // Store location data in cache with the provided ID
    cache.set(id, { lat, long, accountType, isOcuppied });

    return res.status(200).json({ message: "Location stored successfully" });
  } catch (error) {
    console.error("Error storing location in cache:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Controller function to store location data
const storeLocationInCache = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, long, accountType, isOcuppied } = req.body;

    // Store location data in cache with the provided ID
    cache.set(id, { lat, long, accountType, isOcuppied });
    return res.status(200).json({ message: "Location stored successfully" });
  } catch (error) {
    console.error("Error storing location in cache:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Controller function to store location data
const storeLocationInCacheFunc = async (data) => {
  try {
    const { _id } = data;
    const id = _id.toString();
    // Store location data in cache with the provided ID
    cache.set(id, {
      lat: data.lat,
      long: data.long,
      accountType: data.accountType,
    });

    return id;
  } catch (error) {
    console.error("Error storing location in cache:", error);
    return false;
  }
};

// Controller function to delete location data by ID
const deleteLocationById = (req, res) => {
  try {
    const { id } = req.params;

    // Delete location data from cache using the provided ID
    const deleted = cache.del(id);

    if (!deleted) {
      return res.status(404).json({ message: "Location not found in cache" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting location from cache:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Controller function to get all locations with account type "Driver" from cache
const getAllAmbulanceLocationsFromCache = async (req, res) => {
  try {
    // Get all keys from the cache
    const keys = cache.keys();
    // console.log(keys);
    // Initialize an array to store locations with account type "Driver"
    const ambulanceLocation = [];

    // Iterate over each key in the cache
    keys.forEach((key) => {
      // Retrieve location data from cache using the key
      const locationData = cache.get(key);

      // Check if location data exists and has the account type "Driver"
      if (
        locationData &&
        locationData.accountType === "Ambulance" &&
        locationData.isOcuppied === false
      ) {
        // Add the location data to the array
        ambulanceLocation.push({ id: key, ...locationData });
      }
    });
    if (ambulanceLocation.length === 0) {
      const locations = await getAllAmbulanceLocations();
      locations.forEach(async (location) => {
        // Add the location data to the array
        const id = await storeLocationInCacheFunc(location);
        const locationData = cache.get(id);
        // Check if location data exists and has the account type "Driver"
        if (locationData && locationData.accountType === "Ambulance") {
          // Add the location data to the array
          ambulanceLocation.push({
            id,
            lat: locationData.lat,
            long: locationData.long,
            accountType: locationData.accountType,
          });
        }
      });
    }
    // Send the array of driver locations as response
    return res.status(200).json(ambulanceLocation);
  } catch (error) {
    console.error("Error retrieving driver locations from cache:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getAllHospitalsLocations = async () => {
  try {
    const locations = await Location.find({ accountType: "Hospital" });
    return locations;
  } catch (error) {
    return { error: "Internal Server Error" };
  }
};

const getAllAmbulanceLocations = async () => {
  try {
    const locations = await Location.find({ accountType: "Ambulance" });
    return locations;
  } catch (error) {
    return { error: "Internal Server Error" };
  }
};

const getAllHospitalsFromCache = async (req, res) => {
  try {
    // Get all keys from the cache
    const keys = cache.keys();
    // console.log(keys);
    // Initialize an array to store locations with account type "Driver"
    const hospitalLocations = [];

    // Iterate over each key in the cache
    keys.forEach(async (key) => {
      // Retrieve location data from cache using the key
      const locationData = cache.get(key);

      // Check if location data exists and has the account type "Driver"
      if (locationData && locationData.accountType === "Hospital") {
        // Add the location data to the array
        hospitalLocations.push({ id: key, ...locationData });
      }
    });
    if (hospitalLocations.length === 0) {
      const locations = await getAllHospitalsLocations();
      locations.forEach(async (location) => {
        // Add the location data to the array
        const id = await storeLocationInCacheFunc(location);
        const locationData = cache.get(id);
        // Check if location data exists and has the account type "Driver"
        if (locationData && locationData.accountType === "Hospital") {
          // Add the location data to the array
          hospitalLocations.push({
            id,
            lat: locationData.lat,
            long: locationData.long,
            accountType: locationData.accountType,
          });
        }
      });
    }
    // Send the array of driver locations as response
    return res.status(200).json(hospitalLocations);
  } catch (error) {
    console.error("Error retrieving driver locations from cache:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  console.log(distance);
  return distance;
}

const getNearestDriverLocation = (req, res) => {
  try {
    const { lat, long } = req.body;
    let nearestDriver = null;
    let minDistance = Infinity;

    // Get all keys from the cache
    const keys = cache.keys();
    // console.log(keys);
    // Iterate over each key in the cache
    keys.forEach((key) => {
      // Retrieve location data from cache using the key
      const locationData = cache.get(key);

      // Check if location data exists and has the account type "Driver"
      if (
        locationData &&
        locationData.accountType === "Driver" &&
        !locationData.isOccupied
      ) {
        // Calculate distance between user's location and driver's location
        const distance = calculateDistance(
          lat,
          long,
          locationData.lat,
          locationData.long
        );

        // Update nearest driver if this driver is closer
        if (distance < minDistance) {
          minDistance = distance;
          nearestDriver = { id: key, ...locationData };
        }
      }
    });
    if (!nearestDriver) {
      return res.status(404).json({ message: "No driver found nearby" });
    }
    // console.log(nearestDriver);
    // Send the nearest driver and the minimum distance as response
    return res.status(200).json({ nearestDriver, minDistance });
  } catch (error) {
    console.error("Error finding nearest driver location:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getRangedDriverLocation = (req, res) => {
  try {
    const { lat, long } = req.body;
    const maxDistance = 10;
    const nearbyDrivers = [];

    // Get all keys from the cache
    const keys = cache.keys();

    // Iterate over each key in the cache
    keys.forEach((key) => {
      // Retrieve location data from cache using the key
      const locationData = cache.get(key);

      // Check if location data exists and has the account type "Driver"
      if (
        locationData &&
        locationData.accountType === "Driver" &&
        !locationData.isOccupied // Assuming there's an 'isOccupied' field to check if the driver is available
      ) {
        // Calculate distance between user's location and driver's location
        const distance = calculateDistance(
          lat,
          long,
          locationData.lat,
          locationData.long
        );

        // Check if the driver is within the specified radius
        if (distance <= maxDistance) {
          nearbyDrivers.push({ id: key, ...locationData, distance });
        }
      }
    });

    if (nearbyDrivers.length === 0) {
      return res
        .status(404)
        .json({ message: "No drivers found within 10 km radius" });
    }

    return res.status(200).json(nearbyDrivers);
  } catch (error) {
    console.error("Error finding nearby drivers:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export {
  getAllHospitalsFromCache,
  getRangedDriverLocation,
  getNearestDriverLocation,
  getLocationById,
  getAllAmbulanceLocationsFromCache,
  storeLocation,
  storeLocationInCache,
  deleteLocationById,
};
