// ----------------------------------------------------------------------

import { Box, Button, Card, IconButton, Table, TableBody, Tabs, Tooltip } from "@mui/material";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { varAlpha } from "minimal-shared/utils";
import { useState } from "react";
import HeaderSection from "src/components/header-section/HeaderSection";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { emptyRows, TableEmptyRows, TableHeadCellProps, TableHeadCustom, TablePaginationCustom, TableSelectedAction, TableSkeleton, useTable } from "src/components/table";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";

const TABLE_HEAD: TableHeadCellProps[] = [
    { id: 'name', label: 'Tiêu đề bài thi', width: 200 },
    { id: 'subject', label: 'Môn học', width: 200 },
    { id: 'time', label: 'Thời gian làm bài', width: 180 },
    { id: 'password', label: 'Mật khẩu bài thi', width: 100 },
    { id: '', width: 50 },
];

// ----------------------------------------------------------------------

export function ExamListView() {
    const table = useTable();

    const confirmDialog = useBoolean();
    const quickEditForm = useBoolean();

    const [tableData, setTableData] = useState<[]>([]);

    const [tableRowSelected, setTableRowSelected] = useState(null);

    const filters = useSetState<[]>();

    const { state: currentFilters, setState: updateFilters } = filters;
    const [dataFiltered, setDataFiltered] = useState<[]>([]);

    const canReset = false;

    const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

    return (
        <>
            <DashboardContent>
                <HeaderSection
                    heading="Bài thi"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Bài thi' },
                    ]}
                    actions={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="fluent-color:document-add-16" />}
                        >
                            Thêm mới
                        </Button>
                    }
                />

                <Card>
                    {/* bộ lọc */}
                    <Tabs
                        value={false}
                        sx={[
                            (theme) => ({
                                px: 2.5,
                                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                            }),
                        ]}
                    >
                        {/* {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === currentFilters.status) && 'filled') ||
                      'soft'
                    }
                    color={
                      (tab.value === 'ACTIVE' && 'success') ||
                      (tab.value === 'INACTIVE' && 'warning') ||
                      'default'
                    }
                  >
                    {['ACTIVE', 'INACTIVE'].includes(tab.value)
                      ? tableData.filter((user) => user.status === tab.value).length
                      : tableData.length}
                  </Label>
                }
              />
            ))} */}
                    </Tabs>
                    {/* thanh công cụ */}
                    {/* <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: rolesData.map(r => r.name) }}
          /> */}
                    {/* kết quả tìm kiếm */}
                    {/* {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}
                    {/* bảng */}
                    <Box sx={{ position: 'relative' }}>
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={dataFiltered.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    dataFiltered.map((row: any) => row.id)
                                )
                            }
                            action={
                                <Tooltip title="Delete">
                                    <IconButton color="primary" onClick={confirmDialog.onTrue}>
                                        <Iconify icon="solar:trash-bin-trash-bold" />
                                    </IconButton>
                                </Tooltip>
                            }
                        />
                        <TablePaginationCustom
                            page={table.page}
                            dense={table.dense}
                            count={dataFiltered.length}
                            rowsPerPage={table.rowsPerPage}
                            onPageChange={table.onChangePage}
                            onChangeDense={table.onChangeDense}
                            onRowsPerPageChange={table.onChangeRowsPerPage}
                        />
                        <Scrollbar>
                            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                                <TableHeadCustom
                                    order={table.order}
                                    orderBy={table.orderBy}
                                    headCells={TABLE_HEAD}
                                    rowCount={dataFiltered.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                // onSelectAllRows={(checked) =>
                                //   table.onSelectAllRows(
                                //     checked,
                                //     dataFiltered.map((row) => row.id)
                                //   )
                                // }
                                />

                                <TableBody>
                                    {dataFiltered
                                        .slice(
                                            table.page * table.rowsPerPage,
                                            table.page * table.rowsPerPage + table.rowsPerPage
                                        )
                                        // .map((row) => (
                                        //   <UserTableRow
                                        //     key={row.id}
                                        //     row={row}
                                        //     selected={table.selected.includes(row.id)}
                                        //     onSelectRow={() => table.onSelectRow(row.id)}
                                        //     onDeleteRow={() => handleDeleteRow(row.id)}
                                        //     editHref={paths.dashboard.user.edit(row.id)}
                                        //     openEditForm={quickEditForm}
                                        //     rowSelected={setTableRowSelected}
                                        //   />
                                        // ))
                                    }

                                    <TableEmptyRows
                                        height={table.dense ? 56 : 56 + 20}
                                        emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                                    />

                                    {/* <TableNoData notFound={notFound} /> */}
                                    {notFound &&
                                        <TableSkeleton rowCount={table.rowsPerPage} cellCount={TABLE_HEAD.length} sx={{ height: 69 }} />
                                    }
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </Box>
                </Card>
            </DashboardContent>
            {/* {renderQuickEditForm()} */}
            {/* {renderConfirmDialog()} */}
        </>
    );
}

// ----------------------------------------------------------------------

// type ApplyFilterProps = {
//   inputData: UserItem[];
//   filters: IUserTableFilters;
//   comparator: (a: any, b: any) => number;
// };

// async function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
//   const { name, status, role } = filters;

//   const stabilizedThis = inputData.map((el, index) => [el, index] as const);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (name) {
//     // inputData = inputData.filter((user) => {
//     //   user.lastName.toLowerCase().includes(name.toLowerCase())
//     // });
//     const res = await getUsers(`?search=${name}`);
//     inputData = res.results;
//   }

//   if (status !== 'all') {
//     inputData = inputData.filter((user) => user.status === status);
//   }

//   if (role.length) {
//     inputData = inputData.filter((user) => role.includes(user.role.name));
//   }

//   return inputData;
// }
