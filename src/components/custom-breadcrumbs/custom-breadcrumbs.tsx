import type { Theme, SxProps } from '@mui/material/styles';
import type { BreadcrumbsProps } from '@mui/material/Breadcrumbs';

import Breadcrumbs from '@mui/material/Breadcrumbs';

import { BackLink } from './back-link';
import { MoreLinks } from './more-links';
import { BreadcrumbsLink } from './breadcrumb-link';
import {
  BreadcrumbsRoot,
  BreadcrumbsHeading,
  BreadcrumbsContent,
  BreadcrumbsContainer,
  BreadcrumbsSeparator,
} from './styles';

import type { MoreLinksProps } from './more-links';
import type { BreadcrumbsLinkProps } from './breadcrumb-link';
import { useSettingsContext } from '../settings';

// ----------------------------------------------------------------------

export type CustomBreadcrumbsSlotProps = {
  breadcrumbs: BreadcrumbsProps;
  moreLinks: Omit<MoreLinksProps, 'links'>;
  heading: React.ComponentProps<typeof BreadcrumbsHeading>;
  content: React.ComponentProps<typeof BreadcrumbsContent>;
  container: React.ComponentProps<typeof BreadcrumbsContainer>;
};

export type CustomBreadcrumbsSlots = {
  breadcrumbs?: React.ReactNode;
};

export type CustomBreadcrumbsProps = React.ComponentProps<'div'> & {
  sx?: SxProps<Theme>;
  heading?: string;
  activeLast?: boolean;
  backHref?: string;
  action?: React.ReactNode;
  links?: BreadcrumbsLinkProps[];
  moreLinks?: MoreLinksProps['links'];
  slots?: CustomBreadcrumbsSlots;
  slotProps?: Partial<CustomBreadcrumbsSlotProps>;
};

export function CustomBreadcrumbs({
  sx,
  action,
  backHref,
  heading,
  slots = {},
  links = [],
  moreLinks = [],
  slotProps = {},
  activeLast = false,
  ...other
}: CustomBreadcrumbsProps) {
  const lastLink = links[links.length - 1]?.name;
  const settings = useSettingsContext();
  const renderHeading = () => (
    <BreadcrumbsHeading {...slotProps?.heading}>
      {backHref ? <BackLink href={backHref} label={heading} /> : heading}
    </BreadcrumbsHeading>
  );

  const renderLinks = () =>
    slots?.breadcrumbs ?? (
      <Breadcrumbs sx={{
        // bgcolor: settings.state.colorScheme === 'light' ? 'common.white' : 'common.black',
        bgcolor: 'common.white',
        boxShadow: '0 8px 14px -2px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '0.75rem 1.25rem',
        borderRadius: 35
      }} separator={
        <BreadcrumbsSeparator viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
          />
        </BreadcrumbsSeparator>
      } {...slotProps?.breadcrumbs}>
        {links.map((link, index) => (
          <BreadcrumbsLink
            key={link.name ?? index}
            icon={link.icon}
            href={link.href}
            name={link.name}
            disabled={link.name === lastLink && !activeLast}
          />
        ))}
      </Breadcrumbs>
    );

  const renderMoreLinks = () => <MoreLinks links={moreLinks} {...slotProps?.moreLinks} />;

  return (
    <BreadcrumbsRoot sx={sx} {...other}>
      <BreadcrumbsContainer {...slotProps?.container}>
        <BreadcrumbsContent {...slotProps?.content}>
          {(heading || backHref) && renderHeading()}
          {(!!links.length || slots?.breadcrumbs) && renderLinks()}
        </BreadcrumbsContent>
        {action}
      </BreadcrumbsContainer>

      {!!moreLinks?.length && renderMoreLinks()}
    </BreadcrumbsRoot>
  );
}
