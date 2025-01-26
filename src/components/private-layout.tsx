import { AppSidebar } from "./app-sidebar";
import { Container } from "./ui/container";
import { SidebarProvider } from "./ui/sidebar";

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full mb-10">
        <Container>{children}</Container>
      </main>
    </SidebarProvider>
  );
};
