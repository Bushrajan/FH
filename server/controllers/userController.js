import User from '../models/User.js';
import cloudinary from '../utils/cloudinary.js';


// (view)
export const profile = (req, res) => {
  res.status(200).json({ success: true, user: req.user })
}

// user update (for self)

export const updateProfile = async (req, res) => {
  const userId = req.user._id;
  const { name, email, linkedin, portfolio, instagram, github, bio, profileImage } = req.body;

  try {
    let updateFields = {
      name,
      email,
      linkedin,
      portfolio,
      instagram,
      github,
      bio,
    };

    // Add image if exists
    if (profileImage) {
      updateFields.profileImage = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// user delete (logout wala scene hai)
export const logout = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Delete user image from Cloudinary if exists
    if (user && user.public_id) {
      try { await cloudinary.uploader.destroy(user.public_id); } catch (err) { }
    }

    // Delete user from DB
    await User.findByIdAndDelete(userId);


    res.status(200).json({
      success: true,
      message: 'User deleted and logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
