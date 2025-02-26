const express=require("express");
const router=express.Router();
const fs = require("fs");

const path=require('path');
const rootDir=require("../util/root_path");

router.get("/data", (req, res) => {
    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) {
            return res.status(404).send("Error reading data!");
        }
        res.send(data);
    });
});

router.get("/search", (req, res) => {
    const nameToFind = req.query.name;

    if (!nameToFind) {
        return res.status(400).send("Please provide a name to search.");
    }

    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) {
            return res.status(404).send("Error reading file.");
        }

        const records = data.split("\n").filter(line => line.trim() !== ""); // Remove empty lines
        const matchedRecord = records.find(line => line.includes(`Name: ${nameToFind},`));

        if (matchedRecord) {
            res.send(matchedRecord); // Send found record
        } else {
            res.send("Employee not found.");
        }
    });
});

router.post("/submit",(req,res)=>{
    const { name, phone } = req.body;
    const entry = `Name: ${name}, Phone: ${phone}\n`;
    
    fs.appendFile("data.txt", entry, (err) => {
        if (err) {
            res.status(404).send("Error saving data!");
        } else {
            res.send("Employee data saved successfully!");
        }
    });
});


router.put("/update", (req, res) => {
    const { name, phone } = req.body;

    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) return res.status(404).send("Error reading data!");

        let lines = data.split("\n");
        let updatedData = "";
        let found = false;

        lines.forEach(line => {
            if (line.startsWith(`Name: ${name},`)) {
                updatedData += `Name: ${name}, Phone: ${phone}\n`;  // Update phone
                found = true;
            } else {
                updatedData += line + "\n";  // Keep other lines unchanged
            }
        });

        if (!found) return res.status(404).send("Employee not found!");

        fs.writeFile("data.txt", updatedData.trim(), err => {
            if (err) return res.status(404).send("Error updating data!");
            res.send("Employee data updated successfully!");
        });
    });
});




router.delete("/delete", (req, res) => {
    const nameToDelete = req.query.name?.trim(); // Remove extra spaces

    if (!nameToDelete) {
        return res.status(400).send("Please provide a name to delete.");
    }

    fs.readFile("data.txt", "utf8", (err, data) => {
        if (err) {
            return res.status(404).send("Error reading file.");
        }

        let records = data.split("\n").filter(line => line.trim() !== ""); // Remove empty lines
        let found = false;

        const updatedRecords = records.filter(line => {
            const match = line.match(/^Name:\s*(.*?),\s*Phone:/); // Extract name correctly
            if (match && match[1].trim() === nameToDelete) {
                found = true;
                return false; // Remove this line (delete it)
            }
            return true;
        });

        if (!found) {
            return res.status(404).send(`Employee '${nameToDelete}' not found.`);
        }

        fs.writeFile("data.txt", updatedRecords.join("\n") + "\n", (err) => {
            if (err) {
                return res.status(404).send("Error updating file.");
            }
            res.send(`Employee '${nameToDelete}' deleted successfully.`);
        });
    });
});


router.get("/",(req,res)=>{
    res.sendFile(path.join(rootDir, "views","ui.html"));
});

module.exports=router