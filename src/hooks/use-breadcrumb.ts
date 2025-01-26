import { useState } from "react";
import type { NavigationItem } from "~/components/ui/page-header";

export function useBreadcrumb(props: {
  initialItems: NavigationItem[];
}) {
  const [breadcrumbItems, setBreadcrumbItems] = useState<NavigationItem[]>(
    props.initialItems,
  );

  return { breadcrumbItems, setBreadcrumbItems };
}
