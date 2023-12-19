import PropTypes from "prop-types";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { useToasts } from "react-toast-notifications";
// import { routeControler } from "src/utils/role-controler";
import { useEffect } from "react";
import {
  Box,
  Card,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,

} from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import DeleteModal from "src/components/Modals/DeleteModal";
import EditProductModal from "src/components/Modals/EditModal/EditAnswer-modal";


import { Scrollbar } from "src/components/scrollbar";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";

export const CustomersTable = (props) => {
  const {
    count = 0,
    type,
    items = [],
  
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 0,
    getDate,
  } = props;
  const { createData, fetchData, data } = useFetcher();

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];
  const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

  const router = usePathname();
  const {addToast} = useToasts();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;

  // const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);




  

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{localization.table.name + " uz"}</TableCell>
                <TableCell>{localization.table.name + " ru"}</TableCell>
                <TableCell>{localization.table.name + " en"}</TableCell>
                <TableCell>{localization.table.info + " uz"}</TableCell>

                <TableCell>{localization.table.info + " ru"}</TableCell>
                <TableCell>{localization.table.info + " en"}</TableCell>

                <TableCell>{localization.table.created_at}</TableCell>
                <TableCell>{localization.action}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const createdAt = format(customer?.created_at, "dd/MM/yyyy");
                const customAt = format(
                  new Date(customer?.custom_date ? customer?.custom_date : null)?.getTime(),
                  "dd/MM/yyyy HH:mm"
                );

                return (
                  <TableRow hover key={customer._id}>
                    <TableCell>{customer.titleuz}</TableCell>
                    <TableCell>{customer.titleru}</TableCell>
                    <TableCell>{customer.titleen}</TableCell>
                    <TableCell>{customer.subtitleuz}</TableCell>
                    <TableCell>{customer.subtitleru}</TableCell>
                    <TableCell>{customer.subtitleen}</TableCell>
                    <TableCell>{createdAt}</TableCell>
                    {/* {!!checkAccess && ( */}
                    <TableCell>
                      <EditProductModal row={customer} route={`answer`} getDatas={getDate} />
                      <DeleteModal route={`answer/${customer._id}`} getDatas={getDate} />
                    </TableCell>
                    {/* )} */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        labelRowsPerPage={localization.table.rows_per_page}
        count={count}
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
  type: PropTypes.string,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSubmit: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};


