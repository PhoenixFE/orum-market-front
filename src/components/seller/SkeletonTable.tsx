import { TableBody, TableRow, TableCell, Skeleton } from '@mui/material';

interface SkeletonTableProps {
  rows: number;
  columns: number;
}

const SkeletonTable = ({ rows, columns }: SkeletonTableProps) => {
  return (
    <TableBody>
      {[...Array(rows)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(columns)].map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton animation="wave" width={20} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default SkeletonTable;
