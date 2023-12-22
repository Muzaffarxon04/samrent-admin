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
import { SvgIcon, useMediaQuery, FormControlLabel, Switch } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
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


export default function EditMobileCarModal({ getDatas, row }) {
  const { lang } = useSelector((state) => state.localiztion);
  const matches = useMediaQuery("(min-width:500px)");
  const params = useSearchParams()
  const ParamId = params.get("id")
  const {addToast} = useToasts()
  const { localization } = Content[lang];
  const image = React.useRef("")


  const [status, setStatus] = React.useState(row?.status);
  const [tinting, setTinting] = React.useState(row?.tinting);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const formik = useFormik({
    initialValues: {   
      name:row?.name,
      title:row?.title,
      fuel_type:row?.fuel_type,
      type:row?.type,
      place: row?.place,
      max_speed:row?.max_speed,
      conditioner:row?.conditioner,
      tinting:row?.tinting,
      baggage:row?.baggage,
      cost:row?.cost,
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      type: Yup.string().required("Type is required"),
      title: Yup.string().min(2).required(" Name is required"),
      place: Yup.number().required("Place is required"),
      baggage: Yup.number().required("baggage is required"),
      max_speed: Yup.string().required("max speed is required"),
      fuel_type: Yup.string().required(" From days is required"),
      cost: Yup.number().required(" Cost is required"),

    }),
    onSubmit: async (values, helpers) => {
      try {
        const formData = new FormData();
        for (let index = 0; index < image.current?.files?.length; index++) {
         formData.append('images', image.current?.files[index]);  
        }
        formData.append('name', values.name);
        formData.append('title', values.title);
        formData.append('type', values.type);
        formData.append('cost', values.cost);
        formData.append('place', values.place);
        formData.append('fuel_type', values.fuel_type);
        formData.append('baggage', values.baggage);
        formData.append('conditioner', status);
        formData.append('max_speed', values.max_speed);
        formData.append('tinting', tinting);
       


        const response = await fetch(BaseUrl +`/mobilecar/${row._id}`, {
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

  const carFuelType = [
    {
      name: "Gas",
      value: "gas",
    },
    {
      name: "Gasoline",
      value: "gasoline",
    },
    {
      name: "electr",
      value: "electr",
    },
  
  ]



  return (
    <>
      <IconButton
        onClick={handleClickOpen}

      >
        <SvgIcon>
          <PencilSquareIcon />
        </SvgIcon>
      </IconButton>
      <BootstrapDialog onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}>
        <BootstrapDialogTitle  id="customized-dialog-title"
          onClose={handleClose}>
          {localization.modal.add + " " + localization.sidebar.mobile + " " + localization.sidebar.cars} 
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
              <TextField

                error={!!(formik.touched.title && formik.errors.title)}
                fullWidth
                helperText={formik.touched.title && formik.errors.title}
                label={localization.table.titile}
                name="title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.title}
              />

              <TextField
                error={!!(formik.touched.type && formik.errors.type)}
                fullWidth
                select
                helperText={formik.touched.type && formik.errors.type}
                label={localization.sidebar.type}
                name="type"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.type}
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
                error={!!(formik.touched.fuel_type && formik.errors.fuel_type)}
                fullWidth
                select
                helperText={formik.touched.fuel_type && formik.errors.fuel_type}
                label={localization.table.fuel_type}
                name="fuel_type"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.fuel_type}
              >
                {carFuelType &&
                  carFuelType.map((item) => (
                    <MenuItem key={item?.value}
                      value={item?.value}>
                      {item?.name}
                    </MenuItem>
                  ))}
              </TextField>
              <Box display={"flex"} justifyItems={"center"} gap={"20px"}>
                <FormControlLabel label={localization.table.tinting}
                  control={<Switch
                    onChange={(e) => setTinting(e.target.checked)}
                    value={tinting} />} />
                <FormControlLabel label={localization.table.conditioner}
                  control={<Switch
                 
                    onChange={(e) => setStatus(e.target.checked)}
                    value={status} />} />
         </Box>
              <TextField
                error={!!(formik.touched.max_speed && formik.errors.max_speed)}
                fullWidth
                helperText={formik.touched.max_speed && formik.errors.max_speed}
                label={localization.table.max_speed}
                name="max_speed"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.max_speed}
              />
              <TextField     error={!!(formik.touched.baggage && formik.errors.baggage)}
                fullWidth
                helperText={formik.touched.baggage && formik.errors.baggage}
            
                label={localization.table.baggage}
                name="baggage"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.baggage}
              />
              <TextField
                error={!!(formik.touched.place && formik.errors.place)}
                fullWidth
                helperText={formik.touched.place && formik.errors.place}
                label={localization.table.place}
                name="place"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.place}
              />
              <TextField error={!!(formik.touched.cost && formik.errors.cost)}
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
    </>
  );
}
