import type { TableHeadCellProps } from 'src/components/table';
import type { IUserTableFilters, UserItem } from 'src/types/user';

import { useState, useCallback, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { _roles, _userList, USER_STATUS_OPTIONS } from 'src/_mock';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';

import { UserTableRow } from '../user-table-row';
import { UserTableToolbar } from '../user-table-toolbar';
import { UserTableFiltersResult } from '../user-table-filters-result';
import { getUsers } from 'src/api/users';
import { RoleItem } from 'src/types/role';
import { getRoles } from 'src/api/roles';
import { UserNewEditForm } from '../user-new-edit-form';
import HeaderSection from 'src/components/header-section/HeaderSection';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'Tất cả' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD: TableHeadCellProps[] = [
  { id: 'username', label: 'Họ và tên', width: 200 },
  { id: 'code', label: 'Mã số', width: 200 },
  { id: 'gender', label: 'Giới tính', width: 180 },
  { id: 'role', label: 'Vai trò', width: 180 },
  { id: 'status', label: 'Trạng thái', width: 100 },
  { id: '', width: 50 },
];

// ----------------------------------------------------------------------

export function UserListView() {
  const table = useTable();

  const confirmDialog = useBoolean();
  const quickEditForm = useBoolean();

  const [tableData, setTableData] = useState<UserItem[]>([]);
  const [rolesData, setRolesData] = useState<RoleItem[]>([]);

  const [tableRowSelected, setTableRowSelected] = useState<UserItem | null>(null);

  const filters = useSetState<IUserTableFilters>({ name: '', role: [], status: 'all' });
  const { state: currentFilters, setState: updateFilters } = filters;

  const fetchUsers = async () => {
    try {
      const data = await getUsers('');
      setTableData(data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRolesData(data.results || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const [dataFiltered, setDataFiltered] = useState<UserItem[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const filtered = await applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters: currentFilters,
      });
      if (active) setDataFiltered(filtered);
    })();
    return () => {
      active = false;
    };
  }, [tableData, table.order, table.orderBy, currentFilters]);

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!currentFilters.name || currentFilters.role.length > 0 || currentFilters.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows(dataInPage.length, dataFiltered.length);
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      updateFilters({ status: newValue });
    },
    [updateFilters, table]
  );

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Xác nhận xóa"
      content={
        <>
          Bạn có chắc chắn muốn xoá <strong> {table.selected.length} </strong> mục?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Xóa
        </Button>
      }
    />
  );

  const renderQuickEditForm = () => (
    <UserNewEditForm
      currentUser={tableRowSelected || null}
      open={quickEditForm.value}
      onClose={quickEditForm.onFalse}
      onReset={fetchUsers}
      roleDatas={rolesData}
    />
  );
  return (
    <>
      <DashboardContent>
        <HeaderSection
          heading="Người dùng"
          links={[
            { name: 'Tổng quan', href: paths.dashboard.root },
            { name: 'Người dùng' },
          ]}
          actions={
            <Button
              onClick={() => {
                quickEditForm.onTrue();
                setTableRowSelected(null)
              }}
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
            value={currentFilters.status}
            onChange={handleFilterStatus}
            sx={[
              (theme) => ({
                px: 2.5,
                boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
              }),
            ]}
          >
            {STATUS_OPTIONS.map((tab) => (
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
            ))}
          </Tabs>
          {/* thanh công cụ */}
          <UserTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{ roles: rolesData.map(r => r.name) }}
          />
          {/* kết quả tìm kiếm */}
          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}
          {/* bảng */}
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
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
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        editHref={paths.dashboard.user.edit(row.id)}
                        openEditForm={quickEditForm}
                        rowSelected={setTableRowSelected}
                      />
                    ))}

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
      {renderQuickEditForm()}
      {renderConfirmDialog()}
    </>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: UserItem[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

async function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    // inputData = inputData.filter((user) => {
    //   user.lastName.toLowerCase().includes(name.toLowerCase())
    // });
    const res = await getUsers(`?search=${name}`);
    inputData = res.results;
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role.name));
  }

  return inputData;
}
