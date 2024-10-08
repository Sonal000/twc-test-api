const express = require("express")
const contactController = require("./../controllers/contactController")
const authController = require("./../controllers/authController")



const router = express.Router();

router.post("/add",authController.protect, contactController.createContact);
router.get("/", authController.protect, contactController.getAllContacts);
router.post("/:contactID", authController.protect, contactController.updateContact);
router.delete("/:contactID", authController.protect, contactController.deleteContact);


module.exports = router
