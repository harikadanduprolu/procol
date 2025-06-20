"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_1 = require("../controllers/project");
const auth_1 = require("../middleware/auth");
// import { upload } from '../middleware/upload';
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// Public routes
router.get('/', project_1.getProjects);
router.get('/:id', project_1.getProject);
// Protected routes
router.post('/', auth_1.auth, upload.single('image'), project_1.createProject);
router.put('/:id', auth_1.auth, upload.single('image'), project_1.updateProject);
router.delete('/:id', auth_1.auth, project_1.deleteProject);
router.post('/:id/team', auth_1.auth, project_1.addTeamMember);
router.delete('/:id/team', auth_1.auth, project_1.removeTeamMember);
exports.default = router;
