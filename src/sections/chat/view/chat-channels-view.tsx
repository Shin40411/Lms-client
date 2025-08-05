import { DndContext } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Avatar, Box, Button, Card, CardContent, Chip, IconButton, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { EmptyContent } from "src/components/empty-content";
import HeaderSection from "src/components/header-section/HeaderSection";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { KanbanColumnSkeleton } from "src/sections/kanban/components/kanban-skeleton";
import { channelClasses } from "../channel/classes";
import { ChannelColumn } from "../channel/channel-column";
import { ChannelForm } from "../channel/channel-form";
import { createChannels, getChannels, updateChannel } from "src/api/channel";
import { ChannelItem } from "src/types/channel";
import { ChannelItemView } from "../channel/channel-item";
import { getClasses } from "src/api/classes";
import { ClassItem } from "src/types/classes";
import { UserItem } from "src/types/user";
import { getUsers } from "src/api/users";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { endpoints } from "src/lib/axios";

const PLACEHOLDER_ID = 'placeholder';
const cssVars = {
    '--item-gap': '16px',
    '--item-radius': '12px',
    '--column-gap': '24px',
    '--column-width': '336px',
    '--column-radius': '16px',
    '--column-padding': '20px 16px 16px 16px',
};
export function ChatChannelsView() {
    // const { boardLoading, boardEmpty } = useMockBoard();

    const [classes, setClasses] = useState<ClassItem[]>([]);

    const [users, setUsers] = useState<UserItem[]>([]);

    const [selectedIdChannel, setSelectedIdChannel] = useState('');

    const { data: board } = useSWR(
        endpoints.channel(''),
        () => getChannels()
    );

    const loadClasses = async () => {
        const lstClass = await getClasses();
        setClasses(lstClass.results);
    }

    const loadUsers = async () => {
        const lstUser = await getUsers('');
        setUsers(lstUser.results);
    }

    useEffect(() => {
        loadClasses();
        loadUsers();
    }, []);

    const columnIds = board?.results.map((column) => column.id);
    const [columnFixed, setColumnFixed] = useState(true);
    const [open, setOpen] = useState(false);

    const handleOpenForm = useCallback((id?: string) => {
        setOpen(true);
        if (id) {
            setSelectedIdChannel(id);
        }
    }, [selectedIdChannel]);

    const handleCloseForm = useCallback(() => {
        setOpen(false);
        setSelectedIdChannel('');
    }, [selectedIdChannel]);

    const handleSubmitChannel = useCallback(async (data: any) => {
        try {
            const payload = {
                ...data,
                type: 'GROUP',
            };

            if (!selectedIdChannel) {
                await createChannels(payload);
                toast.success('Tạo kênh thành công');
            } else {
                await updateChannel(selectedIdChannel, payload);
                toast.success('Cập nhật kênh thành công');
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra');
            console.error(error);
        } finally {
            setOpen(false);
            mutate(endpoints.channel(''));
        }
    }, [selectedIdChannel]);

    const renderEmpty = () => <EmptyContent filled sx={{ py: 10, maxHeight: { md: 480 } }} />;

    const addChannelBtn = () => (
        <Button
            sx={{
                minWidth: 300,
                maxWidth: 300,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                border: '2px dashed #ddd',
                flex: '0 0 auto',
                width: 'var(--column-width)',
            }}
            color="primary"
            endIcon={<Iconify icon='fluent-color:chat-add-24' width={40} height={40} />}
            onClick={() => handleOpenForm()}
        >
            Thêm kênh học tập
        </Button>
    );

    const renderList = () => (
        <DndContext
            id="dnd-kanban"
        >
            <Stack sx={{ flex: '1 1 auto', overflowX: 'auto' }}>
                <Stack
                    sx={{
                        pb: 3,
                        display: 'unset',
                        ...(columnFixed && { minHeight: 0, display: 'flex', flex: '1 1 auto' }),
                    }}
                >
                    <Box
                        sx={[
                            (theme) => ({
                                display: 'flex',
                                gap: 'var(--column-gap)',
                                ...(columnFixed && {
                                    minHeight: 0,
                                    flex: '1 1 auto',
                                    [`& .${channelClasses.columnList}`]: {
                                        ...theme.mixins.hideScrollY,
                                        flex: '1 1 auto',
                                    },
                                }),
                            }),
                        ]}
                    >
                        {board ?
                            <SortableContext
                                items={[...columnIds || '', PLACEHOLDER_ID]}
                                strategy={horizontalListSortingStrategy}
                            >
                                {board?.count > 0 ?
                                    board.results?.map((column) => (
                                        <ChannelColumn key={column.id} column={column} tasks={column.studyGroups} openForm={handleOpenForm}>
                                            <SortableContext
                                                items={column.studyGroups}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {column.studyGroups.map((g) => (
                                                    <ChannelItemView
                                                        disabled
                                                        key={g.id}
                                                        group={g}
                                                        columnId={column.id}
                                                    />
                                                ))}
                                            </SortableContext>
                                        </ChannelColumn>
                                    )) : (
                                        renderEmpty()
                                    )
                                }

                                {addChannelBtn()}
                            </SortableContext>
                        : 
                        <KanbanColumnSkeleton />
                        }
                    </Box>
                </Stack>
            </Stack>
        </DndContext>
    );

    return (
        <DashboardContent
            maxWidth={false}
            sx={{
                ...cssVars,
                flex: '1 1 0',
                display: 'flex',
                overflow: 'hidden',
                flexDirection: 'column',
            }}
        >
            <HeaderSection
                heading="Kênh học tập"
                links={[
                    { name: 'Tổng quan', href: paths.dashboard.root },
                    { name: 'Kênh học tập' },
                ]}
            />
            {renderList()}

            <ChannelForm
                open={open}
                onClose={handleCloseForm}
                onSubmit={handleSubmitChannel}
                classData={classes}
                userData={users}
                selectedId={selectedIdChannel}
            />
        </DashboardContent>
    );
}