const express=require("express");
const bcrypt = require("bcryptjs");
const router=express.Router();
const Employee=require("../model/employee");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');

const SECRET_KEY = "secret_key";

router.post("/register", [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Invalid email format").custom(async (value)=>{
        email=value;
        const existingUser=await Employee.findOne({where:{email}});
        if(existingUser) throw new Error("Email already registered");
        return true;
    }),
    check("password").custom((value)=>{
        if(!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)){
            throw new Error('Password must include at least one uppercase letter, one number, and one special character');
        }
        return true;
}),
    check("role").isIn(["admin", "member"]).withMessage("Role must be either 'admin' or 'user'"),
   
] ,async (req,res)=>{

    try{

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {name,email,password,role}=req.body;
            

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




module.exports = router;
