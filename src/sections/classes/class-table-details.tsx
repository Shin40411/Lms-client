import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

type Props = {
  columns: GridColDef[];
  rows: any[];
}
const paginationModel = { page: 0, pageSize: 5 };

export default function ClassTableDetails({ columns, rows }: Props) {
  return (
    <Paper sx={{ height: 'auto', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0, textAlign: 'center' }}
        localeText={{ noRowsLabel: "Không có dữ liệu" }}
        slotProps={{
          pagination: {
            labelRowsPerPage: "Số hàng mỗi trang",
            labelDisplayedRows: ({ from, to, count }) => `${from} - ${to} của ${count !== -1 ? count : `nhiều hơn ${to}`}`,
          }
         }}
      />
    </Paper>
  );
}
