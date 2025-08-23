import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connect = () => {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ DB Connected Successfully"))
  .catch((error) => {
    console.error("❌ DB Connection Failed", error);
    process.exit(1);
  });
};
