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
exports.Message = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MessageSchema = new mongoose_1.Schema({
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    recipientType: {
        type: String,
        enum: ['user', 'team', 'project'],
        required: true,
        default: 'user'
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    readBy: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    metadata: {
        attachments: [String],
        mentions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        reactions: [{
                userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
                reaction: String
            }],
        isSystemMessage: { type: Boolean, default: false }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Virtual for determining the ref model based on recipientType
MessageSchema.virtual('recipient').get(function () {
    const refMap = {
        'user': 'User',
        'team': 'Team',
        'project': 'Project'
    };
    return mongoose_1.default.model(refMap[this.recipientType]).findById(this.recipientId);
});
// Indexes for efficient querying
MessageSchema.index({ sender: 1, recipientId: 1, recipientType: 1 });
MessageSchema.index({ recipientId: 1, recipientType: 1 });
MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ 'metadata.mentions': 1 });
MessageSchema.index({ status: 1 });
MessageSchema.index({ readBy: 1 });
// Instance methods
MessageSchema.methods.markAsRead = async function (userId) {
    if (!this.readBy.includes(userId)) {
        this.readBy.push(userId);
        this.status = 'read';
        await this.save();
    }
    return this;
};
MessageSchema.methods.addReaction = async function (userId, reaction) {
    // Remove existing reaction from this user if any
    this.metadata.reactions = this.metadata.reactions.filter(r => !r.userId.equals(userId));
    // Add new reaction
    this.metadata.reactions.push({ userId, reaction });
    return this.save();
};
MessageSchema.methods.removeReaction = async function (userId) {
    this.metadata.reactions = this.metadata.reactions.filter(r => !r.userId.equals(userId));
    return this.save();
};
// Static methods
MessageSchema.statics.findConversation = async function (userOrEntityId, recipientId, recipientType, limit = 50, skip = 0) {
    return this.find({
        $or: [
            { sender: userOrEntityId, recipientId, recipientType },
            { sender: recipientId, recipientId: userOrEntityId, recipientType: 'user' }
        ]
    })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender', 'name avatar')
        .populate({
        path: 'recipientId',
        select: 'name avatar',
        model: recipientType === 'user' ? 'User' : recipientType === 'team' ? 'Team' : 'Project'
    });
};
MessageSchema.statics.markAllAsRead = async function (userId, entityId, entityType) {
    await this.updateMany({
        recipientId: userId,
        recipientType: 'user',
        sender: entityId,
        readBy: { $ne: userId }
    }, {
        $addToSet: { readBy: userId },
        $set: { status: 'read' }
    });
};
MessageSchema.statics.findUnreadCount = async function (userId, entityId, entityType) {
    const query = {
        recipientId: userId,
        recipientType: 'user',
        readBy: { $ne: userId }
    };
    if (entityId) {
        query.sender = entityId;
    }
    return this.countDocuments(query);
};
exports.Message = mongoose_1.default.model('Message', MessageSchema);
