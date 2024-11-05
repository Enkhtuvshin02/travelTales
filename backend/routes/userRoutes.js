import express from "express";
import multer from "multer";
import userController from "../controllers/userController.js";
const router = express.Router();
const upload = multer({ dest: "uploads/" });
router.post(
  "/createUser",
  upload.single("profilePic"),
  userController.createUser
);
router.post(
  "/createUserGoogle",
  upload.none(),
  userController.createUserGoogle
);
router.put("/updateUser/:userId", upload.none(), userController.updateUser);
router.get(
  "/getUserData/:userId",
  upload.none(),
  userController.getUserDataById
);

router.get(
  "/getInitialUserData/:userId",
  upload.none(),
  userController.getInitialUserData
);
export default router;
