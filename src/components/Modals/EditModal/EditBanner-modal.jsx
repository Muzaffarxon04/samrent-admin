import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {MenuItem} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import useFetcher from "src/hooks/use-fetcher";
import PlusIcon from "@heroicons/react/24/solid/PencilSquareIcon";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

import { useFormik } from "formik";
import * as Yup from "yup";
import { useMediaQuery, Button, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }}
{...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon width={25} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function AddCompanyModal({ row, route, getDatas, data, subId }) {
  const { loading, error, createData } = useFetcher();
  const [open, setOpen] = React.useState(false);
  const matches = useMediaQuery("(min-width:500px)");
  const image = React.useRef("")

  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const formik = useFormik({
    initialValues: {
      nameuz: row.titleuz,
      nameru: row.titleru,
      nameen: row.titleen,
      submit: null,
    },
    validationSchema: Yup.object({
      nameuz: Yup.string().min(2).required("Name is required"),
      nameru: Yup.string().min(2).required("Name is required"),
      nameen: Yup.string().min(2).required("Name is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const newData = { nameuz: values.nameuz, nameru: values.nameru, nameen: values.nameen };

  

          const formData = new FormData();
          image.current?.files[0] && formData.append('image', image.current?.files[0]);
          formData.append('titleuz', values.nameuz);
          formData.append('titleen', values.nameen);
          formData.append('titleru', values.nameru);


          const response = await fetch(BaseUrl + `/banner/${row._id}`, {
            method: 'PATCH',
            headers: {
              Authorization: JSON.parse(window.sessionStorage.getItem("authenticated")) || false,
              lang: lang,
            },
            body: formData,
          });

          const res = await response.json()

          if (res.success) {

            getDatas()
        
          }

          addToast(res.message, {
            appearance: res.success ? "success" : "error",
            autoDismiss: true,
          });

        
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  
  return (
    <>
      <IconButton onClick={handleClickOpen}>
        <SvgIcon>
          <PlusIcon color="green" />
        </SvgIcon>
      </IconButton>

      <BootstrapDialog onClose={handleClose}
aria-labelledby="customized-dialog-title"
open={open}>
        <BootstrapDialogTitle id="customized-dialog-title"
onClose={handleClose}>
          {route !== "mainproducts"
            ? localization.modal.addDeliver.editdeliver
            : localization.modal.addProduct.editproduct}
        </BootstrapDialogTitle>
        <form noValidate
onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}
              width={matches ? 400 : null}>
            
              <TextField
                fullWidth
                name="image"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="file"
                inputRef={image}
              />
              <TextField
                error={!!(formik.touched.nameuz && formik.errors.nameuz)}
                fullWidth
                helperText={formik.touched.nameuz && formik.errors.nameuz}
                label={localization.table.name + " " + localization.en}
                name="nameuz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameuz}
              />
              <TextField
                error={!!(formik.touched.nameru && formik.errors.nameru)}
                fullWidth
                helperText={formik.touched.nameru && formik.errors.nameru}
                label={localization.table.name + " " + localization.ru}
                name="nameru"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameru}
              />
              <TextField
                error={!!(formik.touched.nameen && formik.errors.nameen)}
                fullWidth
                helperText={formik.touched.nameen && formik.errors.nameen}
                label={localization.table.name + " " + localization.en}
                name="nameen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameen}
              />
  
            </Stack>

            {formik.errors.submit && (
              <Typography color="error"
sx={{ mt: 3 }}
variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              fullWidth
              size="large"
              sx={{ my: 1 }}
              type="submit"
              variant="contained"
            >
              {localization.update}
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
}
