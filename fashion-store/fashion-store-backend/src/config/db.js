// src/config/db.js
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing in env");
  const dbName = process.env.MONGO_DB_NAME || "auralifestyle";

  // Recommended mongoose options for stable connection
  mongoose.set("strictQuery", true);

  const opts = {
    dbName,
    // Keep these options explicit for clarity (modern mongoose doesn't need them but harmless)
    // useNewUrlParser/useUnifiedTopology are defaulted in newer mongoose releases
  };

  try {
    await mongoose.connect(uri, opts);
    console.log("✅ MongoDB connected:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connect error:", err && err.message ? err.message : err);
    throw err;
  }

  // Optional: handle disconnects / errors at runtime
  mongoose.connection.on("error", (e) => {
    console.error("MongoDB connection error:", e && e.message ? e.message : e);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  return mongoose;
}

// also provide a default export so import default connectDB works
export default connectDB;
