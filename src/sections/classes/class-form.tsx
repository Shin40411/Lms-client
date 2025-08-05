
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { toast } from 'src/components/snackbar';
import { Field } from 'src/components/hook-form';
import { ClassItem, ClassListResponse, ClassResponse, Grade } from 'src/types/classes';
import { z } from 'zod';
import { Autocomplete, CardHeader, Chip, MenuItem, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { createClass, getClasses, getDetails, updateClass } from 'src/api/classes';
import { _mockGrade } from 'src/_mock/_mockGrade';
import { _mockYear } from 'src/_mock/_mockYear';
import { getUsers } from 'src/api/users';
// ----------------------------------------------------------------------

// ------------------- SCHEMA ---------------------
export const ClassSchema = z.object({
    name: z.string().min(1, { message: 'Tên lớp là bắt buộc' }),
    description: z.string().min(1, { message: 'Mô tả là bắt buộc' }),
    grade: z.string().min(1, { message: 'Khối lớp là bắt buộc' }),
    academicYear: z.string().min(1, { message: 'Niên khóa là bắt buộc' }),
    homeroomTeacherId: z.string().min(1, { message: 'Giáo viên chủ nhiệm là bắt buộc' }),
    teacherIds: z.array(z.string()).optional(),
    studentIds: z.array(z.string()).optional(),
});

export type ClassSchemaType = z.infer<typeof ClassSchema>;

type Teacher = { id: string; name: string };
type Student = { id: string; name: string };

type Props = {
    currentClass?: ClassItem;
    teachers: Teacher[];
    students: Student[];
    handleClose: () => void;
    resetResponse: Dispatch<SetStateAction<ClassListResponse | null>>;
    resetTeachers: Dispatch<SetStateAction<{
        id: string;
        name: string;
    }[]>>;
    resetStudents: Dispatch<SetStateAction<{
        id: string;
        name: string;
    }[]>>;
};

export function ClassForm({ currentClass, teachers, students, handleClose, resetResponse, resetTeachers, resetStudents }: Props) {
    const [activeStep, setActiveStep] = useState(0);
    const steps = ['Thông tin lớp học', 'Phân bổ giáo viên & học sinh'];
    const [members, setMembers] = useState<ClassResponse | null>(null);
    const [mergedStudents, setMergedStudents] = useState<Student[]>(students);

    const methods = useForm<ClassSchemaType>({
        resolver: zodResolver(ClassSchema),
        defaultValues: {
            name: '',
            description: '',
            grade: '',
            academicYear: '',
            homeroomTeacherId: '',
            teacherIds: [],
            studentIds: [],
        },
    });

    const {
        handleSubmit,
        reset,
        control,
        trigger,
        formState: { isSubmitting },
    } = methods;

    useEffect(() => {
        const fetchMembersInClass = async () => {
            if (currentClass) {
                const res = await getDetails(currentClass?.id || '');
                setMembers(res);
                const newStudents = res.students.map((s) => ({
                    id: s.id,
                    name: `${s.lastName} ${s.firstName}`,
                }));
                setMergedStudents((prev) => {
                    const existingIds = new Set(prev.map((s) => s.id));
                    const uniqueNew = newStudents.filter((s) => !existingIds.has(s.id));
                    return [...prev, ...uniqueNew];
                });
                reset({
                    name: currentClass?.name || '',
                    description: currentClass?.description || '',
                    grade: currentClass?.grade || '',
                    academicYear: currentClass?.academicYear || '',
                    homeroomTeacherId: currentClass?.homeroomTeacher?.id || '',
                    teacherIds: res?.teachers.map((t) => t.user.id) || [],
                    studentIds: res?.students.map((s) => s.id) || [],
                });
            }
        };

        fetchMembersInClass();
    }, [currentClass, reset]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const bodyPayload = {
                homeroomTeacherId: data.homeroomTeacherId,
                name: data.name,
                grade: data.grade as Grade,
                description: data.description,
                academicYear: data.academicYear,
                students: data.studentIds ?? [],
                teachers: data.teacherIds ?? [],
            };

            if (currentClass) {
                await updateClass(currentClass.id, bodyPayload);
                toast.success('Cập nhật dữ liệu thành công');
            } else {
                await createClass(bodyPayload);
                toast.success('Tạo mới thành công');
            }

            const dataReset = await getClasses();
            resetResponse(dataReset);

            const teacherReset = await getUsers('?isTeacher=true');
            resetTeachers(teacherReset.results.map((item) => ({
                id: item.id,
                name: item.lastName + ' ' + item.firstName,
            })));

            const studentReset = await getUsers('?isStudent=true&hasClassroom=false');
            resetStudents(studentReset.results.map((item) => ({
                id: item.id,
                name: item.lastName + ' ' + item.firstName,
            })));

            reset();
            handleClose?.();
        } catch (error) {
            console.error(error);
            toast.error('Đã có lỗi xảy ra');
        }
    });

    const handleNext = async () => {
        const isValid = await trigger(['name', 'description', 'grade', 'homeroomTeacherId']);
        if (isValid) setActiveStep(1);
    };

    return (
        <FormProvider {...methods}>
            <Card sx={{ p: 3 }}>
                <CardHeader
                    title={currentClass ? 'Chỉnh sửa lớp học' : 'Tạo mới lớp học'}
                    sx={{ px: 0, pt: 0, mb: 2 }}
                />

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={onSubmit}>
                    <Stack spacing={3}>
                        {activeStep === 0 ? (
                            <>
                                <Field.Text name="name" label="Tên lớp học" />
                                <Field.Text name="description" label="Mô tả lớp học" />
                                <Field.Text
                                    name="grade"
                                    label="Khối lớp"
                                    select
                                    SelectProps={{ native: false }}
                                >
                                    {_mockGrade.map((g) => (
                                        <MenuItem key={g} value={g}>
                                            {g}
                                        </MenuItem>
                                    ))}
                                </Field.Text>
                                <Field.Text
                                    name="academicYear"
                                    label="Niên khóa"
                                    select
                                    SelectProps={{ native: false }}
                                >
                                    {_mockYear.map((g) => (
                                        <MenuItem key={g} value={g}>
                                            {g}
                                        </MenuItem>
                                    ))}
                                </Field.Text>

                                <Controller
                                    name="homeroomTeacherId"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} fullWidth select label="Giáo viên chủ nhiệm">
                                            {teachers.map((teacher) => (
                                                <MenuItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            </>
                        ) : (
                            <>
                                <Controller
                                    name="teacherIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            options={teachers}
                                            getOptionLabel={(option) => option?.name ?? ''}
                                            value={
                                                field.value
                                                    ?.map((id) =>
                                                        teachers.find((t) => t.id === id) ||
                                                        members?.teachers.find((m) => m.user.id === id)?.user
                                                    )
                                                    .filter((t): t is { id: string; name: string } => !!t) || []
                                            }
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue.map((v) => v.id));
                                            }}
                                            noOptionsText="Không còn giáo viên nào trống"
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        variant="outlined"
                                                        label={option.name}
                                                        {...getTagProps({ index })}
                                                        key={option.id}
                                                    />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Chọn thêm giáo viên"
                                                    placeholder="Giáo viên"
                                                />
                                            )}
                                        />
                                    )}
                                />

                                <Controller
                                    name="studentIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Autocomplete
                                            multiple
                                            options={mergedStudents}
                                            getOptionLabel={(option) => option?.name ?? ''}
                                            value={
                                                field.value
                                                    ?.map((id) =>
                                                        mergedStudents.find((s) => s.id === id) ||
                                                        members?.students.find((s) => s.id === id)
                                                    )
                                                    .filter((s): s is { id: string; name: string } => !!s) || []
                                            }
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue.map((v) => v.id));
                                            }}
                                            noOptionsText="Không còn học sinh nào trống"
                                            renderTags={(value, getTagProps) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        variant="outlined"
                                                        label={option.name}
                                                        {...getTagProps({ index })}
                                                        key={option.id}
                                                    />
                                                ))
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Chọn học sinh"
                                                    placeholder="Chọn học sinh"
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </>
                        )}

                        <Stack direction="row" justifyContent="space-between">
                            {activeStep > 0 ? (
                                <Button type="button" variant="outlined" onClick={() => setActiveStep((s) => s - 1)}>
                                    Quay lại
                                </Button>
                            ) : (
                                <Button type="button" variant="outlined" onClick={() => handleClose()}>
                                    Hủy bỏ
                                </Button>
                            )}

                            {activeStep < steps.length - 1 ? (
                                <Button type="button" variant="contained" onClick={(e) => {
                                    e.preventDefault();
                                    handleNext();
                                }}>
                                    Tiếp theo
                                </Button>
                            ) : (
                                <Button type="submit" variant="contained" loading={isSubmitting}>
                                    Lưu
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </form>
            </Card>
        </FormProvider>
    );
}

