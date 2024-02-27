const { Storage } = require("../models/storage");
const Sequelize = require("sequelize");

/**
 * POST /storages
 * Creates a new storage.
 *
 * Body parameters:
 * - name (string): The name of the storage.
 * - description (string): Description of the storage.
 * - location (string): Location of the storage.
 *
 * Responses:
 * - 200 Created: Storage successfully created.
 * - 401 Unauthorized: Authentication token required.
 * - 403 Forbidden: Invalid authentication token.
 * - 500 Internal Server Error: Something went wrong.
 */
const createStorage = async (req, res) => {
  const { name, description, location } = req.body;
  if (
    typeof name === "undefined" ||
    typeof description === "undefined" ||
    typeof location === "undefined"
  ) {
    return res.status(409).json({ message: "Incorrect usage of API." });
  }

  try {
    const storage = await Storage.create({
      user_id: req.user.id,
      name,
      description,
      location,
    });
    return res.status(200).json(storage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /storages/:id
 * Edits an existing storage.
 *
 * Path parameters:
 * - id (string): The ID of the storage to edit.
 *
 * Body parameters:
 * - name (string): The new name of the storage (optional).
 * - description (string): The new description of the storage (optional).
 * - location (string): The new location of the storage (optional).
 *
 * Responses:
 * - 200 OK: Storage successfully updated.
 * - 401 Unauthorized: Authentication token required.
 * - 403 Forbidden: Invalid authentication token or not the owner of the storage.
 * - 404 Not Found: Storage not found.
 * - 500 Internal Server Error: Something went wrong.
 */
const editStorage = async (req, res) => {
  const storageId = req.params.id;
  const { name, description, location } = req.body;

  try {
    const storage = await Storage.findOne({
      where: { id: storageId, user_id: req.user.id },
    });

    if (!storage) {
      return res.status(404).json({ message: "Storage not found" });
    }

    storage.name = name || storage.name;
    storage.description = description || storage.description;
    storage.location = location || storage.location;
    await storage.save();

    return res.status(200).json(storage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /storages/:id
 * Deletes a storage.
 *
 * Path parameters:
 * - id (string): The ID of the storage to delete.
 *
 * Responses:
 * - 200 OK: Storage successfully deleted.
 * - 401 Unauthorized: Authentication token required.
 * - 403 Forbidden: Invalid authentication token or not the owner of the storage.
 * - 404 Not Found: Storage not found.
 * - 500 Internal Server Error: Something went wrong.
 */
// const editStorage = async (req, res) => {
//   const storageId = req.params.id;

//   try {
//     const storage = await Storage.findOne({
//       where: { id: storageId, user_id: req.user.id },
//     });

//     if (!storage) {
//       return res.status(404).json({ message: "Storage not found" });
//     }

//     await storage.destroy();
//     res.status(200).json({ message: "Storage deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const viewStorage = async (req, res) => {
  const storageId = req.params.id;
  try {
    const storage = await Storage.findOne({
      attributes: ["name","description","location","created_at"],
      where: { id: storageId, user_id: req.user.id },
    });

    if (storage === null) {
      return res.status(404).json({ message: "Storage does not exist." });
    }

    res.status(200).json(storage);
  } catch (error) {
    if (error instanceof Sequelize.EmptyResultError) {
      return res.status(404).json({ message: "Storage does not exist." });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

const viewAllStorage = async (req, res) => {
  try {
    const storage = await Storage.findAll({
      attributes: ["name","description","location","created_at"],
      where: { user_id: req.user.id },
    });

    if (storage === null) {
      return res.status(404).json({ message: "Storage does not exist." });
    }
    
    return res.status(200).json(storage);
  } catch (error) {
    if (error instanceof Sequelize.EmptyResultError) {
      return res.status(404).json({ message: "User does not have any storages." });
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = { createStorage, editStorage, viewStorage, viewAllStorage };
