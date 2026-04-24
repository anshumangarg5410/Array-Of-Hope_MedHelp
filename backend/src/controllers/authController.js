const Patient = require('../models/Patient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, ...rest } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await Patient.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new Patient({
      name,
      email,
      password: hashedPassword,
      ...rest
    });

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User registered successfully",
      user: userResponse
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message, stack: error.stack });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await Patient.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({
      message: "Login successful",
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
  try {
    // JWT logout is typically handled client-side by deleting the token.
    // Returning success to confirm the endpoint works.
    return res.json({ message: "Logout successful. Please remove token on the client side." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
