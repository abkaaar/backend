const mongoose = require("mongoose");
const slugify = require("slugify");

const SpaceSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model for space managers
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  capacity: {
    type: Number,
  },
  amenities: {
    type: [String], // e.g., ['WiFi', 'Projector', 'Whiteboard']
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  images: [{
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },],
  availability: {
    type: String,
    enum: ["available", "unavailable", "reserved"],
    default: "available",
  },
  type: {
    type: String,
    enum: ["Office", "Coworking space", "Meeting room", "Conference room", "Event space", "Dedicated desk"],
    default: "Coworking space",
  },
  term: {
    type: String,
    enum: ["yearly", "monthly", "hourly", "daily"],
    default: "hourly",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true },
  paystackSubaccountId: { type: String, required: true },
  averageRating: { 
    type: Number, 
    min: 1, // Minimum value allowed is 1
    max: 5, // Maximum value allowed is 5
    default: 0, // Default to 0 until ratings are provided 
  },
});

// Pre-save middleware to generate the slug
SpaceSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, {
      lower: true, // Convert the slug to lowercase
      strict: true, // Remove any characters not suitable for URL slugs
      replacement: "-", // Replace spaces with dashes
    });
  }
  next();
});

const SpaceModel = mongoose.model("Space", SpaceSchema);

module.exports = SpaceModel;
