import { Webhook } from "svix";
import userModel from "../models/userModel.js";

// API Controller Function to Manage Clerk User with database
// Webhook URL: /api/user/webhooks

const clerkWebhooks = async (req, res) => {
  try {
    // 1️⃣ Log that webhook hit the backend
    console.log("✅ Webhook received! Headers:", req.headers);
    console.log("✅ Webhook raw body:", req.body.toString());

    // 2️⃣ Verify the webhook using Svix
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body));

    const evt = await whook.verify(rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
    console.log("✅ Webhook verified! Event type:", evt.type);

    const { data, type } = evt;

    // 3️⃣ Handle different event types
    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          photo: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        };
        const user = await userModel.create(userData);
        console.log("✅ User created in MongoDB:", user);
        return res.json({});
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          photo: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        };
        const user = await userModel.findOneAndUpdate(
          { clerkId: data.id },
          userData,
          { new: true }
        );
        console.log("🔄 User updated in MongoDB:", user);
        return res.json({});
      }

      case "user.deleted": {
        const user = await userModel.findOneAndDelete({ clerkId: data.id });
        console.log("❌ User deleted in MongoDB:", user);
        return res.json({});
      }

      default:
        console.log("⚠️ Unhandled event type:", type);
        return res.json({});
    }
  } catch (error) {
    console.log("❌ Webhook error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// API controller function to get user available credits data
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.user;
    console.log("Looking for user with clerkId:", clerkId);

    const userData = await userModel.findOne({ clerkId });
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, credits: userData.creditBalance });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { clerkWebhooks, userCredits };
