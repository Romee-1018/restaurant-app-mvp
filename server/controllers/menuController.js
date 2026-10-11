const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

// Escape special regex characters so a search like "(" does not crash the server
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/menu?category=Mains&search=burger
const getMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };

    const items = await MenuItem.find(filter);
    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
};

// GET /api/menu/:id
const getMenuItemById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch menu item" });
  }
};

// POST /api/menu
const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, image, isSpecial, available } =
      req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, description, category and price are required",
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res
        .status(400)
        .json({ message: "Price must be a number and cannot be negative" });
    }

    const newItem = await MenuItem.create({
      name,
      description,
      category,
      price,
      image,
      isSpecial,
      available,
    });

    res.status(201).json(newItem);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to create menu item" });
  }
};

// PUT /api/menu/:id
const updateMenuItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    if (
      req.body.price !== undefined &&
      (typeof req.body.price !== "number" || req.body.price < 0)
    ) {
      return res
        .status(400)
        .json({ message: "Price must be a number and cannot be negative" });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Failed to update menu item" });
  }
};

// DELETE /api/menu/:id
const deleteMenuItem = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid menu item ID" });
    }

    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      message: "Menu item deleted successfully",
      item: deletedItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete menu item" });
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};