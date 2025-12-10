import { supabase } from "../supabase/config";  

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
};