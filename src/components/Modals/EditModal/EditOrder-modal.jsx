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

export default function AddCompanyModal({ row, route, getDatas, company }) {
  const { createData, fetchData, data } = useFetcher();
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
      category_id: row?.category_id?._id,
      nameuz: row?.nameuz,
      nameru: row?.nameru,
      nameen: row?.nameen,
      short_infouz: row?.short_infouz,
      short_inforu: row?.short_inforu,
      short_infoen: row?.short_infoen,
      ingredientsuz: row?.ingredientsuz,
      ingredientsru: row?.ingredientsru,
      ingredientsen: row.row?.ingredientsen,
      image: "",
      long_infouz: row?.long_infouz,
      long_inforu: row?.long_inforu,
      long_infoen: row?.long_infoen,
      nutritional_infouz: row?.nutritional_infouz?.join(","),
      nutritional_inforu: row?.nutritional_inforu?.join(","),
      nutritional_infoen: row?.nutritional_infoen?.join(","),
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
        formData.append('category_id', values.category_id);
        formData.append('nameuz', values.nameuz);
        formData.append('nameru', values.nameru);
        formData.append('nameen', values.nameen);
        formData.append('short_infouz', values.short_infouz);
        formData.append('short_infoen', values.short_infoen);
        formData.append('short_inforu', values.short_inforu);
        formData.append('ingredientsuz', values.ingredientsuz);
        formData.append('ingredientsru', values.ingredientsru);
        formData.append('ingredientsen', values.ingredientsen);
        formData.append('long_infouz', values.long_infouz);
        formData.append('long_inforu', values.long_inforu);
        formData.append('long_infoen', values.long_infoen);
        const nutritionalInfoArray1 = values.nutritional_infouz.split(",");
        const nutritionalInfoJson1 = JSON.stringify(nutritionalInfoArray1);
        const nutritionalInfoArray2 = values.nutritional_inforu.split(",");
        const nutritionalInfoJson2 = JSON.stringify(nutritionalInfoArray2);
        const nutritionalInfoArray3 = values.nutritional_infoen.split(",");
        const nutritionalInfoJson3 = JSON.stringify(nutritionalInfoArray3);
        formData.append('nutritional_infouz', nutritionalInfoJson1)
        formData.append('nutritional_inforu', nutritionalInfoJson2)
        formData.append('nutritional_infoen', nutritionalInfoJson3)



        const response = await fetch(BaseUrl + `/product/${row?._id}`, {
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


  useEffect(() => {
    fetchData(`/category/all`);


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                {data[`/category/all`]?.categories &&
                  data[`/category/all`]?.categories.map((item) => (
                    <MenuItem key={item?._id}
                      value={item?._id}>
                      {item?.[`name${lang || "uz"}`]}
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

                error={!!(formik.touched.short_infouz && formik.errors.short_infouz)}
                fullWidth
                helperText={formik.touched.short_infouz && formik.errors.short_infouz}
                label={localization.table.residual_amount + " " + localization.uz}
                name="short_infouz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.short_infouz}
              />
              <TextField

                error={!!(formik.touched.short_inforu && formik.errors.short_inforu)}
                fullWidth
                helperText={formik.touched.short_inforu && formik.errors.short_inforu}
                label={localization.table.residual_amount + " " + localization.ru}
                name="short_inforu"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.short_inforu}
              />
              <TextField

                error={!!(formik.touched.short_infoen && formik.errors.short_infoen)}
                fullWidth
                helperText={formik.touched.short_infoen && formik.errors.short_infoen}
                label={localization.table.residual_amount + " " + localization.en}
                name="short_infoen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.short_infoen}
              />
              <TextField

                error={!!(formik.touched.long_infouz && formik.errors.long_infouz)}
                fullWidth
                helperText={formik.touched.long_infouz && formik.errors.long_infouz}
                label={localization.table.complated_amount + " " + localization.uz}
                name="long_infouz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.long_infouz}
              />
              <TextField

                error={!!(formik.touched.long_inforu && formik.errors.long_inforu)}
                fullWidth
                helperText={formik.touched.long_inforu && formik.errors.long_inforu}
                label={localization.table.complated_amount + " " + localization.ru}
                name="long_inforu"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.long_inforu}
              />
              <TextField

                error={!!(formik.touched.long_infoen && formik.errors.long_infoen)}
                fullWidth
                helperText={formik.touched.long_infoen && formik.errors.long_infoen}
                label={localization.table.complated_amount + " " + localization.en}
                name="long_infoen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.long_infoen}
              />
              <TextField
                error={!!(formik.touched.ingredientsuz && formik.errors.ingredientsuz)}
                fullWidth
                helperText={formik.touched.ingredientsuz && formik.errors.ingredientsuz}
                label={localization.table.payed_price + " " + localization.uz}

                name="ingredientsuz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.ingredientsuz}
              />
              <TextField
                error={!!(formik.touched.ingredientsru && formik.errors.ingredientsru)}
                fullWidth
                helperText={formik.touched.ingredientsru && formik.errors.ingredientsru}
                label={localization.table.payed_price + " " + localization.ru}

                name="ingredientsru"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.ingredientsru}
              />
              <TextField
                error={!!(formik.touched.ingredientsen && formik.errors.ingredientsen)}
                fullWidth
                helperText={formik.touched.ingredientsen && formik.errors.ingredientsen}
                label={localization.table.payed_price + " " + localization.en}

                name="ingredientsen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.ingredientsen}
              />
              <TextField
                error={!!(formik.touched.nutritional_infouz && formik.errors.nutritional_infouz)}
                fullWidth
                helperText={formik.touched.nutritional_infouz && formik.errors.nutritional_infouz}
                label={localization.table.overall_price + " " + localization.uz}

                name="nutritional_infouz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nutritional_infouz}
              />
              <TextField
                error={!!(formik.touched.nutritional_inforu && formik.errors.nutritional_inforu)}
                fullWidth
                helperText={formik.touched.nutritional_inforu && formik.errors.nutritional_inforu}
                label={localization.table.overall_price + " " + localization.ru}

                name="nutritional_inforu"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nutritional_inforu}
              />
              <TextField
                error={!!(formik.touched.nutritional_infoen && formik.errors.nutritional_infoen)}
                fullWidth
                helperText={formik.touched.nutritional_infoen && formik.errors.nutritional_infoen}
                label={localization.table.overall_price + " " + localization.en}
                name="nutritional_infoen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.nutritional_infoen}
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
