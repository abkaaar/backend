const Space = require("../models/Space");
const cloudinary = require('../config/cloudinary');
const { asyncHandler } = require("../middlewares/error");
const User = require("../models/User")

// user/manager spaces

// Add Space
module.exports.addSpace = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    address,
    capacity,
    amenities,
    price,
    term,
    type,
    availability,
  } = req.body;
  const user_id = req.user._id;
  // const { path, filename } = req.file;

  // Verify that files are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one image is required.',
    });
  }


  // Handle multiple file uploads
  const images = req.files.map((file) => ({
    public_id: file.filename, // Cloudinary or multer file name
    url: file.path, // Cloudinary or multer file path
  }));

   // Fetch the user's subaccount ID
   const user = await User.findById(user_id);
   if (!user || !user.paymentDetails.paystackSubaccountId) {
       return res.status(400).json({ message: 'Subaccount ID not found for this user' });
   }

    const newSpace = new Space({
      name,
      description,
      address,
      capacity,
      amenities, // Make sure it's an array,
      price,
      type,
      term,
      images,
      // image: {
      //   public_id: filename,
      //   url: path,
      // },
      availability,
      user_id,
      paystackSubaccountId: user.paymentDetails.paystackSubaccountId,  // Set subaccount ID
      createdBy: req.user.id,
      manager: req.user.id,
    });

    const space = await newSpace.save();

    res.status(200).json({
      success: true,
      message: "Space added successfully",
      data: space,
    });
  });

// Edit space
module.exports.editSpace = asyncHandler(async (req, res) => {
  
    const { id } = req.params;

    // Find the space to update
    const space = await Space.findById(id);
    if (!space) {
      console.log({message: "space not found"})
      return res.status(404).json({ message: "Space not found" });
    }
    const {
      name,
      description,
      capacity,
      address,
      price,
      type,
      term,
      availability,
      amenities,
    } = req.body;

     console.log("Amenities:", amenities);

    space.name = name || space.name;
    space.description = description || space.description;
    space.capacity = capacity || space.capacity;
    space.address = address || space.address;
    space.price = price || space.price;
    space.type = type || space.type;
    space.term = term || space.term;
    space.availability = availability || space.availability;
    space.amenities = JSON.parse(amenities) || space.amenities;

    // If a file is uploaded, update the image field
    // if (req.file) {
    //   space.image = req.file.path; // Assuming multer saves the file path in req.file
    // }
    // If multiple files are uploaded, update the images field
    if (req.files && req.files.length > 0) {
      space.images = req.files.map((file) => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    // Save the updated space
    const updatedSpace = await space.save();

    res.status(200).json({
      success: true,
      message: "Space updated successfully",
      space: updatedSpace,
    });
  });

// delete space
// module.exports.deleteSpace = async (req, res) => {
//   try {
//     const deletedSpace = await Space.findByIdAndDelete(req.params.id);
//     // console.log("the params id is: ",req.params.id)
//     if (!deletedSpace) {
//       return res.status(404).json({ message: "Space not found" });
//     }
//     res
//       .status(200)
//       .json({ success: true, message: "Space deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting space:", error.message); // Log the exact error message
//     res.status(400).json({ error: error.message });
//   }
// };

module.exports.deleteSpace = asyncHandler(async (req, res) => {
  
    // Find the space by ID to get the image information
    const space = await Space.findById(req.params.id);
    
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    // Delete the image from Cloudinary if it exists
    if (space.image && space.image.public_id) {
      await cloudinary.uploader.destroy(space.image.public_id);
    }

    // Delete the space from the database
    await Space.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Space deleted successfully" });
  } );

// Get all user spaces
module.exports.getUserSpaces = asyncHandler( async (req, res) => {
  const user_id = req.user._id;

    // Find all spaces created by the user
    const userSpaces = await Space.find({ user_id })
      .populate("createdBy", "user_id")
      .sort({ createdAt: -1 });


    if (userSpaces.length === 0) {
      return res.status(304).json({
        success: false,
        message: "No spaces found for this user",
      });
    }
    res.status(200).json({
      success: true,
      message: "Spaces retrieved successfully",
      data: userSpaces,
    });
  });

// general

// Get a space
module.exports.getSpace = asyncHandler(async (req, res) => {
  
    const space = await Space.findById(req.params.id);
    return res.status(200).json(space);
  });

// Get over all spaces
module.exports.getAllSpaces = asyncHandler(async (req, res) => {

    // Find all spaces created by the user
    const allSpaces = await Space.find().populate('address', 'address');


    if (allSpaces.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No spaces found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Spaces retrieved successfully",
      data: allSpaces,
    });
    console.log(allSpaces)
  });

// Search spaces
module.exports.searchSpaces = asyncHandler(async (req, res) => {
  
    const { address } = req.query; // Get address from query params

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "address is required to perform the search",
      });
    }

    // Perform a case-insensitive search for spaces by address
    const spaces = await Space.find({
      address: { $regex: new RegExp(address, "i") },
    }).populate('address', 'address');

    if (spaces.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No spaces found at this address",
      });
    }

    res.status(200).json({
      success: true,
      message: "Spaces retrieved successfully",
      data: spaces,
    });
  });
  

  // get spaces by type
// module.exports.getSpacesByType = asyncHandler(async (req, res) => {
  
//   const { type } = req.query; // Get type from query params

//   console.log("Received type:", type); // Log the received type

//   if (!type) {
//     return res.status(400).json({
//       success: false,
//       message: "type is required to perform the parameter",
//     });
//   }

//   // Perform a case-insensitive search for spaces by address
//   const spaces = await Space.find({
//     type: { $regex: new RegExp(`^${type}$`) },
//   });

//   if (spaces.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "No spaces found for this type",
//     });
//   }

//   res.status(200).json({
//     success: true,
//     message: "Spaces retrieved successfully",
//     data: spaces,
//   });
// });
