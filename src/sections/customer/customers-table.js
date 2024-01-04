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
import EditCompanyModal from "src/components/Modals/EditModal/EditReview-modal";
import EditCarModal from "src/components/Modals/EditModal/EditCar-modal";
import EditMobileCarModal from "src/components/Modals/EditModal/EditMobileCar-modal";
import { Scrollbar } from "src/components/scrollbar";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

 const [open, setOpen] = React.useState(false);

 const handleClickOpen = (images) => {
   setOpen({ status: true, images });
 };

 const handleClose = () => {
   setOpen({ status: false, images: [] });
 };

  
  
  return (
    <Card>
      <AlertDialogSlide open={open} handleClose={handleClose} />

      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              {type === "cars" ? (
                <TableRow>
                  <TableCell>{localization.table.image}</TableCell>
                  <TableCell>{localization.table.name}</TableCell>
                  <TableCell>{localization.table.info}</TableCell>
                  <TableCell>{localization.sidebar.type}</TableCell>
                  <TableCell>{localization.table.new_price}</TableCell>
                </TableRow>
              ) : type === "webcars" ? (
                <TableRow>
                  <TableCell>{localization.table.image}</TableCell>
                  <TableCell>{localization.table.name}</TableCell>
                  <TableCell>{localization.table.info}</TableCell>
                  <TableCell>{localization.table.new_price}</TableCell>
                  <TableCell>{localization.table.from}</TableCell>
                  <TableCell>{localization.sidebar.type}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
              ) : type === "review" ? (
                <TableRow>
                  <TableCell>{localization.table.name}</TableCell>
                  <TableCell>{localization.table.info}</TableCell>
                  <TableCell>{localization.table.star}</TableCell>
                  <TableCell>{localization.table.lang}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell>{localization.table.image}</TableCell>
                  <TableCell>{localization.table.name + " UZ"}</TableCell>
                  <TableCell>{localization.table.name + " RU"}</TableCell>
                  <TableCell>{localization.table.name + " EN"}</TableCell>
                  <TableCell>{localization.action}</TableCell>
                </TableRow>
              )}
            </TableHead>

            <TableBody>
              {items.map((customer) => {
                // const createdAt = format(customer?.created_at, "dd/MM/yyyy");

                return (
                  <>
                    {type === "cars" ? (
                      <TableRow
                        onClick={() => router.push(`/mobile/cars/${customer._id}`)}
                        hover
                        key={customer._id}
                      >
                        <TableCell>
                          {!!customer.images && (
                            <Image
                              style={{ borderRadius: 6 }}
                              src={BaseUrl + "/file/cars/" + customer.images[0]}
                              alt="img"
                              width={140}
                              height={100}
                            />
                          )}
                        </TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.title}</TableCell>
                        {type === "webcars" && <TableCell>{customer.from}</TableCell>}
                        <TableCell>{customer.type}</TableCell>
                        <TableCell>{customer.cost}</TableCell>
                      </TableRow>
                    ) : type === "webcars" ? (
                      <TableRow hover key={customer._id}>
                        <TableCell onClick={() => handleClickOpen(customer.images)}>
                          {!!customer.images && (
                            <Image
                              priority
                              src={BaseUrl + "/file/cars/" + customer.images[0]}
                              alt="image"
                              width={150}
                              height={100}
                              style={{ borderRadius: 10 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.title}</TableCell>
                        <TableCell>{customer.cost}</TableCell>
                        <TableCell>{customer.from}</TableCell>
                        <TableCell>{customer.type}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <EditCarModal row={customer} route={`webcar`} getDatas={getDate} />
                          <DeleteModal route={`/webcar/${customer._id}`} getDatas={getDate} />
                        </TableCell>
                      </TableRow>
                    ) : type === "review" ? (
                      <TableRow hover key={customer._id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.body}</TableCell>
                        <TableCell>{customer.star}</TableCell>
                        <TableCell>{customer.lang}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <EditCompanyModal row={customer} route={`review`} getDatas={getDate} />
                          <DeleteModal route={`/review/${customer._id}`} getDatas={getDate} />
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow hover key={customer._id}>
                        <TableCell>
                          <Image
                            priority
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
                        {/* <TableCell>{createdAt}</TableCell> */}
                        <TableCell>
                          <DeleteModal route={`banner/${customer._id}`} getDatas={getDate} />
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





 function AlertDialogSlide({ handleClose, open }) {
  // Assuming Transition is defined and imported elsewhere
  // import Transition from '...';

  return (
    <React.Fragment>
      <Dialog
        open={open.status}
        TransitionComponent={Transition} // Ensure Transition is correctly imported or defined
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent >
          {open.images && (
            <Swiper
              style={{ width:"100%", height:"100%"}}
              // width={550}
              modules={[Navigation]} // Add Navigation and Pagination modules
              navigation // Enable navigation arrows
           
              spaceBetween={30}
              slidesPerView={1}
            >
              {open.images.map((image, index) => (
                <SwiperSlide key={index} >
                  <Image
                    width={500}
                    height={400}
                    src={`${BaseUrl}/file/cars/${image}`}
                    alt={`Car ${index + 1}`}
                    style={{ width: "100%", height: "350px" }} // Adjust size as needed
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}