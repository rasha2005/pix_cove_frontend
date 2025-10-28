"use client";

import { changePassword } from "@/app/lib/api";
import { useState } from "react";

import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Password() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (!/[A-Z]/.test(newPassword)) {
        setError("Password must contain at least one uppercase letter.");
        return;
      }
      if (!/[a-z]/.test(newPassword)) {
        setError("Password must contain at least one lowercase letter.");
        return;
      }
      if (!/[0-9]/.test(newPassword)) {
        setError("Password must contain at least one number.");
        return;
      }

    if (newPassword !== confirmPassword) {
      setError("New Password and Confirm Password do not match");
      return;
    }

    setError("");
    const res = await changePassword(currentPassword , confirmPassword )
    if(res.data.success){
        toast.success(res.data.message)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
    }else{
        toast.error(res.data.message)
    }
  };

  return (
    <>
    <ToastContainer 
    position="top-right" 
    autoClose={3000} 
    hideProgressBar={false} 
    newestOnTop={false} 
    closeOnClick 
    rtl={false} 
    pauseOnFocusLoss 
    draggable 
    pauseOnHover 
  />
    <div className="w-full flex justify-center items-center py-10"> 
      <form onSubmit={handleSubmit} className="space-y-4 w-[350px]">
        
        <div>
          <label className="block text-sm font-medium mb-1">Current Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-900 text-sm"
        >
          Update Password
        </button>
      </form>
    </div>
    </>
  );
}
