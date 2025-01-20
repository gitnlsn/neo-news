import { AppSidebar } from "./app-sidebar";
import { Container } from "./ui/container";
import { SidebarProvider } from "./ui/sidebar";

export const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main className="w-full">
        <Container>{children}</Container>
      </main>
    </SidebarProvider>
  );
};
