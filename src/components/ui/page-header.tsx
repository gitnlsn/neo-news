import type React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

interface NavigationItem {
  title: string;
  link: string;
}

interface PageHeaderProps {
  breadcrumbItems: NavigationItem[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ breadcrumbItems }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.title}>
            {index < breadcrumbItems.length - 1 ? (
              <>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </>
            ) : (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageHeader;
