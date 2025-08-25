export const isAdmin = (req, res, next) => {
    
  try {
    if (req.user && req.user.role === 'admin') {
        console.log(req.user);
        
      next(); //agr to user admin goha tabhi wo route ko accesskar payega
    } else {
      return res.status(403).json({ message: "Access denied: You are not admin. do not come here again." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error , failed to fetch Admin", error: error.message });
  }
};
