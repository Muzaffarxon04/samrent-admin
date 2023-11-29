import * as React from "react";
import { useEffect, useRef } from "react";
import { NumericFormatCustom } from "src/components/FormatedImput";
import Content from "src/Localization/Content";
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

  const { localization } = Content[lang];
  const image = React.useRef("")
  const image2 = React.useRef("")
  const image3 = React.useRef("")
  const image4 = React.useRef("")

  const [open, setOpen] = React.useState(false);

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
    formik.values.infouz = "";
    formik.values.inforu = "";
    formik.values.infoen = "";
    formik.values.title2uz = "";
    formik.values.title2ru = "";
    formik.values.title2en = "";
    formik.values.title1uz = "";
    formik.values.title1ru = "";
    formik.values.title1uz = "";
    formik.values.info1uz = "";
    formik.values.info2uz = "";
  };

  const formik = useFormik({
    initialValues: {
      nameuz: "",
      nameru: "",
      nameen: "",
      infouz: "",
      inforu: "",
      infoen: "",
      title1uz: "",
      title1ru: "",
      title1en: "",
      info1uz: "",
      info1ru: "",
      info1en: "",
      box_color1: "#cccccc",
      text_color1: "#000000",
      title2uz: "",
      title2ru: "",
      title2en: "",
      info2uz: "",
      info2ru: "",
      info2en: "",
      box_color2: "#cccccc",
      text_color2: "#000000",
      submit: null,
    },
    validationSchema: Yup.object({
      nameuz: Yup.string().min(2).required(" Name is required"),

    }),

    onSubmit: async (values, helpers) => {
      try {

        const formData = new FormData();
        image.current?.files[0] && formData.append('main_image', image.current?.files[0]);
        image2.current?.files[0] && formData.append('inner_image', image2.current?.files[0]);
        image3.current?.files[0] && formData.append('inner_image1', image3.current?.files[0]);
        image4.current?.files[0] && formData.append('inner_image2', image4.current?.files[0]);
        formData.append("nameuz", values.nameuz);
        formData.append("nameru", values.nameru);
        formData.append("nameen", values.nameen);
        formData.append("infouz", values.infouz);
        formData.append("inforu", values.inforu);
        formData.append("infoen", values.infoen);
        formData.append("title1uz", values.title1uz);
        formData.append("title1ru", values.title1ru);
        formData.append("title1en", values.title1en);
        formData.append("info1uz", values.info1uz);
        formData.append("info1ru", values.info1ru);
        formData.append("info1en", values.info1en);
        formData.append("box_color1", values.box_color1);
        formData.append("text_color1", values.text_color1);
        formData.append("title2uz", values.title2uz);
        formData.append("title2ru", values.title2ru);
        formData.append("title2en", values.title2en);
        formData.append("info2uz", values.info2uz);
        formData.append("info2ru", values.info2ru);
        formData.append("info2en", values.info2en);
        formData.append("box_color2", values.box_color2);
        formData.append("text_color2", values.text_color2);


        const response = await fetch(BaseUrl + "/brand/create", {
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
          {localization.modal.addWarehouse.title}
        </BootstrapDialogTitle>
        <form noValidate
          onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={3}
              width={matches ? 400 : null}>
              <TextField
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="file"
                inputRef={image}
              />
              <TextField
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="file"
                inputRef={image2}
              />
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
                label={localization.table.info + " " + localization.uz}
                name="infoen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.infoen}
              />
              <TextField
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="file"
                inputRef={image3}
              />
              <Box sx={{display:"flex", alignItems:"center"}}>
                <TextField
                  error={!!(formik.touched.title1uz && formik.errors.title1uz)}
                  fullWidth
                  helperText={formik.touched.title1uz && formik.errors.title1uz}
                  label={localization.table.name + " UZ 1"}
                  name="title1uz"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.title1uz}
                />
                <input type="color"
                  style={{ height: "50px", padding: 0 }}
                  name="text_color1"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.text_color1} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  error={!!(formik.touched.title1ru && formik.errors.title1ru)}
                  fullWidth
                  helperText={formik.touched.title1ru && formik.errors.title1ru}
                  label={localization.table.name + " RU 1"}
                  name="title1ru"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.title1ru}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  error={!!(formik.touched.title1en && formik.errors.title1en)}
                  fullWidth
                  helperText={formik.touched.title1en && formik.errors.title1en}
                  label={localization.table.name + " EN 1"}
                  name="title1en"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.title1en}
                />
              </Box>
              <TextField
                  error={!!(formik.touched.info1uz && formik.errors.info1uz)}
                  fullWidth
                  helperText={formik.touched.info1uz && formik.errors.info1uz}
  
                  label={localization.table.info + " UZ 1"}
                  name="info1uz"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.info1uz}
              />
              <TextField
                error={!!(formik.touched.info1ru && formik.errors.info1ru)}
                fullWidth
                helperText={formik.touched.info1ru && formik.errors.info1ru}
                label={localization.table.info + " RU 1"}
                name="info1ru"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.info1ru}
              />
              <TextField
                error={!!(formik.touched.info1en && formik.errors.info1en)}
                fullWidth
                helperText={formik.touched.info1en && formik.errors.info1en}

                label={localization.table.info + " EN 1"}
                name="info1en"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.info1en}
              />
                <TextField
                  error={!!(formik.touched.box_color1 && formik.errors.box_color1)}
                  fullWidth
                  helperText={formik.touched.box_color1 && formik.errors.box_color1}
                  label="Box color"
                  name="box_color1"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="color"
                  value={formik.values.box_color1}
              />
              <TextField
                fullWidth
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="file"
                inputRef={image4}
              />
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  error={!!(formik.touched.title2uz && formik.errors.title2uz)}
                  fullWidth
                  helperText={formik.touched.title2uz && formik.errors.title2uz}
                  label={localization.table.name + " UZ 1"}
                  name="title2uz"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.title2uz}
                />
                <input type="color"
                  style={{ height: "50px", padding: 0 }}
                  name="text_color2"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.text_color2} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  error={!!(formik.touched.title2ru && formik.errors.title2ru)}
                  fullWidth
                  helperText={formik.touched.title2ru && formik.errors.title2ru}
                  label={localization.table.name + " RU 1"}
                  name="title2ru"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.title2ru}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  error={!!(formik.touched.title2en && formik.errors.title2en)}
                  fullWidth
                  helperText={formik.touched.title2en && formik.errors.title2en}
                  label={localization.table.name + " EN 1"}
                  name="title2en"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.title2en}
                />
              </Box>
              
              
              <TextField
                error={!!(formik.touched.info2uz && formik.errors.info2uz)}
                fullWidth
                helperText={formik.touched.info2uz && formik.errors.info2uz}

                label={localization.table.info + " UZ 1"}
                name="info2uz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.info2uz}
              />
              <TextField
                error={!!(formik.touched.info2ru && formik.errors.info2ru)}
                fullWidth
                helperText={formik.touched.info2ru && formik.errors.info2ru}
                label={localization.table.info + " RU 1"}
                name="info2ru"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.info2ru}
              />
              <TextField
                error={!!(formik.touched.info2en && formik.errors.info2en)}
                fullWidth
                helperText={formik.touched.info2en && formik.errors.info2en}

                label={localization.table.info + " EN 1"}
                name="info2en"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.info2en}
              />
              <TextField
                error={!!(formik.touched.box_color2 && formik.errors.box_color2)}
                fullWidth
                helperText={formik.touched.box_color2 && formik.errors.box_color2}
                label="Box color 2"
                name="box_color2"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="color"
                value={formik.values.box_color2}
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
