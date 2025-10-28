"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function NavigationSidebar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get("authToken"); 
  
    if (token) {
      try {
        const decoded:any = jwtDecode(token);
        setUserEmail(decoded.email);
      } catch (err) {
        console.log("Invalid token:", err);
      }
    }
  }, []);

const navItems = [
  { label: "My Uploads", href: "/account" },
  { label: "Password", href: "/account/password" },
  
];
const handleLogout = () => {
  Cookies.remove("authToken"); 
  router.replace("/login"); 
};

  const pathname = usePathname();

  return (
    <aside className="w-[230px] h-fit bg-white border rounded-lg shadow-sm p-5 text-sm">
    <p className="text-gray-600 mb-4">
      {userEmail ? userEmail : "Loading..."}
    </p>
  
    <nav className="space-y-2">
      {navItems.map((item, index) => {
        const active = pathname === item.href;
        return (
          <Link
            key={index}
            href={item.href}
            className={`block px-3 py-2 rounded-md ${
              active ? "bg-black text-white" : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
  
      {/* Logout looks like nav item */}
      <button
        onClick={handleLogout}
        className="block px-3 py-2 rounded-md text-red-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </nav>
  </aside>
  
  );
}

