"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  // Se estiver carregando, mostra um loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Se não estiver autenticado, mostra a página de login
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Button
          onClick={handleGoogleLogin}
          aria-label="Login com Google"
          className="flex items-center gap-2"
        >
          <Icons.google className="h-4 w-4" />
          Login com Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
