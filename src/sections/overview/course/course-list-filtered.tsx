import {
    Box,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Container,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

type Course = {
    id: string;
    title: string;
    coverUrl: string;
    totalDuration: number;
    totalStudents: number;
    price: number;
};

const CourseCard = ({ course }: { course: Course }) => (
    <Card sx={{ width: '100%', height: '100%' }}>
        <CardMedia component="img" height="140" image={course.coverUrl} alt={course.title} />
        <CardContent>
            <Typography variant="subtitle1" noWrap>
                {course.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Thời lượng: {course.totalDuration} phút
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Học viên: {course.totalStudents}
            </Typography>
            <Typography variant="subtitle2" color="primary">
                Giá: {course.price}₫
            </Typography>
        </CardContent>
    </Card>
);

type CourseListPageProps = {
    courses: Course[];
};

const topics = ['Công nghệ', 'Kinh doanh', 'Thiết kế', 'Marketing', 'Giáo dục'];

export default function CourseListFiltered({ courses }: CourseListPageProps) {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 4,
                    alignItems: 'flex-start',
                    flexDirection: { xs: 'column', md: 'row' },
                }}
            >
                {/* Sidebar filter */}
                <Box
                    sx={{
                        width: { xs: '100%', md: 260 },
                        position: 'sticky',
                        top: 80,
                        flexShrink: 0,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Bộ lọc
                    </Typography>

                    {/* Accordion: Sắp xếp */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<Iconify icon={'icon-park:more-app'} />}>
                            <Typography variant="subtitle2">Sắp xếp</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />} label="Mới nhất" />
                                <FormControlLabel control={<Checkbox />} label="Giá tăng dần" />
                                <FormControlLabel control={<Checkbox />} label="Giá giảm dần" />
                                <FormControlLabel control={<Checkbox />} label="Nhiều học viên nhất" />
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>

                    {/* Accordion: Chủ đề */}
                    <Accordion>
                        <AccordionSummary expandIcon={<Iconify icon={'icon-park:more-app'} />}>
                            <Typography variant="subtitle2">Chủ đề</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormGroup>
                                {topics.map((topic) => (
                                    <FormControlLabel
                                        key={topic}
                                        control={<Checkbox />}
                                        label={topic}
                                    />
                                ))}
                            </FormGroup>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{ my: 2 }} />
                </Box>
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        display: { xs: 'none', md: 'block' },
                    }}
                />
                <Divider
                    orientation="horizontal"
                    flexItem
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        my: 2,
                    }}
                />
                {/* Danh sách khóa học */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 3,
                        flex: 1,
                    }}
                >
                    <Box width={'100%'} p={3} display={'flex'} justifyContent={'center'}>
                        <Typography variant='h4'>Toàn bộ khóa học</Typography>
                    </Box>
                    {courses.map((course) => (
                        <Box
                            key={course.id}
                            sx={{
                                width: {
                                    xs: '100%',
                                    sm: 'calc(50% - 12px)', // 2 cột
                                    md: 'calc(33.333% - 16px)', // 3 cột
                                    lg: 'calc(25% - 18px)', // 4 cột
                                },
                            }}
                        >
                            <CourseCard course={course} />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}
