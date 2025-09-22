import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { SignedIn, useClerk, UserButton, useUser } from "@clerk/clerk-react";

export const Navbar = () => {
  // signIn Popup
  const { openSignIn } = useClerk();
  // checking whether user SignedIn or not
  const { isSignedIn, user } = useUser();

  return (
    <div className="flex items-center justify-between mx-4 py-3 lg:mx-44">
      <Link to={"/"}>
        <img className="w-32 sm:w-44" src={assets.logo} alt="Logo" />
      </Link>
      {/* Checking SI or not */}
      {isSignedIn ? (
        // user SI aptina user button(profile pic,email) varum
        <div>
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
