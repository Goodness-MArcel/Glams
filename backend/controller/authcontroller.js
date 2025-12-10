import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../supabase/config.js';


export const AdminLogin = async (req, res) => {
    console.log("AdminLogin called:", req.body);
    const { email, password } = req.body;
    
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Check if user exists in Supabase
        const { data: user, error: userError } = await supabase
            .from('Admins') // Assuming you have an 'admins' table
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                role: 'admin'
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { 
                expiresIn: '24h' 
            }
        );

        // Remove password from user object before sending response
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getProfile = async (req, res) => {
    try {
        // req.user is set by verifyToken middleware
        const { id, email, role } = req.user;

        // Get full user details from database
        const { data: user, error } = await supabase
            .from('Admins')
            .select('id, email, name, created_at')
            .eq('id', id)
            .single();

        if (error || !user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}