import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { SignedIn, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext } from "react";
import { useEffect } from "react";
import { AppContext } from "../context/AppContext";

export const Navbar = () => {
  // signIn Popup
  const { openSignIn } = useClerk();
  // checking whether user SignedIn or not
  const { isSignedIn, user } = useUser();
  const {credit,loadCreditsData} = useContext(AppContext)

  useEffect(()=>{
    if (isSignedIn) {
      loadCreditsData()
    }
  },[isSignedIn])

  return (
    <div className="flex items-center justify-between mx-4 py-3 lg:mx-44">
      <Link to={"/"}>
        <img className="w-32 sm:w-44" src={assets.logo} alt="Logo" />
      </Link>
      {/* Checking SI or not */}
      {isSignedIn ? (
        // user SI aptina user button(profile pic,email) varum
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700">
            <img width={20} src={assets.credit_icon} alt="Credit Icon" />
            <p className="text-xm sm:text-sm font-medium text-gray-600">Credits : {credit}</p>
          </button>
          <p className="text-gray-600 max-sm:hidden">Hi, {user.fullName}</p>
          <UserButton />
        </div>
      ) : (
        // user SI pannala na get started button varum
        <button
          // click panna signIn popup varum
          onClick={() => openSignIn({})}
          className="bg-zinc-800 text-white flex items-center gap-4 px-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full"
        >
          Get started
          <img
            className="w-3 sm:w-4"
            src={assets.arrow_icon}
            alt="Arrow icon"
          />
        </button>
      )}
    </div>
  );
};
