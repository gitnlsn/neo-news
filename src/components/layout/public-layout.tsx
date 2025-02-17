import { Footer } from "./footer";
import { Header } from "./header";

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      {children}

      <Footer className="mt-auto" />
    </main>
  );
};
