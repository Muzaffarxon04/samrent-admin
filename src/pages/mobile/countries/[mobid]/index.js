import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography, Breadcrumbs } from "@mui/material";
import { routeControler } from "src/utils/role-controler";
import { usePathname, useRouter } from "next/navigation";


import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/orders-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import useFetcher from 'src/hooks/use-fetcher';
import AddCompanyModal from 'src/components/Modals/AddModal/AddMobileProducts-modal';
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";
import { useSearchParams } from 'next/navigation';



const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};





const Page = ({ subId, setSubId }) => {
  const { data, loading, error, fetchData, createData } = useFetcher();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const ParamId = params.get("mobid");
  const routers = useRouter();
  const router = usePathname();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const { pageCount } = useSelector((state) => state.pageCount);
  const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);
  const initalData1 = data[`/mobile/category/${ParamId}`]?.category[0];
  const initalData2 = data[`/mobile/product/all`]?.products;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initalData = (ParamId === "all" ? initalData2 : initalData1?.mobileProducts) || [];
  
  const [filtered, setFiltered] = useState(initalData || []);
  const customers = useCustomers(filtered, page, rowsPerPage);

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];




  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
      dispatch(changePage({ pageCount: event.target.value }));
      setPage(0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );



  function getCountries() {
    if (ParamId && ParamId !== "all") {
      fetchData(`/mobile/category/${ParamId}`, "mobile");
    }
    fetchData(`/mobile/product/all`, "mobile");
  }

  useEffect(() => {
    getCountries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ParamId]);

    function getCategories() {
      if (categoryId) {
        fetchData(`/mobile/maincategory/${categoryId}`, "mobile");
      }
              fetchData(`/mobile/maincategory/all`, "mobile");

    }

    useEffect(() => {
      getCategories();

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

  function onSearch(e) {
    setSearchValue(e.target.value);
  }



  useEffect(() => {
    try {
      setPage(0);
      setFiltered(
        initalData.filter((user) => {
          if (searchValue == "") {
            return user;
          } else if (
            user?.nameuz?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.nameen?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.nameru?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.nameen?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.titleuz?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.titleen?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.sub_titleen?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.sub_titleru?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.sub_titleuz?.toLowerCase().includes(searchValue.toString()?.toLowerCase()) ||
            user?.titleru?.toLowerCase().includes(searchValue.toString()?.toLowerCase())
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

  

  return (
    <>
      <Head>
        <title>Mobile Products | Melek </title>
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
                {ParamId !== "all" && (
                  <Breadcrumbs aria-label="breadcrumb" sx={{ textTransform: "capitalize" }}>
                    <Typography
                      color="text.primary"
                      onClick={() => {
                        routers.push("/mobile/countries");
                        setSubId("all");
                      }}
                    >
                      {localization.sidebar.delivers}
                    </Typography>
                    <Typography
                      color="text.primary"
                      onClick={() => {
                        routers.push("/mobile/countries");
                        setSubId(subId);
                      }}
                    >
                      {localization.table.seria_id + " " + localization.sidebar.delivers}
                    </Typography>
                    <Typography color="text.primary"> {initalData1?.[`name${lang}`]}</Typography>
                  </Breadcrumbs>
                )}
                <Typography variant="h4" textTransform="capitalize">
                  {localization.sidebar.mobile + " " + localization.sidebar.products}
                </Typography>
              </Stack>

              <div>
                <AddCompanyModal getDatas={getCountries} initalData={initalData1} data={data} />
              </div>
            </Stack>
            <CustomersSearch onSearch={onSearch} type={"country"} />
            <CustomersTable
              count={filtered?.length}
              items={customers}
              setCategoryId={setCategoryId}
              categoryData={data}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              type="mobileproduct"
              getDate={getCountries}
              rowsPerPage={rowsPerPage}
            />
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
