import { Box, Button, Dialog, DialogTitle, TextField } from "@mui/material";

type renameGroupProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    name: string;
    onNameChange: (value: string) => void;
}
export default function ChatRenameGroup({ open, onClose, onSubmit, name, onNameChange }: renameGroupProps) {
    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle> Đổi tên nhóm</DialogTitle>
            <Box sx={{ px: 3, pb: 2, pt: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Đặt tên cho nhóm của bạn..."
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Đóng
                    </Button>
                    <Button variant="contained" onClick={onSubmit} disabled={!name}>
                        Xác nhận
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}