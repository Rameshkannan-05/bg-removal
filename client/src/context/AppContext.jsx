import { SignIn, useAuth, useClerk, useUser } from "@clerk/clerk-react"; // UNUSED: Remove SignIn if not used
import { useState, useEffect } from "react"; // ADD: useEffect for auto-load on sign-in
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [credit, setCredit] = useState(0); // UPDATED: Start with 0 (number), not false
  const [image, setImage] = useState(null); // UPDATED: null for clarity
  const [resultImage, setResultImage] = useState(null); // UPDATED: null
  const [loadingCredits, setLoadingCredits] = useState(false); // NEW: Global loading for credits

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { isSignedIn } = useUser(); // UPDATED: Use useUser  for isSignedIn
  const { openSignIn } = useClerk();

  // NEW: Auto-load credits on sign-in (Clerk event)
  useEffect(() => {
    if (isSignedIn) {
      loadCreditsData();
    }
  }, [isSignedIn]); // This runs on sign-up too!

  const loadCreditsData = async () => {
    if (!isSignedIn) return; // NEW: Early return if not signed in
    setLoadingCredits(true); // NEW: Start loading
    try {
      const token = await getToken({ template: "your-template" }); // UPDATED: Specify template if using Clerk sessions
      console.log("Fetching credits with token..."); // NEW: Debug log
      const { data } = await axios.get(`${backendUrl}/api/user/credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCredit(data.credits);
        console.log("Credits loaded:", data.credits); // UPDATED: Better log
      } else {
        // NEW: Handle "User  not found" specifically
        if (data.message === "User  not found") {
          toast.warning("User  profile loading... Please wait or refresh."); // NEW: User-friendly message
          setCredit(0); // Fallback
          // Optional: Auto-retry after 2s (in case webhook is delayed)
          setTimeout(() => loadCreditsData(), 2000);
        } else {
          toast.error(data.message);
          setCredit(0);
        }
      }
    } catch (error) {
      console.error("Credits error:", error); // UPDATED: Better log
      toast.error(error.response?.data?.message || "Failed to load credits");
      setCredit(0); // Fallback on error
    } finally {
      setLoadingCredits(false); // NEW: Always end loading
    }
  };

  const removeBg = async (image) => {
    try {
      if (!isSignedIn) {
        toast.info("Please sign in to remove background."); // NEW: Better message
        return openSignIn();
      }
      // NEW: Check credits before upload (optional early check)
      if (credit === 0) {
        toast.warning("No credits left! Buy more to continue.");
        navigate("/buy");
        return;
      }

      setImage(image);
      setResultImage(null); // UPDATED: Clear previous result
      const token = await getToken();
      const formData = new FormData();
      formData.append("image", image);

      // UPDATED: Navigate AFTER API call starts (prevents race)
      const { data } = await axios.post(
        `${backendUrl}/api/image/remove-bg`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setResultImage(data.resultImage);
        if (data.creditBalance !== undefined) {
          setCredit(data.creditBalance);
        }
        navigate("/result"); // MOVED: After success
      } else {
        toast.error(data.message);
        if (data.creditBalance !== undefined) {
          setCredit(data.creditBalance);
        }
        if (data.creditBalance === 0) {
          navigate("/buy");
        }
      }
    } catch (error) {
      console.error("Remove BG error:", error); // NEW: Log
      toast.error(error.response?.data?.message || "Upload failed");
      setImage(null); // NEW: Clear on error
    }
  };

  const value = {
    credit,
    setCredit,
    loadCreditsData,
    loadingCredits, // NEW: Expose loading
    backendUrl,
    image,
    setImage,
    removeBg,
    resultImage,
    setResultImage,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
