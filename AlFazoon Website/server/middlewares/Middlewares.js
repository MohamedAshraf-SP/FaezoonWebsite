// auth

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.secretKey);
        req.user = verified; // Attach user info to request object
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};


//user role


export const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions' });
        }
        next();
    };
};

 