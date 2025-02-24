const express=require("express");
const router=express.Router();
const Customer=require("../models/customer");
const Order=require("../models/order");
const Item=require("../models/item");
const Profile=require("../models/profile");



router.get("/customers", async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(404).json({ error: 'Something went wrong!' });
    }
});

router.get("/customers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.status(200).json(customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(404).json({ error: "Something went wrong!" });
    }
});

router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(404).json({ error: 'Something went wrong!' });
    }
});

router.get("/customers/:id/orders", async (req, res) => {
    try {
        const { id } = req.params;

        //It's Similar to (SELECT * FROM orders WHERE customerID = 1);
        // Fetch orders belonging to the specific customer
        const orders = await Order.findAll({ where: { customerId: id } });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(404).json({ error: "Something went wrong!" });
    }
});

router.get("/customers-with-orders", async (req, res) => {
    try {
        const customers = await Customer.findAll({include: [Order]});

        res.status(200).json(customers);
    } catch (error) {
        console.error("Error fetching customers with orders:", error);
        res.status(404).json({ error: "Something went wrong!" });
    }
});

router.post("/customers", async (req, res) => {
    try {
        const { name, email } = req.body;

        // Create a new customer
        const newCustomer = await Customer.create({ name, email });

        res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(404).json({ error: "Something went wrong!" });
    }
});

router.post("/order", async (req, res) => {
    try {
        const { customerId, total, address, phone, item, } = req.body;

      
        const customer = await Customer.findByPk(customerId);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        await customer.createOrder({total});
        await customer.createProfile({address, phone});
        await customer.addItem(item);


        res.status(201).json({ message: "Order created and linked to customer" });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(404).json({ error: "Something went wrong!" });
    }
});

router.put("/customers", async (req, res) => {
    try {
        const { id, name } = req.body;

        if (!id || !name) {
            return res.status(400).json({ error: "Customer ID and name are required" });
        }

        // Update customer name
        const [updated] = await Customer.update({ name }, { where: { id } });

        if (!updated) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.status(200).json({ message: "Customer updated successfully" });
    } catch (error) {
        console.error("Error updating customer:", error);
        res.status(404).json({ error: "Something went wrong!" });
    }
});

router.delete("/customers", async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Customer ID is required" });
        }

        // Delete customer
        const deleted = await Customer.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(404).json({ error: "Something went wrong!" });
    }
});









module.exports=router