import { parseAsInteger, useQueryState } from "nuqs";

export const useNuqsPagination = (props?: {
  page?: number;
  perPage?: number;
}) => {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(props?.page ?? 1),
  );
  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(props?.perPage ?? 10),
  );

  return {
    page,
    setPage,
    perPage,
    setPerPage,
  };
};
