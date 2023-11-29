import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import { useMediaQuery, MenuItem, SvgIcon } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import IconButton from "@mui/material/IconButton";
import PlusIcon from "@heroicons/react/24/solid/PencilSquareIcon";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
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

export default function AddClientModal({ row, route, getDatas, type, data }) {
  const { createData } = useFetcher();
  const [open, setOpen] = React.useState(false);
  const matches = useMediaQuery("(min-width:500px)");

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
      name: row.name,
      mainCategory: row.mainCategory,
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2).required("Name is required"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const newData = { name: values.name, mainCategory: values?.mainCategory || "" };
        createData(`/${route}/${row._id}`, newData, "PATCH", getDatas);
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
          {type === "expensesCategory"
            ? localization.modal.addCategory.edit
            : localization.modal.addCategory.subedit}
        </BootstrapDialogTitle>
        <form noValidate
onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            {type === "expensesCategory" ? (
              <Stack spacing={3}
width={matches ? 400 : null}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label={localization.table.name}
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.name}
                />
              </Stack>
            ) : (
              <Stack spacing={3}
width={matches ? 400 : null}>
                <TextField
                  error={!!(formik.touched.mainCategory && formik.errors.mainCategory)}
                  fullWidth
                  select
                  helperText={formik.touched.mainCategory && formik.errors.mainCategory}
                  label={localization.modal.addCategory.category}
                  name="mainCategory"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.mainCategory}
                >
                  {data &&
                    data.map((item) => (
                      <MenuItem key={item?._id}
value={item?._id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label={localization.table.name}
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.name}
                />
              </Stack>
            )}
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
