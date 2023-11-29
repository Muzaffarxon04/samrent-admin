import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, Typography, Breadcrumbs } from "@mui/material";
import { routeControler } from "src/utils/role-controler";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import useFetcher from "src/hooks/use-fetcher";
import AddCompanyModal from "src/components/Modals/AddModal/AddMobileCategory-modal";
import AddCategoryModal from "src/components/Modals/AddModal/AddCountry-modal";
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";

const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const Page = ({subIdSecond, setSubIdSecond}) => {
  const { data,  loading, error, fetchData } = useFetcher();
  const [searchValue, setSearchValue] = useState("");

    const router = usePathname();
    const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
    const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);
  
  const [page, setPage] = useState(0);
  const { pageCount } = useSelector((state) => state.pageCount);
  const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initalDatas =
    data[`/mobile/maincategory/${subIdSecond}`]?.[
      subIdSecond == "all" ? "categories" : "category"
    ] || [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initalData = subIdSecond === "all" ? initalDatas : initalDatas?.[0]?.["mobileCategories"] || [];
  const [filtered, setFiltered] = useState(initalData);
  const customers = useCustomers(filtered, page, rowsPerPage);

  


  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setPage(0);
      setFiltered(
        initalData?.filter((user) => {
          if (searchValue == "") {
            return user;
          } else if (
            user?.name.toLowerCase().includes(searchValue)          ) {
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
    fetchData(`/mobile/maincategory/${subIdSecond}`, "mobile");
  }

 

  useEffect(() => {
      getCountries();
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subIdSecond])


  function onSearch(e) {
    setSearchValue(e.target.value);
  }





  return (
    <>
      <Head>
        <title>Mobile Categories | Melek</title>
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
            {subIdSecond !== "all" && (
              <Breadcrumbs aria-label="breadcrumb">
                <Typography
                  color="text.primary"
                  onClick={() => {
                    setSubIdSecond("all");
                  }}
                >
                  {localization.sidebar.mobile + " " + localization.sidebar.delivers}
                </Typography>
                <Typography color="text.primary">{initalDatas[0]?.[`name${lang}`]}</Typography>
              </Breadcrumbs>
            )}
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4" textTransform="capitalize">
                  {subIdSecond !== "all"
                    ? localization.sidebar.mobile +
                      " " +
                      localization.table.seria_id +
                      " " +
                      localization.sidebar.delivers
                    : subIdSecond === "all"
                    ? localization.sidebar.mobile + " " + localization.sidebar.delivers
                    : initalDatas[0]?.name}
                </Typography>
              </Stack>
              <div>
                {subIdSecond === "all" ? (
                  <AddCategoryModal getDatas={getCountries} subId={subIdSecond} type="mobile" />
                ) : (
                  <AddCompanyModal getDatas={getCountries} subId={subIdSecond} type="mobile" />
                )}
              </div>
            </Stack>
            <CustomersSearch type="country" onSearch={onSearch} />
            <CustomersTable
              setSubId={setSubIdSecond}
              subId={subIdSecond}
              type="mobile"
              count={filtered?.length}
              items={customers}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              getDate={getCountries}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
