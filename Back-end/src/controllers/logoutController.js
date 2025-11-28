const logout = (req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).json({error: "Logout failed"});
        res.clearCookie("connect.sid"); //default session cookie
        res.json({ message: "Logged out successfully"});
    });
};

export {logout};