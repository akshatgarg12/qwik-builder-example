/** @jsxImportSource react */
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { qwikify$ } from '@builder.io/qwik-react';

export interface MaterialTableProps {
  headColumns: { label: string; numeric: boolean }[];
  bodyRows: { columns: { content: any[]; numeric: boolean }[] }[];
//   builderBlock: any;
}

export const MaterialTableComponent = (props: MaterialTableProps) => {
  const { headColumns, bodyRows, children } = props;
  return (
    <Table className="builder-table">
      {headColumns && !!headColumns.length && (
        <TableHead>
          {headColumns.map((col, index) => (
            <TableCell key={index} align={col.numeric ? 'right' : undefined}>
              {col.label}
            </TableCell>
          ))}
        </TableHead>
      )}
      {bodyRows && !!bodyRows.length && (
        <TableBody>
          {children}
        </TableBody>
      )}
    </Table>
  );
}

export const QwikifyMaterialTable = qwikify$(MaterialTableComponent, {clientOnly:true})
export const MUITableRow = qwikify$(TableRow, {clientOnly:true})
export const MUITableCell = qwikify$(TableCell, {clientOnly:true})