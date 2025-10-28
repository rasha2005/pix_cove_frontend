"use client";
export const dynamic = "force-dynamic";

import { verifyEmail } from "@/app/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        setMessage(res.data.message);

        setTimeout(() => {
          router.push("/login");
        }, 1500);

      } catch (error) {
        setMessage("Verification failed. Invalid or expired link.");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex justify-center items-center h-screen text-xl">
      {message}
    </div>
  );
}
