import { Box, Stack } from "@mui/material";
import { ReactNode } from "react";
import { CONFIG } from "src/global-config";
import { CustomBreadcrumbs } from "../custom-breadcrumbs";
import { useSettingsContext } from "../settings";

type BreadcrumbLink = {
    name: string;
    href?: string;
};

type HeaderSectionProps = {
    heading: string;
    links: BreadcrumbLink[];
    actions?: ReactNode;
};

export default function HeaderSection({ heading, links, actions }: HeaderSectionProps) {
    const settings = useSettingsContext();
    return (
        <Box
            sx={{
                position: 'relative',
                my: { xs: 2, md: 3 },
                px: 4,
                py: 2,
                borderRadius: 2,
                overflow: 'hidden',
                backgroundImage: `url("${CONFIG.assetsDir}/assets/background/header-sec.jpg")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom',
                boxShadow: 5,
                // filter: settings.state.colorScheme === 'dark' ? 'grayScale(1)' : 'none'
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                flexWrap="wrap"
            >
                <CustomBreadcrumbs heading={heading} links={links}
                    // slotProps={{
                    //     heading: {
                    //         sx: {
                    //             WebkitTextStroke: settings.state.colorScheme === 'light' ? '0.5px #fff' : '0.5px #000',
                    //             textStroke: settings.state.colorScheme === 'light' ? '0.5px #fff' : '0.5px #000',
                    //         }
                    //     }
                    // }}
                />

                {actions && <Stack direction="row" spacing={1} zIndex={9}>{actions}</Stack>}
            </Stack>
        </Box>
    );
}