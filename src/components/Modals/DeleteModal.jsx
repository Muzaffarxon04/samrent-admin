import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { IconButton, SvgIcon } from "@mui/material";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { useToasts } from "react-toast-notifications";
import {routeControler} from "src/utils/role-controler"
export default function DeleteModal({ route, getDatas, type }) {
  const isAuthenticated = JSON.parse(window.sessionStorage.getItem("authenticated")) || false;
  const { lang } = useSelector((state) => state.localiztion);
  const { addToast } = useToasts();
  
  const { localization } = Content[lang];
  const router = usePathname()
  const user = JSON.parse(window.sessionStorage.getItem("user")) || false;
  const checkAccess = routeControler[user.role]?.edit?.find(item => item == router);

  const [open, setOpen] = React.useState(false);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    fetch(`${BaseUrl}/${route}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: isAuthenticated,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        handleClose();
        addToast(data.message, { appearance: data.success ? "success" : "error", autoDismiss: true });
        if (data.success) {
          getDatas();
          
        }
      });
  };

  return (
    <>
     <IconButton onClick={handleClickOpen}>
        <SvgIcon>
          <TrashIcon color="red" />
        </SvgIcon>
      </IconButton>
      {/* <Button onClick={handleClickOpen} sx={{ mt: .5 }} variant="outlined" color="error" startIcon={<TrashIcon width={15} />}>
               {localization.delete}

             </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ textAlign: "center" }}>
          <DialogTitle id="alert-dialog-title">{localization.alerts.confirmdelete}</DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}> {localization.alerts.no}</Button>
                  <Button onClick={handleDelete}
                      autoFocus>
            {localization.alerts.ok}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
