import { AppSidebar } from "~/components/app-sidebar";
import { Container } from "~/components/ui/container";
import { SidebarProvider } from "~/components/ui/sidebar";

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
