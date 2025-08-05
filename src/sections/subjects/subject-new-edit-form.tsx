import { useForm, Controller } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { createSubject, updateSubject } from 'src/api/subjects';
import { toast } from 'sonner';

// Schema
const SubjectSchema = zod.object({
    name: zod.string().min(1, { message: 'Tên môn học là bắt buộc!' }),
    code: zod.string().min(1, { message: 'Mã môn học là bắt buộc!' }),
    description: zod.string().optional(),
});

export type SubjectFormType = zod.infer<typeof SubjectSchema>;

type SubjectItem = {
    id: string;
    name: string;
    code: string;
    description?: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    currentSubject?: SubjectItem | null;
    fetchData: (k: string) => void;
};

export function SubjectNewEditForm({ open, onClose, currentSubject, fetchData }: Props) {
    const defaultValues: SubjectFormType = {
        name: '',
        code: '',
        description: '',
    };

    const methods = useForm<SubjectFormType>({
        resolver: zodResolver(SubjectSchema),
        defaultValues: currentSubject
            ? {
                name: currentSubject.name || '',
                code: currentSubject.code || '',
                description: currentSubject.description || '',
            }
            : defaultValues,
    });

    const { handleSubmit, control, reset, formState: { isSubmitting } } = methods;

    useEffect(() => {
        if (currentSubject) {
            reset({
                name: currentSubject.name || '',
                code: currentSubject.code || '',
                description: currentSubject.description || '',
            });
        } else {
            reset(defaultValues);
        }
    }, [currentSubject, reset]);

    const onSubmit = async (data: SubjectFormType) => {
        try {
            const payload = {
                name: data.name,
                code: data.code,
                description: data.description || '',
            };
            if (currentSubject) {
                await updateSubject(currentSubject.id, payload);
            } else {
                await createSubject(payload);
            }

            toast.success(currentSubject ? 'Cập nhật dữ liệu thành công!' : 'Tạo mới thành công!');
            reset(defaultValues);
            fetchData('');
            onClose();
        } catch (error: any) {
            toast.error(error?.message ? error.message : 'Đã có lỗi xảy ra');
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth >
            <DialogTitle>{currentSubject ? 'Chỉnh sửa môn học' : 'Thêm môn học'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box mb={2}>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="Tên môn học"
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Box>
                        <Box mb={2}>
                            <Controller
                                name="code"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="Mã môn học"
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </Box>
                        <Box mb={2}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Mô tả môn học"
                                        fullWidth
                                        multiline
                                        minRows={3}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
                        <Button variant="outlined" color="inherit" onClick={onClose} disabled={isSubmitting}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            {currentSubject ? 'Lưu thay đổi' : 'Thêm môn học'}
                        </Button>
                    </Stack>
                </Card>
            </form>
        </Dialog>
    );
}
