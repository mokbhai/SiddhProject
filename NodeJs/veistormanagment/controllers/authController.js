const User = require('../models/User');
const passport = require('passport');

const authController = {
    // Get login page
    getLogin: (req, res) => {
        res.render('auth/login');
    },

    // Get register page
    getRegister: (req, res) => {
        res.render('auth/register');
    },

    // Register user
    register: async (req, res) => {
        try {
            const { name, email, password, department } = req.body;

            // Validation
            const errors = [];
            if (!name || !email || !password || !department) {
                errors.push({ msg: 'Please fill in all fields' });
            }
            if (password.length < 6) {
                errors.push({ msg: 'Password should be at least 6 characters' });
            }

            if (errors.length > 0) {
                return res.render('auth/register', {
                    errors,
                    name,
                    email,
                    department
                });
            }

            // Check if user exists
            let user = await User.findOne({ email });
            if (user) {
                errors.push({ msg: 'Email is already registered' });
                return res.render('auth/register', {
                    errors,
                    name,
                    email,
                    department
                });
            }

            // Create new user
            user = new User({
                name,
                email,
                password,
                department
            });

            await user.save();
            req.flash('success_msg', 'You are now registered and can log in');
            res.redirect('/auth/login');
        } catch (err) {
            console.error(err);
            res.status(500).render('error', { error: 'Server error' });
        }
    },

    // Login user
    login: passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    }),

    // Logout user
    logout: (req, res) => {
        req.logout(function(err) {
            if (err) {
                console.error(err);
                return next(err);
            }
            req.flash('success_msg', 'You are logged out');
            res.redirect('/auth/login');
        });
    }
};

module.exports = authController; 