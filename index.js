const express = require("express");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// app configuration
const app = express();
const port = 1100;

// middleware configuration
app.use(express.json());

// MongoDb Connection
mongoose.connect(process.env.URL).then(()=>{
    console.log("Database Connected");
}).catch(error=>{
console.error("Error Database connecting",error)
});

// Define Schema
const itemSchema= mongoose.Schema({
name:{type: String, required: true}
});

// Create model
const Item = mongoose.model("Item", itemSchema);





// Api routes
app.get("/api/v1/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching item", error);
        res.status(500).json({ msg: "Error fetching item" });
    }
});

app.post("/api/v1/items", async (req, res) => {
    const newItem = await Item({ name: req.body.name });
    try {
        const savedItem = await newItem.save();
        if (savedItem) {
            res.status(201).json(savedItem)
        } else {
            res.status(404).json({ msg: "item not saved" });
        }
    } catch (error) {
        console.error("Error saving item", error);
        res.status(500).json({ msg: "Error saving item" });
    }
});

app.put("/api/v1/items/:id", async (req, res) => {
    try {
        const updateItem = await Item.findByIdAndUpdate(
            req.params.id, { name: req.body.name }, { new: true }
        );
        if (updateItem) {
            res.status(200).json(updateItem)
        } else {
            res.status(404).json({ msg: "item not updated" });
        }
    } catch (error) {
        console.error("Error updating item", error);
        res.status(500).json({ msg: "Error saving item" });
    }
});

app.delete("/api/v1/items/:id", async (req, res) => {
    try {
        const deleteItem = await Item.findByIdAndDelete(req.params.id);
        if (deleteItem) {
            res.status(200).json(deleteItem)
        } else { res.status(404).json({ msg: "item not deleted" }) }
    } catch (error) {
        console.error("Error deleteing item", error);
        res.status(500).json({ msg: "Error deleting item" });
    }
});


// listner
app.listen(port, () => {
    console.error(`Listning on port ${port}`);
});