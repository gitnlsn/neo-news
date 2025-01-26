import {
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination,
} from "../ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  perPage: number;
}

export const Pagination = ({
  currentPage,
  totalItems,
  onPageChange,
  perPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <ShadcnPagination>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationFirst isActive onClick={() => onPageChange(1)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                isActive
                onClick={() => onPageChange(currentPage - 1)}
              />
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationLink isActive={false}>{currentPage}</PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink isActive={false}>de</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive={false}>{totalPages}</PaginationLink>
        </PaginationItem>

        {currentPage < totalPages && (
          <>
            <PaginationItem>
              <PaginationNext
                isActive
                onClick={() => onPageChange(currentPage + 1)}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast
                isActive
                onClick={() => onPageChange(totalPages)}
              />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </ShadcnPagination>
  );
};
