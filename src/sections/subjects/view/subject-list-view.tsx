
import { useState, useCallback, useEffect } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { SubjectList } from '../subject-list';
import HeaderSection from 'src/components/header-section/HeaderSection';
import { Card, InputAdornment, TextField } from '@mui/material';
import { SubjectFilter, SbjItem } from 'src/types/subject';
import { deleteSubject, getSubjects } from 'src/api/subjects';
import { SubjectNewEditForm } from '../subject-new-edit-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { toast } from 'sonner';
import { SubjectDetails } from '../subject-details';
import { SkeletonScreen } from 'src/components/skeleton/skeleton';

// ----------------------------------------------------------------------

export function SubjectListView() {
    const [subjectsData, setSubjectsData] = useState<SbjItem[]>([]);
    const [tableRowSelected, setTableRowSelected] = useState<SbjItem | null>(null);
    const [selectedId, setSelectedId] = useState('');

    const openForm = useBoolean();
    const openDetails = useBoolean();
    const confirmDelete = useBoolean();

    const fetchSubjects = async (keyWord: string) => {
        try {
            const data = await getSubjects(keyWord.toLowerCase());
            setSubjectsData(data.results || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchSubjects('');
    }, []);

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        if (newValue)
            fetchSubjects(`?search=${newValue}`);
        else
            fetchSubjects('');
    }, [fetchSubjects]);

    const renderNewEditForm = () => {
        return (
            <SubjectNewEditForm
                open={openForm.value}
                onClose={openForm.onFalse}
                currentSubject={tableRowSelected}
                fetchData={fetchSubjects}
            />
        )
    }

    const renderFilters = () => (
        <Box
            sx={{
                gap: 3,
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-end', sm: 'center' },
            }}
        >
            <TextField
                placeholder="Tìm kiếm môn học..."
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
    );

    const handleDelete = useCallback(async (id: string) => {
        if (!id) return;
        try {
            await deleteSubject(id);
            fetchSubjects('');
            setTableRowSelected(null);
            toast.success('Xóa môn học thành công!');
        } catch (error) {
            console.error(error);
        }
    }, []);

    const renderConfirmDialog = () => (
        <ConfirmDialog
            open={confirmDelete.value}
            onClose={confirmDelete.onFalse}
            title="Xóa môn học"
            content={
                <>
                    Bạn có chắc chắn muốn xóa môn học này?
                </>
            }
            action={
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => { handleDelete(selectedId); confirmDelete.onFalse() }}
                >
                    Xóa
                </Button>
            }
        />
    );

    const renderDetails = () => (
        <SubjectDetails
            subjectId={selectedId}
            open={openDetails.value}
            onClose={openDetails.onFalse}
        />
    )

    return (
        <DashboardContent>
            <HeaderSection
                heading="Môn học"
                links={[
                    { name: 'Tổng quan', href: paths.dashboard.root },
                    { name: 'Môn học' },
                ]}
                actions={
                    <Button
                        variant="contained"
                        startIcon={<Iconify icon="fluent-color:document-add-16" />}
                        sx={{ mt: { xs: 2, md: 0 } }}
                        onClick={() => { openForm.onTrue(); setTableRowSelected(null); }}
                    >
                        Thêm mới
                    </Button>
                }
            />

            <Card sx={{ p: 3, mb: 3 }}>
                <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
                    {renderFilters()}
                    {/* {canReset && renderResults()} */}
                </Stack>

                {subjectsData ? (
                    subjectsData.length === 0 ? (<SkeletonScreen columns={4} width={404} />)
                        : (
                            <SubjectList
                                subjects={subjectsData}
                                rowSelected={setTableRowSelected}
                                openForm={openForm}
                                confirmDelete={confirmDelete}
                                setSelectedId={setSelectedId}
                                openDetails={openDetails}
                            />
                        )
                ) :
                    <EmptyContent filled sx={{ py: 10 }} />
                }
            </Card>
            {renderNewEditForm()}
            {renderConfirmDialog()}
            {renderDetails()}
        </DashboardContent>
    );
}