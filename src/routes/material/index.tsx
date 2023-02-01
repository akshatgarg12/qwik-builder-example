import { component$ } from "@builder.io/qwik";
import { MUITableCell, MUITableRow, QwikifyMaterialTable } from "~/integrations/react/material-table";

export default component$(() => {
  const bodyRows = [{columns:[{content:['A', 'B'], numeric : false}]}]
  return (
    <div>
      <h1>This page contains material-ui components (qwikifed)</h1>
      <QwikifyMaterialTable 
        headColumns={[{label : "A", numeric : false}, {label: "B", numeric: false}]}
        bodyRows = {bodyRows}>
           {bodyRows.map((row, index) => (
            <MUITableRow key={index}>
              {row.columns.map((col, colIndex) => (
                <MUITableCell
                  key={colIndex}
                  align={col.numeric ? 'right' : undefined}
                >
                    <div>HII</div>
                </MUITableCell>
              ))}
            </MUITableRow>
          ))}
        </QwikifyMaterialTable>
    </div>
  );
});
