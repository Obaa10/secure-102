import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import marksRoutes from "./routes/marksRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

class App {
  constructor() {
    this.app = express();
  }

  async connectToDatabase() {
    try {
      const DB = process.env.DATABASE.replace(
        "<password>",
        process.env.DATABASE_PASSWORD
      );
      mongoose
        .connect(DB)
        .then(() => console.log("DB connection went successful!"));
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Error connecting to MongoDB:", err.message);
    }
  }

  setMiddleware() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use((err, req, res, next) => {
      console.error("Error:", err.message);
      console.error("Error Location:", err.stack);
      res.status(500).send("Something went wrong!");
    });
  }

  setRoutes() {
    this.app.use("/user", userRoutes);
    this.app.use("/profile", profileRoutes);
    this.app.use("/project", projectRoutes);
    this.app.use("/marks", marksRoutes);
    this.app.use("/certificate", certificateRoutes);
  }

  startServer(port) {
    this.app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }

  async initializeApp(port) {
    await this.connectToDatabase();
    this.setMiddleware();
    this.setRoutes();
    this.startServer(port);
  }
}

export default App;
