import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { SubjectItem } from './subject-item';
import { SbjItem } from 'src/types/subject';
import { UseBooleanReturn } from 'minimal-shared/hooks';


// ----------------------------------------------------------------------

type Props = {
  subjects: SbjItem[];
  rowSelected: Dispatch<SetStateAction<SbjItem | null>>;
  openForm: UseBooleanReturn;
  confirmDelete: UseBooleanReturn;
  setSelectedId: Dispatch<SetStateAction<string>>;
  openDetails: UseBooleanReturn;
};

const ITEMS_PER_PAGE = 8;

export function SubjectList({ subjects, rowSelected, openForm, confirmDelete, setSelectedId, openDetails }: Props) {
  const [page, setPage] = useState(1);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedSubjects = subjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const pageCount = Math.ceil(subjects.length / ITEMS_PER_PAGE);

  return (
    <>
      <Box
        sx={{
          gap: 3,
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
        }}
      >
        {paginatedSubjects.map((s) => (
          <SubjectItem
            key={s.id}
            sx={{
              boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 15px 0px'
            }}
            subject={s}
            rowSelected={rowSelected}
            onDelete={confirmDelete}
            openForm={openForm}
            setSelectedId={setSelectedId}
            openDetails={openDetails}
          />
        ))}
      </Box>

      {pageCount > 0 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          sx={{
            mt: { xs: 8, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
