/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Card, Container, Stack, SvgIcon, Typography, Breadcrumbs } from "@mui/material";
import { routeControler } from "src/utils/role-controler";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image';
import { Scrollbar } from "src/components/scrollbar";

import DeleteModal from "src/components/Modals/DeleteModal";
import EditMobileCarModal from "src/components/Modals/EditModal/EditMobileCar-modal";

import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { applyPagination } from 'src/utils/apply-pagination';
import useFetcher from 'src/hooks/use-fetcher';
import AddCompanyModal from 'src/components/Modals/AddModal/AddMobileCar-modal';
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";
import Link from 'next/link';






const Page = ({ subId, setSubId }) => {
  const { data, loading, error, fetchData, createData } = useFetcher();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const ParamId = params.get("id");
  const routers = useRouter();
  const router = usePathname();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
const datas = data[`/mobilecar/${ParamId}`] ? data[`/mobilecar/${ParamId}`]?.car : [];



const [mainImage, setMainImage] = useState("");

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];


  useEffect(() => {
    datas?.images && setMainImage(datas?.images[0]);
  }, [datas?.images]);
  
  



  function getCountries() {
      fetchData(`/mobilecar/${ParamId}`);
  }

  useEffect(() => {
    getCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ParamId]);




  return (
    <>
      <Head>
        <title>Cars| SAM AVTO RENT </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ textTransform: "capitalize" }}>
                  <Link href="/mobile/cars">
                    {" "}
                    {localization.sidebar.mobile + " " + localization.sidebar.cars}
                  </Link>

                  <Typography color="text.primary">{datas?.name}</Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <Card sx={{ p: 2 }}>
              <Scrollbar>
                <Box sx={{ minWidth: 800, display: "flex", gap: "40px" }}>
                  <Box display={"flex"} gap={2}>
                    <Box display={"flex"} flexDirection={"column"} gap={1}>
                      {datas?.images &&
                        datas?.images?.map((item, index) => (
                          <Box
                            key={index}
                            onClick={() => {
                              setMainImage(item);
                            }}
                          >
                            <Image
                              placeholder="blur" // You can use "empty" or a custom element as well
                              blurDataURL="/assets/errors/error-404.png"
                              style={{ borderRadius: 4 }}
                              src={`${BaseUrl}/file/cars/${item}`}
                              alt={datas?.name}
                              width={80}
                              height={80}
                            />
                          </Box>
                        ))}
                    </Box>
                    {mainImage && (
                      <Image
                        placeholder="blur" // You can use "empty" or a custom element as well
                        blurDataURL="/assets/errors/error-404.png"
                        style={{ borderRadius: 10 }}
                        src={`${BaseUrl}/file/cars/${mainImage}`}
                        alt="image"
                        width={380}
                        height={350}
                      />
                    )}
                  </Box>
                  <Box display={"flex"} flexDirection={"column"} gap={2}>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.name}:
                      <Typography fontWeight={550} fontSize={22}>
                        {datas.name}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.info}:
                      <Typography fontWeight={550} fontSize={22}>
                        {datas.title}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.fuel_type}:
                      <Typography fontWeight={550} fontSize={22}>
                        {datas.fuel_type}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.new_price}:
                      <Typography fontWeight={550} fontSize={22}>
                        {datas.cost}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.type}:
                      <Typography fontWeight={550} fontSize={22}>
                        {datas.type}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.max_speed}:
                      <Typography fontWeight={550} fontSize={22}>
                        {datas.max_speed}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.place}:
                      <Typography fontWeight={550} fontSize={22}>
                        {datas.place}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.baggage}:
                      <Typography fontWeight={550} fontSize={22}>
                        {datas.baggage}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.conditioner}:
                      <Typography
                        color={!datas.conditioner && "red"}
                        fontWeight={550}
                        fontSize={22}
                      >
                        {localization?.table?.[datas.conditioner]}
                      </Typography>
                    </Typography>
                    <Typography
                      textTransform={"capitalize"}
                      fontWeight={700}
                      fontSize={25}
                      display={"flex"}
                      alignItems={"center"}
                      gap={1}
                    >
                      {localization.table.tinting}:
                      <Typography color={!datas.tinting && "red"} fontWeight={550} fontSize={22}>
                        {localization?.table?.[datas.tinting]}
                      </Typography>
                    </Typography>
                  </Box>
                </Box>
                  {Object.keys(datas).length && (
                <Box>
                    <EditMobileCarModal row={datas} getDatas={getCountries} />
                  <DeleteModal
                  route={`/mobilecar/${datas?._id}`}
                  getDatas={() => {
                    routers.push("/mobile/cars");
                  }}
                  />
                </Box>
                  )}
              </Scrollbar>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
