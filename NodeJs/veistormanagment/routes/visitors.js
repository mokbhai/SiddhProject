const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController");
const { ensureAuthenticated, ensureRole } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Get all visitors
router.get("/", ensureAuthenticated, visitorController.getAllVisitors);

// Get visitor registration form
router.get(
  "/register",
  ensureAuthenticated,
  visitorController.getRegisterVisitor
);

// Register new visitor
router.post(
  "/register",
  ensureAuthenticated,
  upload.single("photo"),
  visitorController.registerVisitor
);

// Approve visitor
router.post(
  "/approve/:id",
  ensureAuthenticated,
  ensureRole("admin", "employee"),
  visitorController.approveVisitor
);

// Check-in visitor
router.post(
  "/checkin/:id",
  ensureAuthenticated,
  ensureRole("security"),
  visitorController.checkInVisitor
);

// Check-out visitor
router.post(
  "/checkout/:id",
  ensureAuthenticated,
  ensureRole("security"),
  visitorController.checkOutVisitor
);

// QR code scanner
router.get(
  "/scan",
  ensureAuthenticated,
  ensureRole("security"),
  visitorController.getScanQR
);

// Verify QR code
router.post(
  "/verify-qr",
  ensureAuthenticated,
  ensureRole("security"),
  visitorController.verifyQR
);

// Confirm check-in page
router.get(
  "/confirm-checkin/:id",
  ensureAuthenticated,
  ensureRole("security"),
  visitorController.getConfirmCheckIn
);

module.exports = router;
