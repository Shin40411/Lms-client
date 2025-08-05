import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

export const BreadcrumbsRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const BreadcrumbsHeading = styled('h6')(({ theme }) => ({
  ...theme.typography.h4,
  margin: 0,
  padding: 0,
  color: '#000',
  fontWeight: 700,
  display: 'inline-flex',
}));

export const BreadcrumbsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
}));

export const BreadcrumbsContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  gap: theme.spacing(1),
  flexDirection: 'column',
}));

export const BreadcrumbsSeparator = styled('svg')(({ theme }) => ({
  width: 16,
  height: 16,
  fill: theme.vars?.palette?.text?.disabled ?? theme.palette.text.disabled,
  flexShrink: 0,
}));
