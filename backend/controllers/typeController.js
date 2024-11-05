import Type from "../models/type.js";

const addType = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const newType = new Type({ name });
    await newType.save();
    res.status(201).json({
      message: "Type added successfully",
      type: newType,
    });
  } catch (error) {
    console.error("Error adding type:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getTypes = async (req, res) => {
  try {
    const types = await Type.find({});
    res.status(200).json(types);
  } catch (error) {
    console.error("Error fetching types:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default { addType, getTypes };
