"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_1 = require("../controllers/notification");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.auth);
router.post('/', notification_1.createNotification);
router.get('/', notification_1.getNotifications);
router.put('/:id/read', notification_1.markAsRead);
router.put('/all/read', notification_1.markAsRead);
router.delete('/:id', notification_1.deleteNotification);
exports.default = router;
