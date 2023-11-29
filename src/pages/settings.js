import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { SettingsNotifications } from 'src/sections/overview/settings-notifications';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";

const Page = () => {
   const { lang } = useSelector((state) => state.localiztion);

   const { localization } = Content[lang];


  return (
    <>
      <Head>
        <title>Settings | Melek</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4">{localization.sidebar.settings}</Typography>
            <SettingsNotifications />
            <SettingsPassword />
          </Stack>
        </Container>
      </Box>
    </>
  );

  Page.getLayout = (page) => (
    <DashboardLayout>
      {page}
    </DashboardLayout>
  );
}
export default Page;
