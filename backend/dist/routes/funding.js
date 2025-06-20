"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const funding_1 = require("../controllers/funding");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get('/', funding_1.getFundings);
router.get('/:id', funding_1.getFunding);
// Protected routes
router.post('/', auth_1.auth, funding_1.createFunding);
router.put('/:id', auth_1.auth, funding_1.updateFunding);
router.delete('/:id', auth_1.auth, funding_1.deleteFunding);
router.post('/:id/back', auth_1.auth, funding_1.backFunding);
exports.default = router;
