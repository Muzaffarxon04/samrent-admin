import * as React from "react";
import { useEffect } from "react";

import { NumericFormatCustom } from 'src/components/FormatedImput';
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
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
import { Box, Button, MenuItem, Stack, SvgIcon, TextField, Typography, useMediaQuery } from "@mui/material";
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

export default function AddCompanyModal({ row, route, getDatas, company, ParamId, data }) {
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
      category_id: row?.subCategory_id?._id,
      nameen: row?.nameen,
      nameuz: row?.nameuz,
      nameru: row?.nameru,
      infouz: row?.infouz,
      inforu: row?.inforu,
      infoen: row?.infoen,
      image: "",
      cost: row?.cost,
      submit: null,
    },
    validationSchema: Yup.object({
      nameuz: Yup.string().min(2).required(" Name is required"),
      nameru: Yup.string().min(2).required(" Name is required"),
      nameen: Yup.string().min(2).required(" Name is required"),
      category_id: Yup.string().min(1).required("Category is required"),

    }),

    onSubmit: async (values, helpers) => {
      try {
        const formData = new FormData();
        image.current?.files[0] && formData.append('image', image.current?.files[0]);
        formData.append('subCategory_id', values.category_id);
        formData.append('nameuz', values.nameuz);
        formData.append('nameen', values.nameen);
        formData.append('nameru', values.nameru);
        formData.append('inforu', values.inforu);
        formData.append('infouz', values.infouz);
        formData.append('infoen', values.infoen);
        formData.append('cost', values.cost);



        const response = await fetch(BaseUrl + `/botproduct/${row?._id}`, {
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
          {localization.modal.addProduct.editproduct}

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
                error={!!(formik.touched.category_id && formik.errors.category_id)}
                fullWidth
                select
                helperText={formik.touched.category_id && formik.errors.category_id}
                label={localization.table.country}
                name="category_id"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.category_id}
              >
                {(data && data['/botsubcategory/all']?.subCategories) &&
                  data['/botsubcategory/all']?.subCategories.map((item) => (
                    <MenuItem key={item?._id}
                      value={item?._id}>
                      {item?.name}
                    </MenuItem>
                  ))}
              </TextField>

              <TextField

                error={!!(formik.touched.nameuz && formik.errors.nameuz)}
                fullWidth
                helperText={formik.touched.nameuz && formik.errors.nameuz}
                label={localization.table.name + " " + localization.uz}
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
              />  <TextField

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
              <TextField
                error={!!(formik.touched.infouz && formik.errors.infouz)}
                fullWidth
                helperText={formik.touched.infouz && formik.errors.infouz}

                label={localization.table.info + " " + localization.uz}
                name="infouz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.infouz}
              />
              <TextField
                error={!!(formik.touched.inforu && formik.errors.inforu)}
                fullWidth
                helperText={formik.touched.inforu && formik.errors.inforu}
                label={localization.table.info + " " + localization.ru}
                name="inforu"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.inforu}
              />
              <TextField
                error={!!(formik.touched.infoen && formik.errors.infoen)}
                fullWidth
                helperText={formik.touched.infoen && formik.errors.infoen}
                label={localization.table.info + " " + localization.en}
                name="infoen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.infoen}
              />
              <TextField
                error={!!(formik.touched.cost && formik.errors.cost)}
                fullWidth
                helperText={formik.touched.cost && formik.errors.cost}
                label={localization.table.new_price}
                name="cost"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.cost}
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
