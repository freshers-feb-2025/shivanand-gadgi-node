const express=require("express");
const router=express.Router();
const Employee=require("../models/employee");

router.get("/employees", async (req, res) => {
    try {
        const customers = await Employee.findAll();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(404).json({ error: 'Something went wrong!' });
    }
});



module.exports=router