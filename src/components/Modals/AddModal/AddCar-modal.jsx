import * as React from "react";
import { useEffect, useRef } from "react";
import Content from "src/Localization/Content";
import { useToasts } from "react-toast-notifications";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@heroicons/react/24/solid/XMarkIcon";
import { SvgIcon, useMediaQuery } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Button, Stack, TextField, Typography, MenuItem } from "@mui/material";
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import { useSearchParams } from "next/navigation";

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


export default function AddOrderModal({ getDatas, company }) {
  const { lang } = useSelector((state) => state.localiztion);
  const matches = useMediaQuery("(min-width:500px)");
  const params = useSearchParams()
  const ParamId = params.get("id")
  const {addToast} = useToasts()
  const { localization } = Content[lang];
  const image = React.useRef("")
  const { fetchData, data, loading, error, createData } = useFetcher();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const onFinish = () => {
    formik.values.nameuz = "";
    formik.values.category_id = "";
    formik.values.nameen = "";
    formik.values.nameru = "";
    formik.values.cost = "";
  };

  const formik = useFormik({
    initialValues: {
      category_id:"" ,
      nameen: "",
      nameuz: "",
      nameru: "",
      image: "",
      cost: "",
      submit: null,
    },
    validationSchema: Yup.object({
      category_id: Yup.string().required(" Type is required"),
      nameuz: Yup.string().min(2).required(" Name is required"),
      nameru: Yup.string().min(2).required(" Info is required"),
      nameen: Yup.number().required(" From days is required"),
      cost: Yup.number().required(" Cost is required"),

    }),

    onSubmit: async (values, helpers) => {
      try {

        const formData = new FormData();
        for (let index = 0; index < image.current?.files?.length; index++) {
         formData.append('images', image.current?.files[index]);  
        }
        formData.append('name', values.nameuz);
        formData.append('title', values.nameru);
        formData.append('from', values.nameen);
        formData.append('cost', values.cost);
        formData.append('type', values.category_id);
       


        const response = await fetch(BaseUrl + "/webcar/create", {
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



  const carCategories = [
    {
      name: "Start",
      value: "Start",
    },
    {
      name: "Standart",
      value: "Standart",
    },
    {
      name: "Premium",
      value: "Premium",
    },
    {
      name: "Luxury",
      value: "Luxury",
    }
  ]


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
      <BootstrapDialog onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle id="customized-dialog-title"
          onClose={handleClose}>
          {localization.modal.addProduct.addproduct} 
        </BootstrapDialogTitle>
        <form noValidate
          onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}
              width={matches ? 400 : null}>
              <TextField
                fullWidth
                name="image"
                inputProps={{
                  multiple: true
                }}
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
                label={localization.sidebar.type}
                name="category_id"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.category_id}
              >
                {carCategories &&
                  carCategories.map((item) => (
                    <MenuItem key={item?.value}
                      value={item?.value}>
                      {item?.name}
                    </MenuItem>
                  ))}
              </TextField>

              <TextField

                error={!!(formik.touched.nameuz && formik.errors.nameuz)}
                fullWidth
                helperText={formik.touched.nameuz && formik.errors.nameuz}
                label={localization.table.name }
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
                label={localization.table.info}
                name="nameru"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameru}
              />  <TextField

                error={!!(formik.touched.nameen && formik.errors.nameen)}
                fullWidth
                helperText={formik.touched.nameen && formik.errors.nameen}
                label={localization.table.from}
                name="nameen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nameen}
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
              {localization.modal.add}
            </Button>
          </DialogActions>
        </form>
      </BootstrapDialog>
    </div>
  );
}
