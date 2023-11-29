import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import { SvgIcon, useMediaQuery, MenuItem } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { useFormik } from "formik";
import * as Yup from "yup";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

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
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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

export default function AddCompanyModal({ getDatas, type, subId }) {
  const { loading, error, data, fetchData } = useFetcher();
  const [open, setOpen] = React.useState(false);
  const { lang } = useSelector((state) => state.localiztion);
    const image = React.useRef("")

  const { localization } = Content[lang];
  const matches = useMediaQuery("(min-width:500px)");

  

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onFinish = () => {
    formik.values.nameuz = "";
    formik.values.nameru = "";
    formik.values.nameen = "";
  };

  

  const formik = useFormik({
    initialValues: {
      nameuz: "",
      nameru: "",
      nameen: "",
      category_id: subId !== "all" ? subId : "",
      submit: null,
    },
    validationSchema: Yup.object({
      nameuz: Yup.string().min(2).required("Name is required"),
      nameru: Yup.string().min(2).required("Name is required"),
      nameen: Yup.string().min(2).required("Name is required"),
      nameen: Yup.string().min(1).required("Category is required"),
    }),

    onSubmit: async (values, helpers) => {
        try {

            const formData = new FormData();
            image.current?.files[0] && formData.append('image', image.current?.files[0]);
          formData.append('mainCategory', values.category_id);
            formData.append('nameuz', values.nameuz);
            formData.append('nameen', values.nameen);
            formData.append('nameru', values.nameru);


            const response = await fetch(BaseUrl + "/mobile/category/create", {
                method: 'POST',

                headers: {
                    Authorization: JSON.parse(window.sessionStorage.getItem("authenticated")) || false,
                    lang: lang,
                },
                body: formData,
            });

            const res = await response.json()

            if (res.success) {

                getDatas()
                onFinish()
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

    React.useEffect(() => {
        fetchData(`/mobile/maincategory/all`, "mobile");


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
  return (
    <div>
      <Button
        onClick={handleClickOpen}
        startIcon={
          <SvgIcon fontSize="small">
            <PlusIcon />
          </SvgIcon>
        }
        variant="contained"
      >
        {localization.modal.add}
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {type === "products"
            ? localization.modal.addProduct.addproduct
            : localization.modal.addDeliver.adddeliver}
        </BootstrapDialogTitle>
        <form noValidate onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
                      <Stack spacing={3} width={matches ? 400 : null}>
                          <TextField
                              fullWidth
                              name="image"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              type="file"
                              inputRef={image}
                          />

              {subId == "all" && <TextField
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
                              {data[`/mobile/maincategory/all`]?.categories &&
                                  data[`/mobile/maincategory/all`]?.categories.map((item) => (
                                      <MenuItem key={item?._id}
                                          value={item?._id}>
                                          {item?.[`name${lang || "uz"}`]}
                                      </MenuItem>
                                  ))}
                          </TextField>  }

              <TextField
                error={!!(formik.touched.nameuz && formik.errors.nameuz)}
                fullWidth
                helperText={formik.touched.nameuz && formik.errors.nameuz}
                autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
                label={localization.table.name + " " + localization.en}
                name="nameen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameen}
              />
            </Stack>

            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
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
    </div>
  );
}
