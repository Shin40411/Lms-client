import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getChannel } from 'src/api/channel';
import { Field, Form } from 'src/components/hook-form';
import { ChannelItem } from 'src/types/channel';
import { ClassItem } from 'src/types/classes';
import { UserItem } from 'src/types/user';
import { z } from 'zod';

type Props = {
    open: boolean,
    onClose: () => void,
    onSubmit: (data: any) => void,
    classData: ClassItem[],
    userData: UserItem[],
    selectedId: string
};

const ChannelSchema = z.object({
    classroomId: z.string().min(1, 'Vui lòng chọn lớp học'),
    name: z.string().min(1, 'Tên kênh không được để trống'),
    description: z.string().optional(),
    members: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 thành viên'),
});

type ChannelFormData = z.infer<typeof ChannelSchema>;

export function ChannelForm({ open = true, onClose, onSubmit, classData, userData, selectedId }: Props) {
    const [itemData, setItemData] = useState<ChannelItem | null>(null);

    const optionsUser = userData.map((user) => ({
        label: `${user.lastName} ${user.firstName}`,
        value: user.id
    }));

    const fetchChannelItem = async (id: string) => {
        try {
            const dataItem = await getChannel(id);
            setItemData(dataItem);
        } catch (error: any) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        if (open && selectedId) {
            fetchChannelItem(selectedId);
        } else {
            setItemData(null);
        }
    }, [open]);

    const methods = useForm<ChannelFormData>({
        resolver: zodResolver(ChannelSchema),
        defaultValues: {
            classroomId: '',
            name: '',
            description: '',
            members: [],
        },
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        if (itemData) {
            const mappedMembers = itemData.members?.map((m: any) => m?.user?.id).filter(Boolean) || [];

            reset({
                classroomId: itemData.classroom?.id || '',
                name: itemData.name || '',
                description: itemData.description || '',
                members: mappedMembers,
            });
        }
    }, [itemData, reset]);

    const onFormSubmit = handleSubmit(async (data) => {
        onSubmit(data);
        reset();
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{!selectedId ? 'Tạo kênh chat mới' : 'Chỉnh sửa kênh chat'}</DialogTitle>

            <Form methods={methods} onSubmit={onFormSubmit} >
                <DialogContent dividers sx={{ py: 1 }}>
                    <Stack spacing={3}>
                        <Field.Text name="name" label="Tên kênh" />

                        <Field.Select name="classroomId" label="Lớp học">
                            {classData.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>
                                    {cls.name}
                                </MenuItem>
                            ))}
                        </Field.Select>

                        <Field.MultiSelect
                            chip
                            checkbox
                            name="members"
                            label="Thành viên"
                            options={optionsUser}
                        />

                        <Field.Text multiline name="description" label="Mô tả" rows={5} />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button type="button" onClick={onClose} variant="outlined" color="inherit">
                        Hủy
                    </Button>
                    <Button type="submit" variant="contained" loading={isSubmitting} disabled={isSubmitting}>
                        {!selectedId ? 'Tạo kênh' : 'Cập nhật'}
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
