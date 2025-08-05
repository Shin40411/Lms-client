import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { ClassItem, ClassResponse } from "src/types/classes";
import getDegreeLabel from "src/utils/format-degree";
import ClassTableDetails from "./class-table-details";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getDetails } from "src/api/classes";

type Props = DrawerProps & {
    classItem: ClassItem;
    onClose: () => void;
};

export function ClassDetails({ classItem, open, onClose, ...other }: Props) {
    const [ClassDetail, setClassDetail] = useState<ClassResponse | null>(null);

    const fetchDetails = async () => {
        if (!classItem?.id) return;
        const res = await getDetails(classItem.id);
        setClassDetail(res);
    };

    useEffect(() => {
        fetchDetails();
        setClassDetail(null);
    }, [classItem?.id]);

    const TeacherColumns: GridColDef[] = [
        {
            field: 'index',
            headerName: 'STT',
            width: 70,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id)+1
        },
        {
            field: 'fullName',
            headerName: 'Họ và tên',
            sortable: false,
            width: 160,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
        {
            field: 'gender',
            headerName: 'Giới tính',
            type: 'string',
            width: 90,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (value, row) => `${row.gender === 'MALE' ? 'Nam' : 'Nữ'}`,
        },
        {
            field: 'teacherProfile.degree',
            headerName: 'Bằng cấp',
            type: 'string',
            width: 130,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (value, row) => `${row.teacherProfile?.degree ? getDegreeLabel(row.teacherProfile.degree) : ''}`,
        }
    ];

    const StudentColumns: GridColDef[] = [
        {
            field: 'index',
            headerName: 'STT',
            width: 70,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
        },
        {
            field: 'fullName',
            headerName: 'Họ và tên',
            sortable: false,
            width: 160,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
        {
            field: 'gender',
            headerName: 'Giới tính',
            type: 'string',
            width: 90,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (value, row) => `${row.gender === 'MALE' ? 'Nam' : 'Nữ'}`,
        },
        {
            field: 'academicYear',
            headerName: 'Năm học',
            type: 'string',
            width: 130,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (value, row) => row.studentProfile?.academicYear ?? '',
        }
    ];

    const classProperties = () => (
        <Stack spacing={1.5}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    typography: 'subtitle2',
                    justifyContent: 'space-between',
                }}
            >
                Chi tiết lớp học
            </Box>

            {classItem && (
                <>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Mô tả
                        </Box>

                        {classItem?.description}
                    </Box>

                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Khối lớp
                        </Box>

                        {classItem?.grade}
                    </Box>
                </>
            )}
        </Stack>
    );

    const teacherProperties = () => (
        <Stack spacing={1.5}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    typography: 'subtitle2',
                    justifyContent: 'space-between',
                }}
            >
                Chi tiết giáo viên chủ nhiệm
            </Box>

            {classItem?.homeroomTeacher && (
                <>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Họ và tên
                        </Box>

                        {classItem?.homeroomTeacher.lastName} {classItem?.homeroomTeacher.firstName}
                    </Box>

                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Bằng cấp
                        </Box>

                        {getDegreeLabel(classItem?.homeroomTeacher.teacherProfile.degree)}
                    </Box>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Giới tính
                        </Box>

                        {classItem?.homeroomTeacher.gender === 'MALE' ? 'Nam' : 'Nữ'}
                    </Box>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Số điện thoại
                        </Box>

                        {classItem?.homeroomTeacher.phone}
                    </Box>
                    <Box sx={{ display: 'flex', typography: 'caption', textTransform: 'capitalize' }}>
                        <Box component="span" sx={{ width: 80, color: 'text.secondary', mr: 2 }}>
                            Email
                        </Box>
                        {classItem?.homeroomTeacher.email}
                    </Box>
                </>
            )}
        </Stack>
    );

    return (
        <>
            <Drawer
                open={open}
                onClose={onClose}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                    paper: { sx: { width: 600 } },
                }}
                {...other}
            >
                <Scrollbar>
                    <Stack
                        spacing={2.5}
                        sx={{ p: 2.5, justifyContent: 'center', bgcolor: 'background.neutral' }}
                    >
                        <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                            {classItem?.name}
                        </Typography>
                    </Stack>
                    <Stack
                        spacing={2.5}
                        sx={{ p: 2.5, justifyContent: 'center' }}
                    >
                        {classProperties()}
                        <Divider sx={{ borderStyle: 'dashed' }} />
                        {teacherProperties()}
                    </Stack>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<span>&#9660;</span>}
                            aria-controls="panel-teachers-content"
                            id="panel-teachers-header"
                            sx={{
                                px: 2.5,
                                minHeight: 48,
                                '& .MuiAccordionSummary-content': { my: 0.5 }
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    typography: 'subtitle2',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                Danh sách giáo viên
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2.5 }}>
                            <ClassTableDetails columns={TeacherColumns} rows={ClassDetail?.teachers.map(t => t.user) || []} />
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<span>&#9660;</span>}
                            aria-controls="panel-students-content"
                            id="panel-students-header"
                            sx={{
                                px: 2.5,
                                minHeight: 48,
                                '& .MuiAccordionSummary-content': { my: 0.5 }
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    typography: 'subtitle2',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                Danh sách học sinh
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 2.5 }}>
                            <ClassTableDetails columns={StudentColumns} rows={ClassDetail?.students || []} />
                        </AccordionDetails>
                    </Accordion>
                </Scrollbar>
            </Drawer>
        </>
    );
}