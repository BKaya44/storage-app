const { Storage, Item } = require("../models/storage");
const Sequelize = require("sequelize");

const createItemStorage = async (req, res) => {
  const storageId = req.params.id;
  const { name, description, amount } = req.body;

  try {
    const storage = await Storage.findOne({
      where: { id: storageId, user_id: req.user.id },
    });

    if (!storage) {
      return res.status(404).json({ message: "Storage not found" });
    }

    const newStorageItem = await Item.create({
      user_id: req.user.id,
      storage_id: storageId,
      name,
      description,
      amount,
    });

    res.status(200).json(newStorageItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewItem = async (req, res) => {
  const storageItemId = req.params.id;
  //TODO: User check
  try {
    const item = await Item.findOne({
      attributes: ["name", "description", "amount", "created_at"],
      where: { id: storageItemId },
    });
    if (item === null) {
      return res.status(404).json({ message: "Item does not exist." });
    }

    res.status(200).json(item);
  } catch (error) {
    if (error instanceof Sequelize.EmptyResultError) {
      return res.status(404).json({ message: "Item does not exist." });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

const viewStorageItems = async (req, res) => {
  const storageId = req.params.id;

  try {
    const storage = await Storage.findOne({
      where: { id: storageId, user_id: req.user.id },
    });

    if (storage === null) {
      return res.status(404).json({ message: "Storage does not exist." });
    }

    const item = await Item.findAll({
      attributes: ["id", "name", "description", "amount", "created_at"],
      where: { storage_id: storage.id },
    });

    if (item === null) {
      return res.status(404).json({ message: "Item does not exist." });
    }

    res.status(200).json(item);
  } catch (error) {
    if (error instanceof Sequelize.EmptyResultError) {
      return res.status(404).json({ message: "Item does not exist." });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { createItemStorage, viewItem, viewStorageItems };
