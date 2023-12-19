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
  Select,
  MenuItem

} from "@mui/material";

import DeleteModal from "src/components/Modals/DeleteModal";
import { Scrollbar } from "src/components/scrollbar";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import EditModal from "src/components/Modals/EditModal/EditAdmin-modal";
import useFetcher from "src/hooks/use-fetcher";

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
  const {  loading, error, fetchData, createData } = useFetcher();

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];
  const [open, setOpen] = useState(false);



  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              {type === "leed" ? (
                <TableRow>
                  <TableCell>{localization.table.name}</TableCell>
                  <TableCell>{localization.table.type}</TableCell>
                  <TableCell>{localization.table.phone_number}</TableCell>
                  <TableCell>{localization.table.status}</TableCell>

                  <TableCell>{localization.table.created_at}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>{localization.table.name}</TableCell>
                  <TableCell>{localization.login.title}</TableCell>
                  <TableCell>{localization.table.phone_number}</TableCell>

                  <TableCell>{localization.table.created_at}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {items.map((customer, index) => {
                const createdAt = format(customer?.created_at, "dd/MM/yyyy HH:mm");

                if (type === "leed") {
                  return (
                    <TableRow hover key={customer._id}>
                      <TableCell>{customer?.name}</TableCell>
                      <TableCell>{customer?.car}</TableCell>
                      <TableCell>
                        <a href={`tel:+${customer?.phone}`}>+{customer?.phone}</a>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={customer?.status}
                          onChange={(e) => {
                            try {
                              const newData = { status: e.target.value };
                              createData(`/leed/${customer._id}`, newData, "PATCH", getDate);
                            } catch (err) {
                              console.error(err.message);
                            }
                          }}
                        >
                          <MenuItem value={"active"}>active</MenuItem>
                          <MenuItem value={"inactive"}>inactive</MenuItem>
                          <MenuItem value={"pending"}>pending</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>{createdAt}</TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow hover key={customer._id}>
                    <TableCell>{customer?.name}</TableCell>
                    <TableCell>{customer?.login}</TableCell>
                    <TableCell>
                      <a href={`tel:+${customer?.tel_number}`}>+{customer?.tel_number}</a>
                    </TableCell>
                    <TableCell>{createdAt}</TableCell>
                    <TableCell>
                      <EditModal row={customer} route={`admin`} getDatas={getDate} />
                      <DeleteModal route={`admin/${customer._id}`} getDatas={getDate} />
                    </TableCell>
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
