"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Authentication routes
router.post('/otp', auth_1.otp);
router.post('/register', auth_1.register);
router.post('/login', auth_1.login);
// Protected routes
router.get('/profile', auth_2.auth, auth_1.getProfile);
router.put('/profile', auth_2.auth, auth_1.updateProfile);
router.get('/search', auth_2.auth, auth_1.searchUsers);
// Public route for fetching all users (for Connect page)
router.get('/users', auth_1.getAllUsers);
router.get('/users/:id', auth_2.auth, auth_1.getUserById);
exports.default = router;
