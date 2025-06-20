"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funding = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const FundingSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    project: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project', required: true },
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    rewards: [
        {
            tier: { type: String },
            amount: { type: Number },
            description: { type: String }
        }
    ],
    backers: [
        {
            user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            amount: { type: Number },
            rewardTier: { type: String },
            date: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });
// Index for searching funding campaigns
FundingSchema.index({ title: 'text', description: 'text' });
exports.Funding = mongoose_1.default.model('Funding', FundingSchema);
