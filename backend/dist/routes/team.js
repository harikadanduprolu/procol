"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_1 = require("../controllers/team");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get('/', team_1.getTeams);
router.get('/:id', team_1.getTeam);
// Protected routes
router.post('/', auth_1.auth, team_1.createTeam);
router.put('/:id', auth_1.auth, team_1.updateTeam);
router.delete('/:id', auth_1.auth, team_1.deleteTeam);
router.post('/:id/members', auth_1.auth, team_1.addTeamMember);
router.delete('/:id/members', auth_1.auth, team_1.removeTeamMember);
exports.default = router;
