const express=require("express");
const bcrypt = require("bcryptjs");
const router=express.Router();
const Employee=require("../model/employee");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "secret_key";

const isAuthenticated = (req, res, next) => {
    const token = req.signedCookies["userToken"];

    if (!token) return res.status(401).json({ error: "Unauthorized. Please log in." });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
    }
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


router.post("/register",async (req,res)=>{

    try{
            const {name,email,password,role}=req.body;
            const existingUser=await Employee.findOne({where:{email}});
            if(existingUser) return res.status(400).json({error:"Email already registered"});

            const hashedPassword=await bcrypt.hash(password, 10);

            const newUser = await Employee.create({
                name,
                email,
                password:hashedPassword,
                role
            });

            res.status(201).json({ message: "User registered successfully!", user: newUser });


    }catch(error){
        console.error("Error in registration:", error);
        res.status(404).json({ error: "Something went wrong" });
    }

});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await Employee.findOne({ where: { email } });
        if (!existingUser) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

        const token = jwt.sign(
            { id: existingUser.id, name: existingUser.name, role: existingUser.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.cookie("userToken", token , { httpOnly: true, signed: true, maxAge: 3600000 });

        res.json({ message: "Login successful!" });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(404).json({ error: "Something went wrong" });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("userToken");
    res.json({ message: "Logout successful!" });
});

router.get("/admin/users", isAuthenticated, authorize(["admin"]), async (req, res) => {
    try {
        const users = await Employee.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(404).json({ error: "Something went wrong" });
    }
});

router.get("/user/profile", isAuthenticated, async (req, res) => {
    try {
        const user = await Employee.findOne({ where: { id: req.user.id } });
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(404).json({ error: "Something went wrong" });
    }
});


module.exports = router;
