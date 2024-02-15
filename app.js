const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./src/routes/user");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/v1/user", userRoutes);

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
// app.post("/storages", authenticate, async (req, res) => {
//   const { name, description, location } = req.body;

//   try {
//     const storage = await Storage.create({
//       user_id: req.user.id,
//       name,
//       description,
//       location,
//     });
//     res.status(200).json(storage);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

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
// app.put("/storages/:id", authenticate, async (req, res) => {
//   const storageId = req.params.id;
//   const { name, description, location } = req.body;

//   try {
//     const storage = await Storage.findOne({
//       where: { id: storageId, user_id: req.user.id },
//     });

//     if (!storage) {
//       return res.status(404).json({ message: "Storage not found" });
//     }

//     storage.name = name || storage.name;
//     storage.description = description || storage.description;
//     storage.location = location || storage.location;
//     await storage.save();

//     res.status(200).json(storage);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

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
// app.delete("/storages/:id", authenticate, async (req, res) => {
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
// });

/**
 * Handles 404 Not Found
 */
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

/**
 * Error handling middleware
 */
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(3000, () => console.log("Server started on port 3000"));
