import type { SelectChangeEvent } from '@mui/material/Select';
import type { UseSetStateReturn } from 'minimal-shared/hooks';

import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { ClassFilters } from 'src/types/classes';

// ----------------------------------------------------------------------

type Props = {
    onResetPage: (event: string[]) => Promise<void>
    filters: UseSetStateReturn<ClassFilters>;
    options: {
        grade: string[];
    };
};

export function ClassToolbar({ filters, options, onResetPage }: Props) {

    const { state: currentFilters, setState: updateFilters } = filters;

    const handleFilterRole = useCallback(
        (event: SelectChangeEvent<string[]>) => {
            const newValue =
                typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

            onResetPage(newValue);
            updateFilters({ grade: newValue });
        },
        [onResetPage, updateFilters]
    );

    return (
        <>
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
                <InputLabel htmlFor="filter-grade-select">Khối lớp</InputLabel>
                <Select
                    multiple
                    value={currentFilters.grade}
                    onChange={handleFilterRole}
                    input={<OutlinedInput label="Khối lớp" />}
                    renderValue={(selected) => selected.map((value) => value).join(', ')}
                    inputProps={{ id: 'filter-grade-select' }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                >
                    {options.grade.map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={currentFilters.grade.includes(option)}
                            />
                            {option !== 'Sau đại học' ? `Lớp ${option}` : option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );
}
