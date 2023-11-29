import PropTypes from "prop-types";
import Image from "next/image";
import { format, sub } from "date-fns";
import {
  Box,
  Card,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,

} from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import { useEffect } from "react";
import DeleteModal from "src/components/Modals/DeleteModal";
import EditCompanyModal from "src/components/Modals/EditModal/EditCountry-modal";
import { Scrollbar } from "src/components/scrollbar";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

export const CustomersTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    getDate,
    type,
    setSubId,
    subId
  } = props;
  const router = useRouter();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
 const { lang } = useSelector((state) => state.localiztion);
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
  const { createData, fetchData, data } = useFetcher();

 const { localization } = Content[lang];


    useEffect(() => {
      type === "mobile" && subId !== "all" && fetchData(`/mobile/maincategory/all`, "mobile");

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, subId]);
  
  
  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            {type === "bot" ? (
              <TableHead>
                <TableRow>
                  <TableCell>{localization.table.name}</TableCell>
                  <TableCell>{localization.table.created_at}</TableCell>
                  {/* <TableCell>{localization.action}</TableCell> */}
                </TableRow>
              </TableHead>
            ) : (
              <TableHead>
                <TableRow>
                  {type !== "category" && subId !== "all" && (
                    <TableCell>{localization.table.image}</TableCell>
                  )}
                  <TableCell>{localization.table.image }</TableCell>
                  <TableCell>{localization.table.name + " " + localization.uz}</TableCell>
                  <TableCell>{localization.table.name + " " + localization.ru}</TableCell>
                  <TableCell>{localization.table.name + " " + localization.en}</TableCell>
                  <TableCell>{localization.table.created_at}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {items.map((customer) => {
                const createdAt = format(customer?.created_at, "dd/MM/yyyy");

                return (
                  <>
                    {type === "mobile" ? (
                      <TableRow
                        hover
                        key={customer._id}
                        onClick={() => {
                          if (subId === "all") {
                            setSubId(customer._id);
                          } else if (type !== "category") {
                            router.push(`/mobile/countries/${customer._id}`);
                          }
                        }}
                      >
                        {subId !== "all" && (
                          <TableCell>
                            <img
                              src={BaseUrl + "/file/mobileCategory/" + customer.image}
                              alt="img"
                              width={60}
                              height={60}
                            />
                          </TableCell>
                        )}
                        <TableCell>{customer.nameuz}</TableCell>
                        <TableCell>{customer.nameru}</TableCell>
                        <TableCell>{customer.nameen}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <EditCompanyModal
                            data={data}
                            subId={subId}
                            row={customer}
                            route={subId === "all" ? "mobile/maincategory" : `mobile/category`}
                            getDatas={getDate}
                          />
                          <DeleteModal
                            route={
                              subId === "all"
                                ? `mobile/maincategory/${customer._id}`
                                : `mobile/category/${customer._id}`
                            }
                            getDatas={getDate}
                          />
                        </TableCell>
                      </TableRow>
                    ) : type === "bot" ? (
                      <TableRow
                        hover
                        key={customer._id}
                        onClick={() => {
                          if (subId === "all") {
                            setSubId(customer._id);
                          } else if (type !== "category") {
                            router.push(`/bot/categories/${customer._id}`);
                          }
                        }}
                      >
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                        {/* <TableCell onClick={(e) => e.stopPropagation()}>
                          <EditCompanyModal
                            row={customer}
                            route={
                              subId === "all"
                                ? "botcategory"
                                : subId && subId !== "all"
                                ? "botsubcategory"
                                : `category`
                            }
                            getDatas={getDate}
                          />
                          <DeleteModal
                            route={
                              subId === "all"
                                ? `botcategory/${customer._id}`
                                : subId && subId !== "all"
                                ? `botsubcategory/${customer._id}`
                                : `category/${customer._id}`
                            }
                            getDatas={getDate}
                          />
                        </TableCell> */}
                      </TableRow>
                    ) : (
                      <TableRow hover key={customer._id}>
                        <TableCell>
                          <img
                            src={BaseUrl + "/file/banners/" + customer?.image}
                            alt="image"
                            width={150}
                            height={100}
                            style={{ borderRadius: 10 }}
                          />
                        </TableCell>
                        <TableCell>{customer.titleuz}</TableCell>
                        <TableCell>{customer.titleru}</TableCell>
                        <TableCell>{customer.titleen}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                        <TableCell>
                          <DeleteModal
                            route={`banner/${customer._id}`
                            }
                            getDatas={getDate}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        labelRowsPerPage={localization.table.rows_per_page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CustomersTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
