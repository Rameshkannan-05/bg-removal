import { Webhook } from "svix";
import userModel from "../models/userModel.js";

// Clerk Webhook Controller
const clerkWebhooks = async (req, res) => {
  try {
    console.log("✅ Webhook received! Headers:", req.headers);
    console.log("✅ Webhook raw body:", req.body);

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Ensure body is Buffer (Vercel may parse as Object)
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body));

    // Verify the webhook
    const evt = await whook.verify(rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    console.log("✅ Webhook verified! Event type:", evt.type);

    const { data, type } = evt;

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
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          photo: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        console.log("✅ User updated in MongoDB");
        break;
      }
      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        console.log("✅ User deleted from MongoDB");
        break;
      }
      default:
        console.log("ℹ️ Event type not handled:", type);
        break;
    }

    res.json({ success: true });
  } catch (error) {
    console.log("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// API controller to get user credits
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
