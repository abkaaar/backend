const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
   googleId: {
      type: String, // Stores the Google User ID
      unique: true,
   },

   provider: {
      type: String,
      enum: ['google', 'credential'], // To distinguish between Google and credential login
      default: 'credential',
   },

   name:{
      type: String,
      required: [true, "Your name is required"],
   },
   email:{
      type: String,
      required: [true, "Your email address is required"],
      unique: true,
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         "Please provide a valid email",
       ],
   },
   phone:{
      type: String,
      unique: true,
   },
   companyName:{
      type: String,
   },
   address:{
      type: String,
   },
   country:{
      type: String,
 
   },
   city:{
      type: String,
 
   }, 
   role: {
      type: String,
      enum: ['admin','host', 'customer'], // Define the possible roles
      default: 'customer', // Default role if not specified
   },
   createdAt: {
      type: Date,
      default: new Date(),
    },

   password:{
      type: String,
      minlength: 6,
      validate: {
         validator: function (value) {
            // Only required if provider is 'credential'
            return this.provider === 'google' || value;
         },
         message: "Your password is required",
      },
      
   },
   resetPasswordToken: String,
   resetPasswordExpire: Date,

   paymentDetails: {
      businessName: { type: String },
      bankAccountDetails: { type: String },
      bankName: { type: String },
      paystackSubaccountId: { type: String }, // store subaccount ID here
  }
});
  


UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);

   this.password = await bcrypt.hash(this.password, salt);
   next();
 });

 UserSchema.methods.matchPassword = async function (password) {
   return await bcrypt.compare(password, this.password);
 };

 UserSchema.methods.getSignedJwtToken = function () {
   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
     expiresIn: process.env.JWT_EXPIRE,
   });
 };

 UserSchema.methods.getResetPasswordToken = function () {
   const resetToken = crypto.randomBytes(20).toString("hex");
   // Hash token (private key) and save to database
   this.resetPasswordToken = crypto
     .createHash("sha256")
     .update(resetToken)
     .digest("hex");
 
   // Set token expire date
   this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
 
   return resetToken;
 };
 

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel