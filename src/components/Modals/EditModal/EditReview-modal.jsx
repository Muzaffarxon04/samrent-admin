import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@heroicons/react/24/solid/XMarkIcon';
import { MenuItem, Select, SvgIcon, TableRow, useMediaQuery } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import PlusIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;

import {
    Box,
    Button,
    Stack,
    TextField,
    Typography
} from '@mui/material';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
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
                        position: 'absolute',
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

export default function AddCompanyModal({ getDatas, type, row }) {
    const { loading, error, createData } = useFetcher();
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


    const formik = useFormik({
        initialValues: {
            name:row.name,
            body: row.body,
            lang: row.lang,
            star: row.star,
            submit: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().min(2).required("Name is required"),
            star: Yup.number().min(2).required("Star is required"),
            body: Yup.string().min(2).required("Body is required"),
        }),


        onSubmit: async (values, helpers) => {
            try {
                const newData = {
                    name: values.name,
                    body: values.body,
                    lang: values.lang,
                    star: values.star,
                };
                createData(`/review/${row._id}`, newData, "PATCH", getDatas);
            } catch (err) {
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
            }
        },

       
    });

    return (
        <div>

            <IconButton
                onClick={handleClickOpen}
               
            >
                <SvgIcon>
                    <PlusIcon />
                </SvgIcon>
            </IconButton>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title"
onClose={handleClose}>
                    {type === "products" ? localization.modal.addProduct.addproduct : localization.modal.addDeliver.adddeliver}

                </BootstrapDialogTitle>
                <form noValidate
onSubmit={formik.handleSubmit}>
                    <DialogContent dividers>
                        <Stack spacing={3}
                            width={matches ? 400 : null}>
                        
                            <TextField
                                error={!!(formik.touched.name && formik.errors.name)}
                                fullWidth
                                helperText={formik.touched.name && formik.errors.name}
                                autoComplete="off"
                                label={localization.table.name}
                                name="name"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="text"
                                value={formik.values.name}
                            />
                            <TextField
                                error={!!(formik.touched.body && formik.errors.body)}
                                fullWidth
                                helperText={formik.touched.body && formik.errors.body}
                                autoComplete="off"
                                label={localization.table.info}
                                name="body"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                type="text"
                                value={formik.values.body}
                            />
                            <Box display={"flex"} gap={1}>
                                <TextField
                                    error={!!(formik.touched.star && formik.errors.star)}
                                    fullWidth
                                    helperText={formik.touched.star && formik.errors.star}
                                    autoComplete="off"
                                    label={localization.table.star}
                                    name="star"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    type="text"
                                    value={formik.values.star}
                                />
                                <Select error={!!(formik.touched.lang && formik.errors.lang)}
                                    fullWidth
                                    helperText={formik.touched.lang && formik.errors.lang}
                                    label={localization.table.lang}
                                    name="lang"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.lang}
                                sx={{width:"100px"}}
                                >
                                    <MenuItem value="uz">UZ</MenuItem>
                                    <MenuItem value="ru">RU</MenuItem>
                                    <MenuItem value="en">EN</MenuItem>
                                </Select>
                    </Box>
                          
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
                        <Button onClick={handleClose}
                            fullWidth
size="large"
sx={{ my: 1 }}
type="submit"
variant="contained">
                            {localization.modal.add}

                        </Button>
                    </DialogActions>
                </form>

            </BootstrapDialog>
        </div>
    );
}