/* eslint-disable react-hooks/exhaustive-deps */
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
import { SvgIcon, useMediaQuery, Switch, FormControlLabel, InputAdornment, OutlinedInput } from "@mui/material";
import useFetcher from "src/hooks/use-fetcher";
import PlusIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import { useFormik } from "formik";
import { useSearchParams } from 'next/navigation';

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


export default function AddMobileProductModal({ getDatas, row, route, data, setCategoryId }) {
  const { lang } = useSelector((state) => state.localiztion);
  const matches = useMediaQuery("(min-width:500px)");
  const { addToast } = useToasts()
  const { localization } = Content[lang];
  const image = React.useRef("")

  const [open, setOpen] = React.useState(false);
  const [discountPercentage, setDiscountPercentage] = React.useState(row.sale_amount)
  const [discountPrice, setDiscoutnPrice] = React.useState(row.sale_cost)
  const [price, setPrice] = React.useState(row.cost)

  const [existStatus, setExistStatus] = React.useState(row.exist);
  const [saleStatus, setSaleStatus] = React.useState(row.sale);
  const params = useSearchParams()
  const ParamId = params.get("mobid")

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const formik = useFormik({
    initialValues: {
      category_id: (row.category_id?._id ? row.category_id?._id  : row.category_id) || "",
    mainCategory_id: (row.mainCategory_id?._id  ? row.mainCategory_id?._id : row.mainCategory_id) || "",
      nameen: row.nameen,
      nameuz: row.nameuz,
      nameru: row.nameru,
      titleuz: row.titleuz,
      sub_titleuz: row.sub_titleuz,
      titleru: row.titleru,
      sub_titleru: row.sub_titleru,
      titleen: row.titleen,
      sub_titleen: row.sub_titleen,
      image: "",
      sale_cost: row.sale_cost,
      sale_amount: row.sale_amount,
      sale: row.sale,
      exist: row.exist,
      cost:row.cost,
      submit: null,
    },
    validationSchema: Yup.object({
      nameuz: Yup.string().min(1).required("Name is required"),
      nameru: Yup.string().min(1).required("Name is required"),
      nameen: Yup.string().min(1).required("Name is required"),
      titleuz: Yup.string().min(1).required(" title is required"),
      titleru: Yup.string().min(1).required(" title is required"),
      titleen: Yup.string().min(1).required(" title is required"),
      // category_id: Yup.string().min(1).required("Category is required"),

    }),


    onSubmit: async (values, helpers) => {
      try {

        const formData = new FormData();
        image.current?.files[0] && formData.append('image', image.current?.files[0]);
        formData.append('mainCategory_id', values.mainCategory_id);
        formData.append('category_id', values.category_id);
        formData.append('nameuz', values.nameuz);
        formData.append('nameen', values.nameen);
        formData.append('nameru', values.nameru);
        formData.append('titleru', values.titleru);
        formData.append('titleuz', values.titleuz);
        formData.append('titleen', values.titleen);
       formData.append('sub_titleru', values.sub_titleru);
       formData.append('sub_titleuz', values.sub_titleuz);
       formData.append('sub_titleen', values.sub_titleen);
        formData.append('cost', price);
        formData.append('exist', existStatus);
        formData.append('sale', saleStatus);
        formData.append('sale_cost', saleStatus ? discountPrice : 0);
        formData.append('sale_amount', saleStatus ? discountPercentage : 0);



        const response = await fetch(BaseUrl + `/${route}/${row?._id}`, {
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
  setCategoryId(formik?.values?.mainCategory_id || row?.mainCategory_id)
}, [formik.values.mainCategory_id, row.mainCategory_id])




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

              {formik.values.mainCategory_id || row.mainCategory_id ?
                <>
                  <TextField
                    error={!!(formik.touched.mainCategory_id && formik.errors.mainCategory_id)}
                    fullWidth
                    select
                    helperText={formik.touched.mainCategory_id && formik.errors.mainCategory_id}
                    label={localization.table.country}
                    name="mainCategory_id"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.mainCategory_id}
                  >
                    {data['/mobile/maincategory/all']?.categories &&
                      data['/mobile/maincategory/all']?.categories.map((item) => (
                        <MenuItem key={item?._id}
                          value={item?._id}>
                          {item?.[`name${lang}`]}
                        </MenuItem>
                      ))}
                  </TextField>

                {formik.values.category_id || row.category_id ? <TextField
                    error={!!(formik.touched.category_id && formik.errors.category_id)}
                    fullWidth
                  select
                  defaultValue={row.category_id?._id}
                    helperText={formik.touched.category_id && formik.errors.category_id}
                    label={localization.table.seria_id + " " + localization.table.country}
                    name="category_id"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.category_id}
                  >
                  {data[`/mobile/maincategory/${formik.values.mainCategory_id}`]?.category &&
                    data[`/mobile/maincategory/${formik.values.mainCategory_id}`]?.category[0]?.mobileCategories
?.map((item) => (
                        <MenuItem key={item?._id}
                          value={item?._id}>
                          {item?.[`name${lang}`]}
                        </MenuItem>
                      ))}
                  </TextField> : null}
                </> : null}
              {/* {console.log("main" +formik.values.mainCategory_id, "categ"+formik.values.category_id)} */}
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
                error={!!(formik.touched.titleuz && formik.errors.titleuz)}
                fullWidth
                helperText={formik.touched.titleuz && formik.errors.titleuz}

                label={localization.table.titile + " " + localization.uz}
                name="titleuz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.titleuz}
              />
              <TextField
                error={!!(formik.touched.titleru && formik.errors.titleru)}
                fullWidth
                helperText={formik.touched.titleru && formik.errors.titleru}
                label={localization.table.titile + " " + localization.ru}
                name="titleru"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.titleru}
              />
              <TextField
                error={!!(formik.touched.titleen && formik.errors.titleen)}
                fullWidth
                helperText={formik.touched.titleen && formik.errors.titleen}
                label={localization.table.titile + " " + localization.en}
                name="titleen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.titleen}
              />
           
              <OutlinedInput

                className="input"
                defaultValue={price}
                onChange={(e) => {
                  if (!isNaN(e.target.value)) {
                    setPrice(e.target.value)
                    let interest = Number(e.target.value) * Number(discountPercentage) / 100; // calculate interest based on percentage rate
                    let finalAmount = Number(e.target.value) - interest; // add interest to the initial amount  
                    setDiscoutnPrice(finalAmount)
                  }
                }}
                placeholder={localization.table.new_price}

                endAdornment={<InputAdornment position="end">SUM</InputAdornment>}
              />
              <Box display={"flex"} justifyContent={"space-between"}>
                <FormControlLabel
                  control={<Switch onChange={(e) => {
                    setSaleStatus(e.target.checked)
                  }}
                    checked={saleStatus}
                    color="primary" />}
                  label={localization.table.sale}
                  labelPlacement="right"
                />
                <FormControlLabel
                  control={<Switch onChange={(e) => {
                    setExistStatus(e.target.checked)
                  }}
                    checked={existStatus}
                    color="primary" />}
                  label={localization.table.exist}
                  labelPlacement="right"
                />
              </Box>
              {saleStatus && <>
                <OutlinedInput
                  className="input"
                  onChange={(e) => {
                    setDiscountPercentage(e.target.value)
                    let interest = Number(price) * Number(e.target.value) / 100; // calculate interest based on percentage rate
                    let finalAmount = Number(price) - interest; // add interest to the initial amount  
                    setDiscoutnPrice(finalAmount)
                  }}
                  value={discountPercentage}
                  placeholder={localization.table.sale_amount}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
                <OutlinedInput
                  className="input"
                  onChange={(e) => {
                    // if (!isNaN(e.target.value)) {
                    setDiscoutnPrice(e.target.value)
                    const discountPercentage = 100 - (Number(e.target.value) * 100 / Number(price));
                    setDiscountPercentage(discountPercentage.toFixed(2))

                    // }

                  }}
                  value={discountPrice}
                  placeholder={localization.table.sale_cost}
                  endAdornment={<InputAdornment position="end">SUM</InputAdornment>}
                />
              </>}

              <TextField
                error={!!(formik.touched.sub_titleuz && formik.errors.sub_titleuz)}
                fullWidth
                helperText={formik.touched.sub_titleuz && formik.errors.sub_titleuz}
                label={localization.table.subtitle + " " + localization.uz}
                name="sub_titleuz"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.sub_titleuz}
              />
              <TextField
                error={!!(formik.touched.sub_titleru && formik.errors.sub_titleru)}
                fullWidth
                helperText={formik.touched.sub_titleru && formik.errors.sub_titleru}
                label={localization.table.subtitle + " " + localization.ru}
                name="sub_titleru"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.sub_titleru}
              />
              <TextField
                error={!!(formik.touched.sub_titleen && formik.errors.sub_titleen)}
                fullWidth
                helperText={formik.touched.sub_titleen && formik.errors.sub_titleen}
                label={localization.table.subtitle + " " + localization.en}
                name="sub_titleen"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.sub_titleen}
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
