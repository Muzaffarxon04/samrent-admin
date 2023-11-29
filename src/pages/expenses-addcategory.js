import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { routeControler } from "src/utils/role-controler";
import { usePathname } from "next/navigation";


import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Breadcrumbs,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Grid,
  IconButton,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import useFetcher from "src/hooks/use-fetcher";
import AddCompanyModal from "src/components/Modals/AddModal/AddExpensesCategory-modal";
import DeleteModal from "src/components/Modals/DeleteModal";
import Content from "src/Localization/Content";
import { useSelector, useDispatch } from "react-redux";
import { changePage } from "src/slices/paginationReduser";
import PlusIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import EditExpenses from "src/components/Modals/EditModal/EditExpenses-modal";
import Link from "next/link";
const useCustomers = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const Page = () => {
  const { data, loading, error, fetchData } = useFetcher();
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(0);
  const { pageCount } = useSelector((state) => state.pageCount);
  const [rowsPerPage, setRowsPerPage] = useState(pageCount || 5);
  const initalData = data["/category/all"]?.category;
  const [filtered, setFiltered] = useState(initalData || []);

  const router = usePathname();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setPage(0);
      setFiltered(
        initalData.filter((user) => {
          if (searchValue == "") {
            return user;
          } else if (user?.name.toLowerCase().includes(searchValue)) {
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
    fetchData(`/category/all`);
  }

  useEffect(() => {
    getCountries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch(e) {
    setSearchValue(e.target.value);
  }

  return (
    <>
      <Head>
        <title>Category | Arif Solar</title>
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
            <Stack direction="row"
justifyContent="space-between"
spacing={4}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link href="/expenses-sum">{localization.sidebar.expenses}</Link>
                <Typography color="text.primary">
                  {localization.modal.addCategory.category}
                </Typography>
              </Breadcrumbs>
              <Stack spacing={1}></Stack>
              {checkAccess && (
                <div>
                  <AddCompanyModal initalData={initalData}
getDatas={getCountries} />
                </div>
              )}
            </Stack>
            <CustomersSearch type="countrys"
onSearch={onSearch} />
            <Grid container
flexDirection={"column"}>
              {filtered
                ? filtered.map((item) => (
                    <>
                      <Box key={item._id}
display={"flex"}
alignItems={"center"}
flexWrap={"wrap"}>
                        <Box display="flex">
                          <Typography variant="h4"
m={2}>
                            {item.name}
                          </Typography>
                          {checkAccess && (
                            <>
                              <EditExpenses
                                type="expensesCategory"
                                row={item}
                                route={`expenses`}
                                getDatas={getCountries}
                              />
                              <DeleteModal
                                type={"expenses"}
                                route={`expenses/${item._id}`}
                                getDatas={getCountries}
                              />
                            </>
                          )}
                        </Box>
                        {checkAccess && <AddCompanyModal
                          type={item._id}
                          initalData={initalData}
                          getDatas={getCountries}
                        />}
                      </Box>
                      <Grid display={"flex"}
flexWrap={"wrap"}>
                        {item.subCategories.length
                          ? item.subCategories.map((el) => (
                              <Grid key={el._id}
xs={12}
m={2}
sm={6}
lg={3}>
                                <Card elevation={8}>
                                  <CardContent>
                                    <Stack
                                      alignItems="flex-start"
                                      justifyContent="space-between"
                                      spacing={3}
                                    >
                                      <Stack spacing={1}>
                                        <Typography variant="h5">{el.name}</Typography>
                                      </Stack>
                                     {checkAccess && <Box>
                                        <EditExpenses
                                          row={el}
                                          data={initalData}
                                          route={`expenses`}
                                          getDatas={getCountries}
                                        />
                                        <DeleteModal
                                          type={"expenses"}
                                          route={`expenses/${el._id}`}
                                          getDatas={getCountries}
                                        />
                                      </Box>}
                                    </Stack>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))
                          : null}
                      </Grid>
                    </>
                  ))
                : null}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
