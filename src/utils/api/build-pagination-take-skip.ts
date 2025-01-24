export const buildPaginationTakeSkip = (props: {
  page: number | undefined;
  perPage: number | undefined;
}) => {
  const { page, perPage } = props;

  if (page === undefined || perPage === undefined) return undefined;

  return {
    take: perPage,
    skip: (page - 1) * perPage,
  };
};
