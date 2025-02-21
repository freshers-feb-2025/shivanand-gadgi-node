const express=require("express");
const router=express.Router();
const mysqlPool=require("../database/db");

const fs = require("fs");

const path=require('path');
const rootDir=require("../util/root_path");



router.get("/data", async (req, res) => {
    try {
        const [rows] = await mysqlPool.query("SELECT * FROM emp ORDER BY id ASC");
        res.json(rows);
    } catch (error) {
        res.status(404).send("Error fetching data!");
    }
});

router.get("/search", async (req, res) => {
    const nameToFind = req.query.name;
    if (!nameToFind) return res.status(400).send("Please provide a name to search.");
    
    try {
        const [rows] = await mysqlPool.query("SELECT * FROM emp WHERE name = ?", [nameToFind]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.send("Employee not found.");
        }
    } catch (error) {
        res.status(404).send("Error searching employee!");
    }
});

router.post("/submit",async (req,res)=>{
    const { name, city } = req.body;
    try {
        await mysqlPool.query("INSERT INTO emp (name, city) VALUES (?, ?)", [name, city]);
        res.send("Employee data saved successfully!");
    } catch (error) {
        res.status(404).send(error);
    }
});


router.put("/update", async (req, res) => {
    const { name, city } = req.body;
    if (!name || !city) return res.status(400).send("Name and City are required!");

    try {
        const [result] = await mysqlPool.query("UPDATE emp SET city = ? WHERE name = ?", [city, name]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Employee not found!");
        }
        res.send("Employee data updated successfully!");
    } catch (error) {
        res.status(404).send("Error updating data!");
    }
});




router.delete("/delete", async (req, res) => {
    const name = req.query.name;
    if (!name) return res.status(400).send("Please provide a name to delete.");

    try {
        const [result] = await mysqlPool.query("DELETE FROM emp WHERE name = ?", [name]);
        if (result.affectedRows === 0) {
            return res.status(404).send("Employee not found!");
        }
        res.send("Employee deleted successfully!");
    } catch (error) {
        res.status(404).send("Error deleting employee!");
    }
});


router.get("/",(req,res)=>{
    res.sendFile(path.join(rootDir, "views","ui.html"));
});

module.exports=router