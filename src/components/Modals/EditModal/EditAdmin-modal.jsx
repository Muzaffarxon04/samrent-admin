import * as React from "react";
import PropTypes from "prop-types";
import { useEffect, useCallback } from 'react';
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import { SvgIcon, useMediaQuery } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import PlusIcon from "@heroicons/react/24/solid/PencilSquareIcon";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, TextField, Typography, MenuItem } from "@mui/material";
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

export default function AddClientModal({ getDatas, type, row }) {
  const { lang } = useSelector((state) => state.localiztion);
  const matches = useMediaQuery("(min-width:500px)");

  const { localization } = Content[lang];

  const { createData } = useFetcher();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      name: {
        first_name: row.name.first_name || "",
        last_name: row.name.last_name || ""
      },
      login: row.login,
      role: row.role,
      password: "",
      tel_number:row.tel_number,
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.object({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required')
      }),
      login: Yup.string().required('Login is required'),
      tel_number: Yup.number().required('Telephone number is required'),
      password: Yup.string()
        .matches(
          /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;'<>,.?/_₹]).{6,30}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be between 6 and 30 characters long'
        )
        .required('Password is required').min(6)
    }),

    onSubmit: async (values, helpers) => {
      try {
        const newData = {
          name: {
            first_name: values.name.first_name,
            last_name: values.name.last_name
          },
          login: values.login,
          tel_number: values.tel_number,
          // old_password: Joi.string(),
          new_password: values.password,
        };
        createData(`/admin/${row._id}`, newData, "PATCH", getDatas);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });


  const admin_roles = ['tasischi', 'moliyachi', 'sotuvchi', 'omborchi', 'prorab', 'taminotchi', 'kassir']


  return (
    <>
   
      <IconButton onClick={handleClickOpen}>
        <SvgIcon>
          <PlusIcon color="green" />
        </SvgIcon>
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}>
          {localization.sidebar.edit_admin}

        </BootstrapDialogTitle>
        <form noValidate
          onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}
              width={matches ? 400 : null}>
              <TextField
                autoComplete="off"
                error={!!(formik.touched.name?.first_name && formik.errors.name?.first_name)}
                fullWidth
                helperText={formik.touched.name?.first_name && formik.errors.name?.first_name}
                label={localization.sidebar.first_name}
                name="name.first_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.name.first_name}

              />
              <TextField
                autoComplete="off"
                error={!!(formik.touched.name?.last_name && formik.errors.name?.last_name)}
                fullWidth
                helperText={formik.touched.name?.last_name && formik.errors.name?.last_name}
                label={localization.sidebar.last_name}
                name="name.last_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.name.last_name}

              />
              <TextField
                error={!!(formik.touched.tel_number && formik.errors.tel_number)}
                fullWidth
                helperText={formik.touched.tel_number && formik.errors.tel_number}
                label={localization.table.phone_number}
                name="tel_number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="tel"
                value={formik.values.tel_number}
              />
         
              <TextField
                error={!!(formik.touched.login && formik.errors.login)}
                fullWidth
                helperText={formik.touched.login && formik.errors.login}
                label={localization.login.title}
                name="login"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.login}
              />
              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label={localization.login.password}
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.password}
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
              {localization.modal.add}
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </>
  );
}
