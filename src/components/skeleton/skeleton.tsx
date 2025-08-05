import { Box, Skeleton } from '@mui/material';

type SkeletonScreenProps = {
    columns?: number;
    width?: number;
};

export function SkeletonScreen({ columns = 3, width = 480 }: SkeletonScreenProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            {Array.from({ length: columns }).map((_, index) => (
                <Box key={index}>
                    <Skeleton variant="rectangular" width={width} height={118} />
                    <Box sx={{ pt: 0.5 }}>
                        {Array.from({ length: 5 }).map((__, i) => (
                            <Skeleton
                                key={i}
                                width={width}
                                height={10}
                                sx={{ mt: i > 0 ? 0.5 : 0 }}
                            />
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
