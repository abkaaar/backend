const Booking = require("../models/Booking"); // Assuming your model is in a 'models' directory
const Space = require("../models/Space"); // To check space availability
const paystackApi = require("../api/paystackApi");

// Create a new booking
exports.createBooking = async (req, res) => {
  const { user_id, space_id, name, phoneNumber, email, startDate, totalPrice } = req.body;
  
  // console.log(user_id, space_id, name, phoneNumber, email, startDate, totalPrice);
  // Generate a unique reference for the transaction
  const reference = `booking_${Date.now()}`;

  try {
    const space = await Space.findById(space_id);
    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }
    const newBooking = new Booking({
      name,
      phoneNumber,
      email,
      user_id,
      space_id,
      totalPrice,
      startDate,
      reference,
      paymentStatus: "Pending",
    });

    const savedBooking = await newBooking.save();

    // Initialize payment with split
   const paymentDetails = {

      callback_url: `${process.env.PAYSTACK_CALLBACK_URL}/verify-payment`, // Replace with actual callback URL
      email: email,
      amount: totalPrice * 100, // Amount in kobo (or cents)
      reference,
      subaccount: space.paystackSubaccountId, // Space manager's subaccount ID
      // bearer: "account", // Indicates split logic
    };
    
    // Log the payment details for debugging
    // console.log("Payment details:", paymentDetails);

    const response = await paystackApi.initializePayment(paymentDetails)


    // Log full response from Paystack
    console.log("Paystack response:", response);

    if (!response || !response.authorization_url) {
      throw new Error("Payment URL not returned");
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
      authorization_url: response.authorization_url, // URL to redirect for payment
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Error creating booking", error });
  }
};

// Payment Verification Endpoint
exports.verifyPayment = async (req, res) => {
  const reference = req.query.reference;

  if (!reference) {
    return res.status(400).json({ message: 'Missing transaction reference' });
  }

  try {
    const verificationResponse = await paystackApi.verifyPayment(reference);

    // Log full verification response
    console.log("Verification response:", verificationResponse);

    const transactionStatus = verificationResponse.status;

    if (transactionStatus !== 'success') {
      return res.status(400).json({ message: `Transaction failed with status: ${transactionStatus}` });
    }

    const booking = await Booking.findOne({ reference});

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
     // Update booking status to 'Completed'
     booking.paymentStatus = 'Completed';
     await booking.save();

    res.status(200).json({
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Error verifying payment", error });
  }
};



// get bookings of a manager's spaces
exports.getBookings = async (req, res) => {
  try {
    const managerId = req.user._id; // Assuming the manager's ID is in req.user after authentication

    // Find all spaces managed by the manager
    const spaces = await Space.find({ user_id: managerId }).select("_id");

    // Extract the space IDs into an array
    const spaceIds = spaces.map((space) => space._id);

    // Find bookings for the extracted space IDs
    const bookings = await Booking.find({ space_id: { $in: spaceIds } })
      .populate("user_id", "name email") // Optional: Populate user details
      .populate("space_id", "name address"); // Optional: Populate space details

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "bookings retrieved successfully",
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "user_id space_id"
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
};

// Update booking status (confirm/cancel)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking", error });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
};
