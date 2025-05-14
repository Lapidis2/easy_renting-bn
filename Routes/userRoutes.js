const express = require("express");
const userController = require("../Controller/userController");
const authMiddleware = require("../middleware/verifyToken");
const verifyUserRole = require("../middleware/verifyUserRole");
const router = express.Router();

router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware, userController.updateUserProfile);
router.delete("/profile", authMiddleware, userController.deleteUser);
router.post("/signup", userController.signup);
router.get("/confirm-email/:token", userController.confirmEmail);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.delete("/user/:id",  userController.deleteUser);
router.put("/user/:id", userController.updateUserInformation);
router.put("/user/:id/role",  userController.updateUserRole);
router.put("/user/:id/status",  userController.toggleUserStatus);
router.post("/message-to-user/:id",  userController.sendMessageToUser);
router.get("/users", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);
router.get("/session", userController.getSessionData);
router.post("/request-password-reset", userController.requestPasswordReset);
router.post("/reset-password/:token", userController.resetPassword);
router.get("/restricted", verifyUserRole(["admin"]), userController.restricted);

module.exports = router;