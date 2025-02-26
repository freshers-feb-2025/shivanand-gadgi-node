const express=require("express");
const bcrypt = require("bcryptjs");
const router=express.Router();
const Employee=require("../models/employee");
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
   /* if (req.session.user) {
        next(); // Proceed to the next function
    } else {
        res.status(401).json({ error: "Unauthorized. Please log in!" });
    }*/

        const token = req.signedCookies["auth_token"]; // Get signed cookie

        if (!token) return res.status(401).json({ error: "Unauthorized! Please log in." });
    
        jwt.verify(token, "mysecretkey12345", (err, decoded) => {
            if (err) return res.status(401).json({ error: "Invalid token!" });
    
            req.user = decoded; // Attach user info to request
            next();
        });
};

const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: "Unauthorized!" });

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden! You do not have permission." });
        }

        next();
    };
};

const checkAuthCookie = (req, res, next) => {
    const authToken = req.cookies["auth_token"]; // Get auth token from cookie

    if (!authToken) {
        return res.status(401).json({ error: "Unauthorized! No auth token found." });
    }

    next(); // If token exists, proceed
};

router.post("/register", async (req, res) => {
    try {
        const { name, email, password,role } = req.body;

        // Check if the user already exists
        const existingUser = await Employee.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered!" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await Employee.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(404).json({ error: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await Employee.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        const token = jwt.sign({ id: user.id, email: user.email,role:user.role, }, "mysecretkey12345", { expiresIn: "1h" });

        // Store user info in session (Temporary - We will replace this with JWT later)
        /*req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
        };*/

        res.cookie("auth_token", token, {
            httpOnly: true, 
            secure: false,
            signed: true,
            maxAge: 3600000, // Expiry in 1 hour
        });

        res.json({ message: "Login successful!", user: req.user });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(404).json({ error: "Internal server error" });
    }
});

router.post("/logout", (req, res) => {

    const token = req.signedCookies["auth_token"];
    if (!token) {
        return res.status(400).json({ error: "You are not logged in!" }); // No token means not logged in
    }
    res.clearCookie("auth_token"); // Remove JWT token from the cookie
    res.json({ message: "Logout successful!" }); // Confirm logout
    /*req.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Logout failed!" });
        }
        res.clearCookie("auth_token"); 
        res.json({ message: "Logout successful!" });*/
        
 
   

});

router.get("/check-cookie", (req, res) => {
    
    const token = req.signedCookies["auth_token"];
    const decoded = jwt.verify(token, "mysecretkey12345"); // ✅ Use same secret key as in login
    if (!token) {
        return res.status(400).json({ error: "No auth cookie found!" });
    }
    res.json({ message: "Cookie found!", User : decoded });
});




router.get("/profile", isAuthenticated, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});

router.get("/allemployees", isAuthenticated, authorize(["member"]), async (req, res) => {
    const employees = await Employee.findAll();
    res.json({ employees });
});


module.exports = router;
