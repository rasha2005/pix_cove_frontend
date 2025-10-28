"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { handleRegister } from "../lib/api";
import LoginHeader from "@/components/common/LoginHeader";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>();


   const onSubmit = async(data: RegisterFormValues) => {
    console.log("Form Data:", data);
    const res = await handleRegister(data);
    if(res.data.success){
      toast.success(res.data.message);
      reset();

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
      <LoginHeader />

      <div className="flex flex-col items-center bg-zinc-50 dark:bg-black px-4 py-12">
        
        {/* Heading above the card */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
            Register
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            Create your account to start uploading images.
          </p>
        </div>

        {/* Card */}
        <Card className="w-full max-w-md">
          <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-2">
                <Label className="mb-2" htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="mb-2">
                <Label className="mb-2" htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div className="mb-2">
                <Label className="mb-2" htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]).*$/,
                      message:
                        "Password must contain at least one uppercase letter, one number, and one special character",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2">Register</Button>
            </form>

            {/* Redirect link */}
            <p className="mt-2 text-sm text-center text-zinc-600 dark:text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}