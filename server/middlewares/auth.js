import jwt from "jsonwebtoken";

// Middleware Function to decode jwt token to get clerkId
const authUser = async (req, res, next) => {
  try {
    // const { token } = req.headers;
    // if (!token) {
      // return res.json({
        // success: false,
        // message: "Not Authorized Login Again",
      // });
    // }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token = authHeader.split(" ")[1];

    const token_decode = jwt.decode(token);
    // req.body.clerkId = token_decode.clerkId;  GREATSTACK
    // req.user = {clerkId: token_decode.clerkId}
    req.user = { clerkId: token_decode.sub };
    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
