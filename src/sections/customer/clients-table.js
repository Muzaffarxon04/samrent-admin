import PropTypes from "prop-types";
import { format } from "date-fns";
import { useState } from "react";
import { routeControler } from "src/utils/role-controler";

import { usePathname } from "next/navigation";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,

} from "@mui/material";

import GetProductModal from "src/components/Modals/GetProductModal";
import DeleteModal from "src/components/Modals/DeleteModal";
import { Scrollbar } from "src/components/scrollbar";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import EditAdmin from "src/components/Modals/EditModal/EditAdmin-modal";


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
    data,
  } = props;
  const router = usePathname();
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find((item) => item == router);

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];
  const [open, setOpen] = useState(false);



  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              {
                <TableRow>
                  <TableCell>{localization.sidebar.fullname}</TableCell>
                  <TableCell>{localization.table.phone_number}</TableCell>

                  <TableCell>{localization.table.created_at}</TableCell>
                 
                </TableRow>
              }
            </TableHead>
            <TableBody>
              <GetProductModal handleClose={() => setOpen(false)}
open={open}
data={data} />
              {items.map((customer, index) => {
                const createdAt = format(customer?.created_at, "dd/MM/yyyy HH:mm");

                return (
                  <TableRow hover key={customer._id}>
                    <TableCell>
                      {customer?.name} {customer?.surname}
                    </TableCell>
                    <TableCell>
                      <a href={`tel:${customer?.phone}`}>{customer?.phone}</a>
                    </TableCell>
                    <TableCell>{createdAt}</TableCell>
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
