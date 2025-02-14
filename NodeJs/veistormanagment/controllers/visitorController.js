const Visitor = require("../models/Visitor");
const User = require("../models/User");
const QRCode = require("qrcode");
const { sendEmail } = require("../utils/email");

const visitorController = {
  // Get all visitors
  getAllVisitors: async (req, res) => {
    try {
      const visitors = await Visitor.find({
        hostEmployee: req.user._id,
      })
        .populate("hostEmployee", "name email department")
        .sort("-createdAt");
      const user = req.user;
      res.render("visitors/index", { visitors, user });
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error fetching visitors");
      res.redirect("/dashboard");
    }
  },

  // Get visitor registration form
  getRegisterVisitor: async (req, res) => {
    try {
      const employees = await User.find({ role: "employee" }).select(
        "name email department"
      );
      res.render("visitors/register", { employees });
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error loading registration form");
      res.redirect("/visitors");
    }
  },

  // Register new visitor
  registerVisitor: async (req, res) => {
    try {
      const {
        fullName,
        email,
        phone,
        company,
        purpose,
        hostEmployee,
        visitDate,
      } = req.body;
      const photo = req.file ? req.file.filename : null;

      if (!photo) {
        req.flash("error_msg", "Photo is required");
        return res.redirect("/visitors/register");
      }

      // Generate QR code
      const qrData = JSON.stringify({
        visitorId: Date.now(),
        name: fullName,
        email,
        hostEmployee,
      });
      const qrCode = await QRCode.toDataURL(qrData);

      const visitor = new Visitor({
        fullName,
        email,
        phone,
        company,
        purpose,
        hostEmployee,
        photo,
        visitDate: new Date(visitDate),
        qrCode,
      });

      await visitor.save();

      // Get host employee details and send email notification
      const host = await User.findById(hostEmployee);
      sendEmail({
        to: host.email,
        subject: "New Visitor Registration",
        text: `A new visitor ${fullName} has registered to meet you on ${visitDate}. 
        Purpose: ${purpose}. 
        Please approve from website.`,
      });

      req.flash("success_msg", "Visitor registered successfully");
      res.redirect("/visitors");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error registering visitor");
      res.redirect("/visitors/register");
    }
  },

  // Approve visitor
  approveVisitor: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.id);
      if (!visitor) {
        req.flash("error_msg", "Visitor not found");
        return res.redirect("/visitors");
      }

      // Update visitor status to approved
      visitor.status = "approved";

      // Generate QR code
      const qrData = JSON.stringify({
        visitorId: visitor._id,
        name: visitor.fullName,
        email: visitor.email,
        hostEmployee: visitor.hostEmployee,
      });
      const qrCode = await QRCode.toDataURL(qrData);

      // Save the QR code to the visitor record
      visitor.qrCode = qrCode;
      await visitor.save();

      // Send approval email to the visitor with the QR code
      sendEmail({
        to: visitor.email,
        subject: "Visit Approved",
        text: `Your visit has been approved. Please show the QR code when you arrive.`,
        html: `<p>Your visit has been approved. Please show the QR code when you arrive.</p>
        <img src="${qrCode}" alt="QR Code" style="width: 200px; height: auto;" />`,
      });

      req.flash("success_msg", "Visitor approved successfully");
      res.redirect("/visitors");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error approving visitor");
      res.redirect("/visitors");
    }
  },

  // Check-in visitor
  checkInVisitor: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.id);
      if (!visitor) {
        req.flash("error_msg", "Visitor not found");
        return res.redirect("/visitors");
      }

      if (visitor.status !== "approved") {
        req.flash("error_msg", "Visit not approved or already checked in");
        return res.redirect("/visitors");
      }

      visitor.status = "checked-in";
      visitor.checkInTime = new Date();
      await visitor.save();

      // Notify host employee
      const host = await User.findById(visitor.hostEmployee);
      sendEmail({
        to: host.email,
        subject: "Visitor Checked In",
        text: `${visitor.fullName} has checked in and is waiting for you.`,
      });

      req.flash("success_msg", "Visitor checked in successfully");
      res.redirect("/visitors");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error checking in visitor");
      res.redirect("/visitors");
    }
  },

  // Check-out visitor
  checkOutVisitor: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.id);
      if (!visitor) {
        req.flash("error_msg", "Visitor not found");
        return res.redirect("/visitors");
      }

      visitor.status = "checked-out";
      visitor.checkOutTime = new Date();
      await visitor.save();

      req.flash("success_msg", "Visitor checked out successfully");
      res.redirect("/visitors");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error checking out visitor");
      res.redirect("/visitors");
    }
  },

  // Get QR scanner page
  getScanQR: (req, res) => {
    res.render("visitors/scan");
  },

  // Verify QR code data
  verifyQR: async (req, res) => {
    try {
      const { visitorId, email } = req.body;

      // Find the visitor
      const visitor = await Visitor.findById(visitorId);

      if (!visitor) {
        return res.json({
          success: false,
          message: "Invalid visitor QR code",
        });
      }

      if (visitor.email !== email) {
        return res.json({
          success: false,
          message: "QR code data mismatch",
        });
      }

      if (visitor.status !== "approved") {
        return res.json({
          success: false,
          message: "Visit not approved or already checked in",
        });
      }

      return res.json({
        success: true,
        visitorId: visitor._id,
      });
    } catch (err) {
      console.error(err);
      return res.json({
        success: false,
        message: "Error verifying QR code",
      });
    }
  },

  // Get check-in confirmation page
  getConfirmCheckIn: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.id).populate(
        "hostEmployee",
        "name email department"
      );

      if (!visitor) {
        req.flash("error_msg", "Visitor not found");
        return res.redirect("/visitors");
      }

      res.render("visitors/confirm-checkin", { visitor });
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error loading confirmation page");
      res.redirect("/visitors");
    }
  },
};

module.exports = visitorController;
