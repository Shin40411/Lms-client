import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getSubjectById } from "src/api/subjects";
import { Scrollbar } from "src/components/scrollbar";
import { SbjItem } from "src/types/subject";

type Props = DrawerProps & {
    subjectId: string;
    open: boolean;
    onClose: () => void;
};

export function SubjectDetails({ subjectId, open, onClose, ...other }: Props) {
    const [subjectItem, setSubjectItem] = useState<SbjItem | null>(null);

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            try {
                const data = await getSubjectById(subjectId);
                setSubjectItem(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSubjectDetails();
    }, [subjectId]);

    const subjectProperties = () => (
        <>
            <Stack spacing={1.5}>

                {subjectItem && (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'row', typography: 'caption', textTransform: 'capitalize' }}>
                            <Box component="span" sx={{ width: '25%', color: 'text.secondary', mr: 2 }}>
                                Tên môn học
                            </Box>
                            <Box sx={{ width: '75%' }}>
                                {subjectItem.name}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', typography: 'caption', textTransform: 'capitalize' }}>
                            <Box component="span" sx={{ width: '25%', color: 'text.secondary', mr: 2 }}>
                                Mã môn học
                            </Box>
                            <Box sx={{ width: '75%' }}>
                                {subjectItem.code}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'row', typography: 'caption', textTransform: 'capitalize' }}>
                            <Box component="span" sx={{ width: '25%', color: 'text.secondary', mr: 2 }}>
                                Mô tả
                            </Box>
                            <Box sx={{ width: '75%' }}>
                                {subjectItem.description}
                            </Box>
                        </Box>
                    </>
                )}
            </Stack>
        </>
    );

    console.log(subjectId);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{
                backdrop: { invisible: true },
                paper: { sx: { width: 420 } },
            }}
            {...other}
        >
            <Scrollbar>
                <Stack
                    spacing={2.5}
                    sx={{ px: 3, py: 2, justifyContent: 'center', bgcolor: 'background.neutral' }}
                >
                    <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                        Chi tiết môn {subjectItem?.name || 'Môn học'}
                    </Typography>
                </Stack>
                <Stack spacing={2} sx={{ p: 3 }}>
                    {subjectProperties()}
                </Stack>
            </Scrollbar>
        </Drawer>
    );
}