import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { optional, z } from 'zod';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['user', 'mentor', 'admin', 'funder']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  institution: z.string().optional(),
  university: z.string().optional(),
  location: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  socials: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().optional()
  }).optional()
});

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { 
  otp: string, 
  expiresAt: Date, 
  verified: boolean 
}>();

// function to send mail with your HTML template
export async function sendOtpEmail(email: string, otp: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASSWORD!
    }
  });

  try {
    await transporter.sendMail({
      from: `"Procollab" ${process.env.EMAIL_USER}`,
      to: email,
      subject: 'Verify your account',
      html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>ProCollab Email Verification</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: #0c0c1c;
                font-family: Arial, Helvetica, sans-serif;
                color: #ffffff;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: linear-gradient(145deg, #0c0c1c, #14142b);
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #2a2a4d;
              }
              .header {
                background-color: #151530;
                text-align: center;
                padding: 30px 20px;
              }
              .header img {
                max-height: 50px;
              }
              .header h1 {
                color: #b366ff;
                font-size: 28px;
                margin-top: 10px;
                margin-bottom: 0;
              }
              .content {
                padding: 30px 20px;
                text-align: center;
              }
              .content h2 {
                font-size: 24px;
                color: #e0e0ff;
                margin-bottom: 20px;
              }
              .otp {
                display: inline-block;
                background: #b366ff;
                color: #ffffff;
                font-size: 30px;
                letter-spacing: 8px;
                padding: 15px 25px;
                border-radius: 8px;
                margin-top: 10px;
                margin-bottom: 20px;
              }
              .description {
                color: #bbbbd1;
                font-size: 16px;
                margin-top: 20px;
              }
              .footer {
                text-align: center;
                background: #151530;
                color: #666688;
                font-size: 12px;
                padding: 15px 20px;
              }
              .button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background-color: #00e0ff;
                color: #000000;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img
                  src="https://i.imgur.com/jYOzE1h.png"
                  alt="ProCollab Logo"
                />
                <h1>ProCollab</h1>
              </div>
              <div class="content">
                <h2>Verify Your Email Address</h2>
                <p class="description">
                  Thank you for signing up with ProCollab! To complete your account setup and start connecting with your future teammates, please verify your email address using the code below:
                </p>
                <div class="otp">${otp}</div>
                <p class="description">
                  This code will expire in 10 minutes. If you did not request this verification, please ignore this email.
                </p>
                <a
                  href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email"
                  class="button"
                >
                  Verify Now
                </a>
              </div>
              <div class="footer">
                &copy; 2025 ProCollab. Connect. Collaborate. Create Together.
              </div>
            </div>
          </body>
        </html>
      `
    });
  } catch (error) {
    throw error
  }
}

// Send OTP for email verification
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate OTP and expiration time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    otpStore.set(email, { otp, expiresAt, verified: false });

    // Send email using your HTML template
    await sendOtpEmail(email, otp);

    res.status(200).json({ 
      message: 'Verification code sent to your email',
      email,
      // Only include OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending verification code' });
  }
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Check if OTP exists
    const storedOTPData = otpStore.get(email);
    if (!storedOTPData) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP is expired
    if (new Date() > storedOTPData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if OTP matches
    if (storedOTPData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark as verified
    storedOTPData.verified = true;
    otpStore.set(email, storedOTPData);

    res.status(200).json({ 
      message: 'Email verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// Resend OTP
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update stored OTP
    otpStore.set(email, { otp, expiresAt, verified: false });

    // Send email using your HTML template
    await sendOtpEmail(email, otp);

    res.status(200).json({ 
      message: 'New verification code sent to your email',
      // Only include OTP in development for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ message: 'Error resending verification code' });
  }
};

// calls otp sending function (keeping your existing function)
export const otp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    // sends otp 
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtpEmail(email, otpCode)
    return res.send({ message: "The otp is generated", otp: otpCode })

  } catch (err) {
    res.status(400).send({ message: err })
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, otp } = req.body;
    const validatedData = registerSchema.parse({ email, password, name, role });

    // If OTP is provided, verify it
    if (otp) {
      const storedOTPData = otpStore.get(email);
      if (!storedOTPData || !storedOTPData.verified || storedOTPData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid or unverified OTP' });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      role: validatedData.role || 'user',
      isEmailVerified: otp ? true : false
    });

    await user.save();

    // Clean up OTP if used
    if (otp) {
      otpStore.delete(email);
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last seen
    user.lastSeen = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id)
      .select('-password')
      .populate({
        path: 'projects',
        select: 'title description tags team image',
        options: { limit: 6 }
      })
      .populate({
        path: 'teams',
        select: 'name role members projects',
        options: { limit: 4 }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is a mentor, include mentoring data
    if (user.role === 'mentor') {
      await user.populate({
        path: 'mentoring',
        select: 'projects students reviews rating',
        options: { limit: 4 }
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = updateProfileSchema.parse(req.body);
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    Object.assign(user, updates);
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate({
        path: 'projects',
        select: 'title description tags team image',
        options: { limit: 6 }
      })
      .populate({
        path: 'teams',
        select: 'name role members projects',
        options: { limit: 4 }
      });

    if (user.role === 'mentor') {
      await updatedUser?.populate({
        path: 'mentoring',
        select: 'projects students reviews rating',
        options: { limit: 4 }
      });
    }

    res.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Query too short' });
    }
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
      .select('name email avatar role skills university')
      .limit(20);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error searching users' });
  }
};

// Get all users (for connect page)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const {
      search,
      skills,
      role,
      university,
      sort = 'active',
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build query - only show verified users
    const query: any = {};
    if (User.schema.paths.isEmailVerified) {
      query.isEmailVerified = true;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } }
      ];
    }

    // Skills filter
    if (skills) {
      const skillsArray = (skills as string).split(',');
      query.skills = { $in: skillsArray };
    }

    // Role filter
    if (role) {
      query.role = role;
    }

    // University filter
    if (university) {
      query.university = university;
    }

    // Sort options
    let sortOption: any = {};
    switch (sort) {
      case 'experience':
        sortOption = { yearsOfExperience: -1 };
        break;
      case 'projects':
        sortOption = { 'projects.length': -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const users = await User.find(query)
      .select('-password')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('projects', 'title');

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID (for profile viewing)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('-password')
      .populate({
        path: 'projects',
        select: 'title description tags image createdAt',
        options: { limit: 10, sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Clean up expired OTPs (run this periodically)
export const cleanupExpiredOTPs = () => {
  const now = new Date();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
};

// Set up cleanup interval (run every 5 minutes)
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);