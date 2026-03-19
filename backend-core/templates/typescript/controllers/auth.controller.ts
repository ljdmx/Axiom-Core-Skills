// TEMPLATE_META:START
/*
@template-id: auth-controller
@version: 2.0.0
@description: Production-ready JWT authentication with refresh tokens, password hashing, and security best practices
@design-level: Enterprise (Security-first)
@customization-points: USER_MODEL, TOKEN_EXPIRY, ADDITIONAL_FIELDS, REFRESH_TOKEN
@dependencies: jsonwebtoken, bcryptjs, @prisma/client, zod
@framework: Express + Prisma
@security-features: Bcrypt hashing, JWT + Refresh tokens, Rate limiting ready, Input validation
@estimated-time-saving: 20 minutes
*/
// TEMPLATE_META:END

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { success, error } from '../utils/response';

const prisma = new PrismaClient();

// CUSTOMIZATION_POINT:START - TOKEN_EXPIRY
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '{{JWT_EXPIRES_IN}}' || '7d';
const REFRESH_TOKEN_EXPIRES_IN = '{{REFRESH_TOKEN_EXPIRES_IN}}' || '30d';
// CUSTOMIZATION_POINT:END

// CUSTOMIZATION_POINT:START - USER_MODEL
const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    // CUSTOMIZATION_POINT: Add additional fields
    // role: z.enum(['USER', 'ADMIN']).optional(),
});

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
// CUSTOMIZATION_POINT:END

/**
 * Generate JWT access token
 */
function generateAccessToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
}

/**
 * Generate refresh token
 */
function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });
}

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response) => {
    try {
        const data = RegisterSchema.parse(req.body);

        // Check if user already exists
        const existingUser = await prisma.{{ USER_MODEL_LOWER }
    }.findUnique({
        where: { email: data.email }
    });

    if (existingUser) {
        return error(res, 'Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.{{ USER_MODEL_LOWER }
}.create({
    data: {
        ...data,
        password: hashedPassword
    },
    select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
        // CUSTOMIZATION_POINT: Add additional fields to select
    }
});

// Generate tokens
const accessToken = generateAccessToken(user.id, user.email);
const refreshToken = generateRefreshToken(user.id);

// CUSTOMIZATION_POINT:START - REFRESH_TOKEN
// Optional: Store refresh token in database for revocation
// await prisma.refreshToken.create({
//   data: { token: refreshToken, userId: user.id }
// });
// CUSTOMIZATION_POINT:END

return success(res, {
    user,
    accessToken,
    refreshToken
}, 'Registration successful', 201);

  } catch (err: any) {
    return error(res, err.message, 400, err);
}
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response) => {
    try {
        const data = LoginSchema.parse(req.body);

        // Find user
        const user = await prisma.{{ USER_MODEL_LOWER }
    }.findUnique({
        where: { email: data.email }
    });

    if (!user) {
        return error(res, 'Invalid email or password', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
        return error(res, 'Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return success(res, {
        user: userWithoutPassword,
        accessToken,
        refreshToken
    }, 'Login successful');

} catch (err: any) {
    return error(res, err.message, 400, err);
}
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return error(res, 'Refresh token required', 400);
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
            userId: string;
            type: string;
        };

        if (decoded.type !== 'refresh') {
            return error(res, 'Invalid token type', 401);
        }

        // CUSTOMIZATION_POINT:START - REFRESH_TOKEN
        // Optional: Check if refresh token exists in database
        // const storedToken = await prisma.refreshToken.findUnique({
        //   where: { token: refreshToken }
        // });
        // if (!storedToken) {
        //   return error(res, 'Invalid refresh token', 401);
        // }
        // CUSTOMIZATION_POINT:END

        // Get user
        const user = await prisma.{{ USER_MODEL_LOWER }
    }.findUnique({
        where: { id: decoded.userId }
    });

    if (!user) {
        return error(res, 'User not found', 404);
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.email);

    return success(res, {
        accessToken: newAccessToken
    }, 'Token refreshed');

} catch (err: any) {
    return error(res, 'Invalid or expired refresh token', 401, err);
}
};

/**
 * Get current user profile
 * GET /api/auth/me
 * Requires authentication middleware
 */
export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        // Assuming authMiddleware sets req.user
        const userId = (req as any).user?.userId;

        if (!userId) {
            return error(res, 'Unauthorized', 401);
        }

        const user = await prisma.{{ USER_MODEL_LOWER }
    }.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            createdAt: true
            // CUSTOMIZATION_POINT: Add additional fields
        }
    });

    if (!user) {
        return error(res, 'User not found', 404);
    }

    return success(res, user);

} catch (err: any) {
    return error(res, err.message, 500, err);
}
};

/**
 * Logout user
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        // CUSTOMIZATION_POINT:START - REFRESH_TOKEN
        // Optional: Revoke refresh token from database
        // if (refreshToken) {
        //   await prisma.refreshToken.delete({
        //     where: { token: refreshToken }
        //   });
        // }
        // CUSTOMIZATION_POINT:END

        return success(res, null, 'Logout successful');

    } catch (err: any) {
        return error(res, err.message, 500, err);
    }
};

/**
 * Change password
 * POST /api/auth/change-password
 * Requires authentication
 */
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return error(res, 'Current and new password required', 400);
        }

        if (newPassword.length < 8) {
            return error(res, 'New password must be at least 8 characters', 400);
        }

        // Get user
        const user = await prisma.{{ USER_MODEL_LOWER }
    }.findUnique({
        where: { id: userId }
    });

    if (!user) {
        return error(res, 'User not found', 404);
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
        return error(res, 'Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.{ { USER_MODEL_LOWER } }.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });

    return success(res, null, 'Password changed successfully');

} catch (err: any) {
    return error(res, err.message, 500, err);
}
};
