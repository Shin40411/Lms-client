import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type AuthSplitSectionProps = BoxProps & {
  title?: string;
  method?: string;
  imgUrl?: string;
  subtitle?: string;
  layoutQuery?: Breakpoint;
  methods?: {
    path: string;
    icon: string;
    label: string;
  }[];
};

export function AuthSplitSection({
  sx,
  method,
  methods,
  layoutQuery = 'md',
  title = 'Manage the job',
  imgUrl = `${CONFIG.assetsDir}/assets/illustrations/edu-tech.webp`,
  subtitle = '',
  ...other
}: AuthSplitSectionProps) {

  const features = [
    {
      text: 'Quản lý lớp học dễ dàng',
      icon: 'healthicons:i-training-class',
    },
    {
      text: 'Theo dõi tiến độ học tập',
      icon: 'solar:chart-square-outline',
    },
    {
      text: 'Thi trực tuyến',
      icon: 'solar:clipboard-text-outline',
    },
    {
      text: 'Khoá học trực tuyến',
      icon: 'solar:video-library-outline',
    },
    {
      text: 'Chat trực tuyến',
      icon: 'solar:chat-line-outline',
    },
  ];

  return (
    <Box
      sx={[
        (theme) => ({
          background: 'rgb(7, 141, 238)',
          px: { lg: 0, xl: 3 },
          pb: { lg: 0, xl: 3 },
          // pt: 'var(--layout-header-desktop-height)',
          width: 1,
          maxWidth: 600,
          display: 'none',
          position: 'relative',
          [theme.breakpoints.up(layoutQuery)]: {
            gap: 8,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          maxHeight: { md: 'unset', lg: 700, xl: 700 },
          top: { md: 0, lg: '10%', xl: '10%' },
          left: {
            xs: 0,
            sm: 0,
            md: 0,
            lg: '10%',
            xl: '30%',
          },
          overflow: 'hidden',
          borderRadius: { md: 0, lg: 2, xl: 2 },
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(5px)',
            transform: 'scale(1.1)',
            zIndex: 0,
            borderRadius: 2
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'common.white',
            height: '100%',
            px: 7,
          }}
        >
          <Typography variant="h3" sx={{ textAlign: 'left', textTransform: 'uppercase' }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography sx={{ textAlign: 'left', mt: 2 }}>
              {subtitle}
            </Typography>
          )}

          <Box component="ul" sx={{ mt: 3 }}>
            {features.map((feature, index) => (
              <Box
                key={index}
                component="li"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1.5,
                  listStyle: 'none',
                }}
              >
                <Iconify
                  icon={feature.icon as any}
                  width={24}
                  height={24}
                  style={{ marginRight: 12, color: '#00e676' }}
                />
                <Typography variant="body1">{feature.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
