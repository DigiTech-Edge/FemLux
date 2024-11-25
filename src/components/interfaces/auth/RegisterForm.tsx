"use client";

import React from "react";
import { Button, Input, Link } from "@nextui-org/react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import SocialAuth from "./SocialAuth";
import { register as registerAction } from "@/services/actions/auth.actions";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [isVisible, setIsVisible] = React.useState({
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const toggleVisibility = (field: "password" | "confirmPassword") => {
    setIsVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await registerAction(data.email, data.password, data.name);
      if (error) {
        toast.error(error);
        return;
      }
      // Redirect to email verification page
      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("name")}
        type="text"
        label="Name"
        placeholder="Enter your name"
        startContent={<User className="text-default-400" size={16} />}
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name}
      />
      <Input
        {...register("email")}
        type="email"
        label="Email"
        placeholder="Enter your email"
        startContent={<Mail className="text-default-400" size={16} />}
        errorMessage={errors.email?.message}
        isInvalid={!!errors.email}
      />
      <Input
        {...register("password")}
        label="Password"
        placeholder="Enter your password"
        startContent={<Lock className="text-default-400" size={16} />}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => toggleVisibility("password")}
          >
            {isVisible.password ? (
              <EyeOff className="text-default-400" size={16} />
            ) : (
              <Eye className="text-default-400" size={16} />
            )}
          </button>
        }
        type={isVisible.password ? "text" : "password"}
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
      />
      <Input
        {...register("confirmPassword")}
        label="Confirm Password"
        placeholder="Confirm your password"
        startContent={<Lock className="text-default-400" size={16} />}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={() => toggleVisibility("confirmPassword")}
          >
            {isVisible.confirmPassword ? (
              <EyeOff className="text-default-400" size={16} />
            ) : (
              <Eye className="text-default-400" size={16} />
            )}
          </button>
        }
        type={isVisible.confirmPassword ? "text" : "password"}
        errorMessage={errors.confirmPassword?.message}
        isInvalid={!!errors.confirmPassword}
      />
      <Button
        type="submit"
        color="primary"
        className="w-full"
        isLoading={isLoading}
      >
        Sign up
      </Button>

      <SocialAuth />

      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" size="sm">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
