import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { ClassList } from "../class-list";
import { ClassFilters, ClassItem, ClassListResponse } from "src/types/classes";
import { useCallback, useEffect, useState } from "react";
import { deleteClass, filterClasses, getClasses, searchClasses } from "src/api/classes";
import { Box, Button, Card, Checkbox, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Popover, Select, SelectChangeEvent, Tab, Tabs, TextField } from "@mui/material";
import { toast } from 'src/components/snackbar';
import { Iconify } from "src/components/iconify";
import { ClassForm } from "../class-form";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useBoolean, useSetState } from "minimal-shared/hooks";
import { getUsers } from "src/api/users";
import { SkeletonScreen } from "src/components/skeleton/skeleton";
import { EmptyContent } from "src/components/empty-content";
import HeaderSection from "src/components/header-section/HeaderSection";
import { useSettingsContext } from "src/components/settings";
import { varAlpha } from "minimal-shared/utils";
import { _mockGrade } from "src/_mock/_mockGrade";
import { Label } from "src/components/label";
import { Field } from "src/components/hook-form";
import { ClassToolbar } from "../class-toolbar";
import { ClassFiltersResult } from "../class-filter-result";

export function ClassesView() {
    const [open, setOpen] = useState<null | HTMLElement>(null);
    const [selectedClass, setSelectedClass] = useState<ClassItem | undefined>(undefined);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [response, setResponse] = useState<ClassListResponse | null>(null);
    const confirmDelete = useBoolean();
    const filters = useSetState<ClassFilters>({ grade: [] });
    const { state: currentFilters } = filters;

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const [teachers, setTeachers] = useState([
        { id: '', name: '' }
    ]);

    const [students, setStudents] = useState([
        { id: '', name: '' }
    ]);

    const fetchClasses = async () => {
        try {
            const data = await getClasses();
            setResponse(data);
        } catch (err) {
            console.error('Không thể tải danh sách lớp học.');
        }
    };

    const fetchTeachers = async () => {
        try {
            const data = await getUsers('?isTeacher=true');
            setTeachers(
                data.results.map((item) => ({
                    id: item.id,
                    name: item.lastName + ' ' + item.firstName,
                }))
            );
        } catch (err) {
            console.error('Không thể tải danh sách giáo viên.');
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await getUsers('?isStudent=true&hasClassroom=false');
            setStudents(
                data.results.map((item) => ({
                    id: item.id,
                    name: item.lastName + ' ' + item.firstName,
                }))
            );
        } catch (err) {
            console.error('Không thể tải danh sách học sinh.');
        }
    };

    const fetchSearchClasses = async (keyWord: string) => {
        try {
            const data = await searchClasses(keyWord.toLowerCase());
            setResponse(data);
        } catch (err) {
            console.error('Không thể tải danh sách lớp học.');
        }
    };

    const canReset =
        currentFilters.grade.length > 0;

    useEffect(() => {
        fetchClasses();
        fetchTeachers();
        fetchStudents();
    }, []);

    const handleEdit = (classItem: ClassItem) => {
        setSelectedClass(classItem);
    };

    const handleDelete = (id: string) => {
        setSelectedId(id);
        confirmDelete.onTrue();
    };

    const deleteAction = async () => {
        if (selectedId) {
            try {
                await deleteClass(selectedId);
                fetchClasses();
                fetchTeachers();
                fetchStudents();
                confirmDelete.onFalse();
                setSelectedId(null);
                toast.success('Xóa lớp học thành công');
            } catch (err) {
                console.log(err);
                toast.error('Đã có lỗi xảy ra');
            }
        } else {
            toast.warning('Dữ liệu không phù hợp để xóa');
        }
    };

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDelete.value}
            onClose={confirmDelete.onFalse}
            title="Xóa lớp học"
            content={
                <>
                    Bạn có chắc chắn muốn xóa lớp học này?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteAction}
                >
                    Xóa
                </Button>
            }
        />
    );

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue)
            fetchSearchClasses(newValue);
        else
            fetchClasses();
    }, [fetchSearchClasses, fetchClasses]);

    const handleFilter = useCallback(
        async (event: string[]) => {
            try {
                if (event.length === 0) {
                    fetchClasses();
                    return;
                }
                const newValue = `[${event.toLocaleString()}]`;
                const res = await filterClasses('grade', newValue);
                setResponse(res);
            } catch (error) {
                console.error(error);
            }
        }, []
    );

    return (
        <DashboardContent>
            <HeaderSection
                heading="Lớp học"
                links={[
                    { name: 'Tổng quan', href: paths.dashboard.root },
                    { name: 'Lớp học' },
                ]}
                actions={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="fluent-color:document-add-16" />}
                        sx={{ mt: { xs: 2, md: 0 } }}
                        onClick={(e) => { handleOpen(e), setSelectedClass(undefined) }}
                    >
                        Thêm mới
                    </Button>
                }
            />

            <Card sx={{ mb: 4, pb: 4 }}>
                <Box
                    sx={{
                        py: 4,
                        px: 4,
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2
                    }}
                >
                    <ClassToolbar
                        filters={filters}
                        onResetPage={handleFilter}
                        options={{ grade: _mockGrade.map(r => r) }}
                    />
                    <TextField
                        fullWidth
                        placeholder="Tìm kiếm lớp học..."
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        onChange={handleSearch}
                    />
                </Box>
                {canReset && (
                    <Box sx={{ px: 4 }}>
                        <ClassFiltersResult
                            filters={filters}
                            onResetPage={handleFilter}
                            totalResults={response ? response.count : 0}
                        />
                    </Box>
                )}
                {response ? (
                    response.count === 0 ? (
                        <EmptyContent title="Chưa có lớp học nào" sx={{ p: 5 }} description="Hãy bắt đầu tạo lớp học đầu tiên của bạn để quản lý học sinh và giáo viên." />
                    ) : (
                        <ClassList
                            classes={response}
                            openEdit={handleOpen}
                            onEdit={handleEdit}
                            confirmDelete={confirmDelete}
                            onDelete={handleDelete}
                        />
                    )
                ) : (
                <SkeletonScreen columns={4} width={400} />
                )}
            </Card>

            {Boolean(open) && (
                <Box
                    onClick={handleClose}
                    sx={{
                        zIndex: 1300,
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                    }}
                />
            )}

            <Popover
                open={Boolean(open)}
                anchorReference="anchorPosition"
                anchorPosition={{ top: window.innerHeight / 2, left: window.innerWidth / 2 }}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                transformOrigin={{ vertical: 'center', horizontal: 'center' }}
                PaperProps={{
                    sx: {
                        boxShadow: 'none',
                        backgroundColor: 'transparent',
                        width: 700,
                        maxWidth: '100%',
                        zIndex: 1400,
                    },
                }}
            >
                <ClassForm
                    teachers={teachers}
                    currentClass={selectedClass}
                    students={students}
                    handleClose={handleClose}
                    resetResponse={setResponse}
                    resetTeachers={setTeachers}
                    resetStudents={setStudents}
                />
            </Popover>
            {renderConfirmDialog()}
        </DashboardContent>
    );
}