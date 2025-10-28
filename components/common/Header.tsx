"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Camera } from "lucide-react";
import Cookies from "js-cookie";


export default function Header() {
  const websiteName = "PixCove";
  const [isToken, setIsToken] = useState(true);
  const [isAccount , setIsAccount] = useState(false)

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      setIsToken(false); 
    }else{
      setIsAccount(true);
    }
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
      <Link href="/" className="text-2xl font-bold text-gray-900 mr-8">
        {websiteName}
      </Link>

      {/* <div className="flex-1 max-w-2xl hidden sm:flex">
        <div className="flex items-center w-full bg-gray-100 rounded-lg border border-gray-300 p-2 shadow-inner">
          <Search className="h-5 w-5 text-gray-500 ml-2" />
          <input
            type="text"
            placeholder="Search photos and illustrations"
            className="flex-1 bg-transparent border-none outline-none text-gray-700 ml-3 placeholder-gray-500"
          />
          <Camera className="h-5 w-5 text-gray-500 mr-2 cursor-pointer hover:text-gray-700" />
        </div>
      </div> */}

      <div className="flex items-center space-x-4 ml-8">
      <Link href="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
    Home
  </Link>

  {/* Show Login if not logged in */}
  {!isToken && (
    <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
      Log in
    </Link>
  )}

  {/* Show Account if logged in */}
  {isAccount && (
    <Link href="/account" className="text-sm font-medium text-gray-700 hover:text-gray-900">
      Account
    </Link>
  )}

       
        <Link href="/uploadImage">
          <button className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors duration-200">
            Submit an image
          </button>
        </Link>
      </div>
    </header>
  );
}
