import { Avatar, Box, Card, CardProps, Chip, Divider, IconButton, ListItemText, MenuItem, MenuList, Tooltip, Typography } from "@mui/material";
import { useBoolean, UseBooleanReturn, usePopover } from "minimal-shared/hooks";
import { varAlpha } from "minimal-shared/utils";
import { _socials } from "src/_mock";
import AvatarShape from "src/assets/illustrations/avatar-shape";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { Image } from "src/components/image";
import { CONFIG } from "src/global-config";
import { ClassItem } from "src/types/classes";
import { ClassDetails } from "./class-details";

type Props = CardProps & {
    classgr: ClassItem;
    onEdit: (classItem: ClassItem) => void;
    openEdit: (event: React.MouseEvent<HTMLElement>) => void;
    confirmDelete: UseBooleanReturn;
    onDelete: (id: string) => void;
};

export function ClassCard({ classgr, onEdit, openEdit, confirmDelete, onDelete, sx, ...other }: Props) {
    const menuActions = usePopover();

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            slotProps={{ arrow: { placement: 'right-top' } }}
        >
            <MenuList>
                <MenuItem onClick={(e) => { openEdit(e), onEdit(classgr), menuActions.onClose() }}>
                    <Iconify icon="fluent-color:edit-24" />
                    Chỉnh sửa
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        confirmDelete.onTrue(),
                            menuActions.onClose(),
                            onDelete(classgr.id)
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <Iconify icon="fluent-color:dismiss-circle-32" />
                    Xóa
                </MenuItem>
            </MenuList>
        </CustomPopover>
    );

    const detailsDrawer = useBoolean();

    const renderClassDetails = () => (
        <ClassDetails
            classItem={classgr}
            open={detailsDrawer.value}
            onClose={detailsDrawer.onFalse}
        />
    );

    return (
        <>
            <Card sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
                <Box sx={{ position: 'relative' }}>
                    <AvatarShape
                        sx={{
                            left: 0,
                            // right: 0,
                            zIndex: 10,
                            mx: 'auto',
                            bottom: -26,
                            position: 'absolute',
                        }}
                    />

                    <Avatar
                        alt={classgr.name}
                        src={classgr.homeroomTeacher.avatar}
                        sx={{
                            left: 40,
                            // right: 0,
                            width: 64,
                            height: 64,
                            zIndex: 11,
                            mx: 'auto',
                            bottom: -32,
                            position: 'absolute',
                        }}
                    />

                    <Tooltip title="Xem chi tiết lớp" onClick={detailsDrawer.onTrue}>
                        <Image
                            onClick={detailsDrawer.onTrue}
                            src={`${CONFIG.assetsDir}/assets/illustrations/Classes.jpg`}
                            alt={classgr.homeroomTeacher.username}
                            ratio="16/9"
                            slotProps={{
                                overlay: {
                                    sx: (theme) => ({
                                        bgcolor: varAlpha(theme.vars.palette.common.blackChannel, 0.2),
                                        cursor: 'pointer'
                                    }),
                                },
                            }}
                        />
                    </Tooltip>

                    <Chip
                        avatar={
                            <Iconify icon="fluent-color:people-20"
                                sx={{ bgcolor: 'transparent' }}
                            />
                        }
                        label={`${classgr?._count.students}`}
                        sx={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            zIndex: 9,
                            userSelect: 'none'
                        }}
                        color="default"
                    />

                    <IconButton
                        color={menuActions.open ? 'inherit' : 'default'}
                        onClick={menuActions.onOpen}
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 0,
                            border: 0,
                            bgcolor: 'transparent',
                            cursor: 'pointer',
                            zIndex: 9
                        }}
                    >
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Box>
                        <ListItemText
                            sx={{ mt: 5, mb: 1 }}
                            primary="Chủ nhiệm"
                            secondary={`${classgr.homeroomTeacher.lastName} ${classgr.homeroomTeacher.firstName}`}
                            slotProps={{
                                primary: { sx: { typography: 'caption' } },
                                secondary: { sx: { typography: 'subtitle2', mt: 0.5 } },
                            }}
                        />
                    </Box>
                    <Box>
                        <ListItemText
                            sx={{ mt: 5, mb: 1 }}
                            primary="SĐT"
                            secondary={classgr.homeroomTeacher.phone}
                            slotProps={{
                                primary: { sx: { typography: 'caption' } },
                                secondary: { sx: { typography: 'subtitle2', mt: 0.5 } },
                            }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box
                    sx={{
                        py: 3,
                        display: 'grid',
                        typography: 'subtitle1',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                    }}
                >
                    {[
                        { label: 'Tên lớp', value: classgr.name },
                        { label: 'Mô tả', value: classgr.description },
                        { label: 'Khối', value: classgr.grade },
                    ].map((stat) => (
                        <Box key={stat.label} sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
                            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                                {stat.label}
                            </Box>
                            <Typography variant="subtitle2" color="text.primary" fontSize={12}>
                                {stat.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Card>
            {renderMenuActions()}
            {renderClassDetails()}
        </>
    );
}
