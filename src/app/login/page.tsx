"use client";

import { signIn } from "next-auth/react"; // Importar função de autenticação
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";

const LoginPage = () => {
  // Função para lidar com o login
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard/profile" }); // Chamar a função de login com Google
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Button onClick={handleGoogleLogin} aria-label="Login com Google">
          <Icons.google className="mr-2 h-4 w-4" />
          Login com Google
        </Button>
      </div>
    </div>
  );
};

export default LoginPage; // Exportar o componente
