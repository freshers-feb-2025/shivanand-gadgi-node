const express=require("express");
const bcrypt = require("bcryptjs");
const router=express.Router();
const Employee=require("../model/employee");



const isAuthenticated = (req, res, next) => {

    if (!req.session.existingUser) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    next();
 };
 
 const authorize = (roles) => {
    return (req, res, next) => {
        if (!req.session.existingUser || !roles.includes(req.session.existingUser.role)) {
            return res.status(403).json({ error: "Access denied!" });
        }
        next();
    };
 };

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
        const user = await Employee.findOne({ where: { id: req.session.existingUser.id } });
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(404).json({ error: "Something went wrong" });
    }
});


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

router.post("/login",async (req,res)=>{
    
    try{
        const {email,password}=req.body;
        const existingUser=await Employee.findOne({where:{email}});
        if(!existingUser)return res.status(404).json({error:"User not found"});

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }


        req.session.existingUser = {
            id: existingUser.id,
            name: existingUser.name,
            role: existingUser.role,
        };

        res.cookie("userID", req.session.id , { httpOnly: true, signed: true, maxAge: 60000 });

        res.json({ message: "Login successful!" });


    }catch(error){
        console.error("Error in login:", error);
        res.status(404).json({ error: "Something went wrong" });
    }

});

router.post("/logout", (req, res) => {
    try {
       
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(404).json({ error: "Something went wrong" });
            }

            res.clearCookie("userID");

            res.json({ message: "Logout successful!" });
        });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(404).json({ error: "Something went wrong" });
    }
});




module.exports = router;
