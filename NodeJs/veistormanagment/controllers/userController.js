const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password").sort("name");
      res.render("users/index", { users });
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error fetching users");
      res.redirect("/dashboard");
    }
  },

  // Get user creation form
  getCreateUser: (req, res) => {
    res.render("users/create");
  },

  // Create new user
  createUser: async (req, res) => {
    try {
      const { name, email, password, role, department } = req.body;

      // Validation
      const errors = [];
      if (!name || !email || !password || !role || !department) {
        errors.push({ msg: "Please fill in all fields" });
      }
      if (password.length < 6) {
        errors.push({ msg: "Password should be at least 6 characters" });
      }

      if (errors.length > 0) {
        return res.render("users/create", {
          errors,
          name,
          email,
          role,
          department,
        });
      }

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        errors.push({ msg: "Email is already registered" });
        return res.render("users/create", {
          errors,
          name,
          email,
          role,
          department,
        });
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
        role,
        department,
      });

      await user.save();
      req.flash("success_msg", "User created successfully");
      res.redirect("/users");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error creating user");
      res.redirect("/users/create");
    }
  },

  // Get user edit form
  getEditUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        req.flash("error_msg", "User not found");
        return res.redirect("/users");
      }
      res.render("users/edit", { user });
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error fetching user");
      res.redirect("/users");
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { name, email, role, department } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        req.flash("error_msg", "User not found");
        return res.redirect("/users");
      }

      user.name = name;
      user.email = email;
      user.role = role;
      user.department = department;

      await user.save();
      req.flash("success_msg", "User updated successfully");
      res.redirect("/users");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error updating user");
      res.redirect("/users");
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        req.flash("error_msg", "User not found");
        return res.redirect("/users");
      }

      await user.remove();
      req.flash("success_msg", "User deleted successfully");
      res.redirect("/users");
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "Error deleting user");
      res.redirect("/users");
    }
  },
};

module.exports = userController;
