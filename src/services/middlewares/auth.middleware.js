import userModel from "../../models/user.model.js";

const authMiddleware = {};

authMiddleware.isAdmin = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

authMiddleware.isUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.role !== "user") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.error("Error in isUser middleware:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const isAdmin = authMiddleware.isAdmin;
export const isUser = authMiddleware.isUser;
