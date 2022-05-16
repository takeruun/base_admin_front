export type PaginationPropsType = {
  count: number;
  onPageChange: (_event: any, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
};
