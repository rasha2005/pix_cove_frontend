"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/Header";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { handleLogin } from "../lib/api";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginHeader from "@/components/common/LoginHeader";
import { useRouter } from "next/navigation";

interface RegisterFormValues {
  email: string;
  phone: string;
  password: string;
};

export default function Login() {
      const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<LoginFormValues>();

      const router = useRouter()
    
    
      const onSubmit = async(data: LoginFormValues) => {
        const res = await handleLogin(data)
        if(res.data.success){
          toast.success(res.data.message)
          setTimeout(() => {
            router.replace("/");
          }, 1200);
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
      Login
    </h1>
    <p className="text-zinc-600 dark:text-zinc-400 mt-1">
        Welcome back.
    </p>
  </div>

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
                <Label className="mb-2" htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-2">Login</Button>
            </form>


      <p className="mt-2 text-sm text-center text-zinc-600 dark:text-zinc-400">
        Don’t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
            Sign Up
        </Link>
        </p>
    </CardContent>
  </Card>
</div>
        </>
    )
}