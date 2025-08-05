import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { Iconify } from 'src/components/iconify';
import { Box, Checkbox, FormControlLabel, FormGroup, IconButton, TextField, Tooltip } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'src/utils/useDebounce';
import { UserItem } from 'src/types/user';
import { getUserInChannelExcludeGroup } from 'src/api/channel';
import { toast } from 'sonner';
import { studyGroupUpdateDTO } from 'src/types/studyGroup';
import { updateStudyGroup } from 'src/api/group';
import { UniqueIdentifier } from '@dnd-kit/core';
import { mutate } from 'swr';
import { endpoints } from 'src/lib/axios';

export interface AddDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
    groupId: UniqueIdentifier;
    channelId: string;
    idOwner: string;
    conversationId: string;
}

function AddDialog(props: AddDialogProps) {
    const { onClose, selectedValue, open, channelId, groupId, idOwner, conversationId } = props;
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const [participants, setParticipants] = useState<UserItem[]>([]);
    const [selectedUser, setSelectedUser] = useState<string[]>([]);

    const fetchData = async () => {
        try {
            const resUser = await getUserInChannelExcludeGroup(channelId, groupId, debouncedSearch);
            const allUsers = resUser.results.filter((user) => user.id !== idOwner);
            setParticipants(allUsers);

            const alreadyInGroupIds = allUsers
                .filter((user) => user.isInGroup)
                .map((user) => user.id);

            setSelectedUser(alreadyInGroupIds);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [debouncedSearch, open]);

    const filteredParticipants = useMemo(() => {
        return participants.filter((p) =>
            p.lastName.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
    }, [participants, debouncedSearch]);

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleToggle = (userId: string) => {
        setSelectedUser((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleAddUsers = async () => {
        try {
            const payload: studyGroupUpdateDTO = {
                channelId,
                members: selectedUser
            };

            await updateStudyGroup(groupId, payload);
            toast.success('Cập nhật thành viên thành công');
            fetchData();
            mutate(endpoints.conversation.list);
            mutate(endpoints.conversation.byId(conversationId));
            mutate(endpoints.studyGroup(`/${groupId}`));
            mutate(endpoints.studyGroup(`?channelId=${channelId}`));
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        } finally {
            onClose(selectedValue);
        }
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Cập nhật thành viên nhóm</DialogTitle>
            <Box sx={{ px: 3, pb: 2, pt: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm thành viên..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Box
                    sx={{
                        maxHeight: 300,
                        overflowY: 'auto',
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        p: 1,
                    }}
                >
                    <FormGroup>
                        {filteredParticipants.length > 0 ? (
                            filteredParticipants.map((user) => (
                                <FormControlLabel
                                    key={user.id}
                                    control={
                                        <Checkbox
                                            checked={selectedUser.includes(user.id)}
                                            onChange={() => handleToggle(user.id)}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {user.avatar ? (
                                                <Avatar alt={user.username} src={user.avatar} sx={{ width: 28, height: 28 }} />
                                            ) : (
                                                <Avatar sx={{ bgcolor: blue[100], color: blue[600], width: 28, height: 28 }}>
                                                    <Iconify icon={'fluent-color:person-24'} width={18} />
                                                </Avatar>
                                            )}
                                            <Typography variant="body2">
                                                {user.lastName} {user.firstName}
                                                {user.isInGroup && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                                        (đã trong nhóm)
                                                    </Typography>
                                                )}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
                                Không tìm thấy người dùng
                            </Typography>
                        )}
                    </FormGroup>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="contained" onClick={handleAddUsers} disabled={selectedUser.length === 0}>
                        Xác nhận
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}


type participantProps =
    {
        channelId: string,
        groupId: UniqueIdentifier,
        idOwner: string
        conversationId: string
    }

export default function ChatAddParticipant({ channelId, groupId, idOwner, conversationId }: participantProps) {
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <>
            <Tooltip title="Quản lý thành viên" onClick={handleClickOpen}>
                <IconButton>
                    <Iconify icon="fluent-color:people-add-20" />
                </IconButton>
            </Tooltip>

            <AddDialog
                idOwner={idOwner}
                groupId={groupId}
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                channelId={channelId}
                conversationId={conversationId}
            />
        </>
    );
}
