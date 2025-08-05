import { Box, Pagination } from "@mui/material";
import { useCallback, useState } from "react";
import { ClassCard } from "./class-card";
import { ClassItem, ClassListResponse } from "src/types/classes";
import { UseBooleanReturn } from "minimal-shared/hooks";

type Props = {
    classes: ClassListResponse | null;
    onEdit: (classItem: ClassItem) => void;
    openEdit: (event: React.MouseEvent<HTMLElement>) => void;
    confirmDelete: UseBooleanReturn;
    onDelete: (id: string) => void;
};
const rowsPerPage = 8;

export function ClassList({ classes, onEdit, confirmDelete, onDelete, openEdit }: Props) {
    const classItems = classes?.results ?? [];
    const [page, setPage] = useState(1);


    const handleChangePage = useCallback((event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    }, []);

    const startIndex = (page - 1) * rowsPerPage;
    const paginatedClasses = classItems.slice(startIndex, startIndex + rowsPerPage);
    const pageCount = Math.ceil(classItems.length / rowsPerPage);

    return (
        <Box sx={{ p: 4 }}>
            <Box
                sx={{
                    gap: 3,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
                }}
            >
                {paginatedClasses
                    .map((c) => (
                        <ClassCard
                            key={c.id}
                            classgr={c}
                            onEdit={onEdit}
                            openEdit={openEdit}
                            confirmDelete={confirmDelete}
                            onDelete={onDelete}
                        />
                    ))}
            </Box>
            {pageCount > 0 && (
                <Pagination
                    count={pageCount}
                    page={page}
                    shape="circular"
                    onChange={handleChangePage}
                    sx={{
                        mt: { xs: 5, md: 8 },
                        mx: 'auto',
                        '.MuiPagination-ul': {
                            justifyContent: 'center',
                        },
                    }}
                />
            )}
        </Box>
    );
}