const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

// Home page
router.get("/", (req, res) => {
  res.render('index');
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    try {
        res.render('dashboard', {
            user: req.user
        });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error loading dashboard');
        res.redirect('/');
    }
});

module.exports = router;
