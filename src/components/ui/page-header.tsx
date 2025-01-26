import { signOut, useSession } from "next-auth/react";
import type React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { AvatarCard } from "../molecular/avatar-card";
import { Container } from "./container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { SidebarTrigger } from "./sidebar";

export interface NavigationItem {
  title: string;
  link: string;
}

interface PageHeaderProps {
  breadcrumbItems: NavigationItem[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ breadcrumbItems }) => {
  const { data } = useSession();

  return (
    <Container className="px-0 py-4 flex flex-row items-center">
      <SidebarTrigger />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={item.title}>
              {index < breadcrumbItems.length - 1 ? (
                <>
                  <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
                  <p>{">"}</p>
                </>
              ) : (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <DropdownMenu>
        <DropdownMenuTrigger className="ml-auto rounded-full">
          <AvatarCard session={data} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => signOut()}>Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Container>
  );
};

export default PageHeader;
