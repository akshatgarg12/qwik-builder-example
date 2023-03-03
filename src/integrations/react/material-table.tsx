/** @jsxImportSource react */
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { qwikify$ } from '@builder.io/qwik-react';

export const MaterialTableComponent = () => {
  return (
    <Table className="builder-table">
      <h1>Table</h1>
    </Table>
  );
}

export const QwikifyMaterialTable = qwikify$(MaterialTableComponent, {clientOnly:true})
export const MUITableRow = qwikify$(TableRow, {clientOnly:true})
export const MUITableCell = qwikify$(TableCell, {clientOnly:true})