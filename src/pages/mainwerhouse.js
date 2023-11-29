import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, IconButton, Typography, useMediaQuery } from "@mui/material";
import { routeControler } from "src/utils/role-controler";
import { usePathname } from "next/navigation";


import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/orders-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import useFetcher from "src/hooks/use-fetcher";
import AddCompanyModal from "src/components/Modals/AddModal/AddBrand-modal";
import { XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";

const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const Page = () => {
  const dispatch = useDispatch();

  const { data, loading, error, fetchData } = useFetcher();
  const [isTranfer, setIsTranfer] = useState(false);
  const matches = useMediaQuery("(max-width:480px)");

  const router = usePathname();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);

  const [searchValue, setSearchValue] = useState("");
  const [image, setImage] = useState(false);
  const [page, setPage] = useState(0);
  const { pageCount } = useSelector((state) => state.pageCount);
  const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);
  const initalData = data["/brand/all"]?.brands;
  const [filtered, setFiltered] = useState(initalData || []);
  const customers = useCustomers(filtered, page, rowsPerPage);
  const [tramferedData, setTramferedData] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];


  useEffect(() => {
    try {
      setPage(0);
      setFiltered(
        initalData.filter((user) => {
          if (searchValue == "") {
            return user;
          } else if (
            user?.nameuz.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.title1uz.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.title2uz.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.info1uz.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.nameru.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.title1ru.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.title2ru.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.info1ru.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.nameen.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.title1en.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.title2en.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.info1en.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.info2en.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.info2ru.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.info2uz.toLowerCase().includes(searchValue.toLowerCase())
          ) {
            return user;
          }
        })
      );
    } catch (error) {
      setFiltered([]);
      console.error("Filtered Groups Error => ", error.message);
    }
  }, [initalData, searchValue]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
    dispatch(changePage({ pageCount: event.target.value }));
    setPage(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function getCountries() {
    fetchData(`/brand/all`);
  }

  useEffect(() => {
      getCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch(e) {
    setSearchValue(e.target.value);
  }



 

  // checked All items
  const filtereds = filtered?.filter((row) => row.amount > 0);

 



  return (
    <>
      <Head>
        <title>Brands | Melek</title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          {image ? (
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "#00000082",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                setImage(false);
              }}
            >
              <Box
                sx={{
                  width: "90%",

                  alignItems: "flex-start",
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Box
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  sx={{
                    width: "85%",
                    height: 500,
                    borderRadius: 2,
                    background: "#ffffff",
                    overflow: "hidden",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    "& img": {
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                    },
                  }}
                >
                  <img alt="Shipment Image"
src={image} />
                  {/* <Image alt="image not found" height={550} /> */}
                </Box>
                <IconButton sx={{ ml: 1, position: "absolute", top: 0, right: -20 }}>
                  <SvgIcon fontSize="large">
                    <XMarkIcon color="#ffffff" />
                  </SvgIcon>
                </IconButton>
              </Box>
            </Box>
          ) : null}
          <Stack spacing={3}>
            <Stack direction="row"
flexWrap={"wrap"}
justifyContent="space-between"
spacing={4}>
              <Stack spacing={1}
mb={2}>
                <Typography variant="h4">{localization.sidebar.main_warehouse}</Typography>
              </Stack>

            <AddCompanyModal data={data}
getDatas={getCountries} />
            </Stack>
            <CustomersSearch type="mainwarehouse"
onSearch={onSearch} />
            <CustomersTable
              filtered={filtereds}
              count={filtered?.length}
              items={customers}
              setImage={setImage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              extraDatas={data}
              page={page}
              type="brand"
              getDate={getCountries}
              rowsPerPage={rowsPerPage}
              isTranfer={isTranfer}
              setIsTranfer={setIsTranfer}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
