import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';
import { ClassFilters } from 'src/types/classes';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
    onResetPage: (event: string[]) => Promise<void>;
    filters: UseSetStateReturn<ClassFilters>;
};

export function ClassFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
    const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;
    const handleRemoveGrade = useCallback(
        (inputValue: string) => {
            const newValue = currentFilters.grade.filter((item) => item !== inputValue);

            onResetPage(newValue);
            updateFilters({ grade: newValue });
        },
        [onResetPage, updateFilters, currentFilters.grade]
    );

    const handleReset = useCallback(() => {
        onResetPage([]);
        resetFilters();
    }, [onResetPage, resetFilters]);

    return (
        <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
            <FiltersBlock label="Khối lớp:" isShow={!!currentFilters.grade.length}>
                {currentFilters.grade.map((item) => (
                    <Chip {...chipProps} key={item} label={item} onDelete={() => handleRemoveGrade(item)} />
                ))}
            </FiltersBlock>
        </FiltersResult>
    );
}
