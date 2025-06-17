"use client";

import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Swal from 'sweetalert2';

interface RegisterInput {
  email: string;
  password: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]> | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<RegisterInput>();

  const onSubmit = async (data: RegisterInput) => {
    setServerErrors(null);
    try {
      await api.post("/auth/register", data);
      
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You can now login. Redirecting to login page...',
        showConfirmButton: false,
        timer: 2000
      }).then(() => {
        router.push("/login");
      });

    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      const message = err?.response?.data?.message;

      if (apiErrors) {
        setServerErrors(apiErrors);
      } else if (message) {
        setServerErrors({ general: [message] });
      } else {
        setServerErrors({ general: ["Something went wrong"] });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Register</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {serverErrors?.email && (<p className="text-sm text-red-500">{serverErrors.email[0]}</p>)}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {serverErrors?.password && <p className="text-sm text-red-500">{serverErrors.password[0]}</p>}
            </div>

            {serverErrors?.general && (
              <div className="text-sm text-red-500 bg-red-100 p-2 rounded">
                {serverErrors.general[0]}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register"}
            </Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            Have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}