import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 px-4 lg:px-44 py-3">
      {/* Logo image */}
      <img width={150} src={assets.logo} alt="Logo" />

      {/* Copyright */}
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden">Copyright @Ramesh.dev | All right reserved.</p>

      {/* socialmedia icons */}
      <div className="flex gap-1">
        <img width={40} src={assets.facebook_icon} alt="facebook icon" />
        <img width={40} src={assets.twitter_icon} alt="twitter icon" />
        <img width={40} src={assets.google_plus_icon} alt="google icon" />
      </div>
    </div>
  );
};

export default Footer;
