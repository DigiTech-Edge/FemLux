"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { loginWithGoogle } from "@/services/actions/auth.actions";

const SocialAuth = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      await loginWithGoogle();
    } catch {
      toast.error("Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="bordered"
        startContent={<FaGoogle className="text-[#4285F4]" />}
        className="w-full"
        onClick={handleGoogleLogin}
        isLoading={isLoading}
      >
        Google
      </Button>
    </div>
  );
};

export default SocialAuth;
