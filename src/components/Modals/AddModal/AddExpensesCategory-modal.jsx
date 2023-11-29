import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@heroicons/react/24/solid/XMarkIcon';
import { MenuItem, SvgIcon, useMediaQuery, FormControlLabel, Switch } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';

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

export default function AddClientModal({ getDatas, type, initalData }) {
    const { lang } = useSelector((state) => state.localiztion);
    const matches = useMediaQuery("(min-width:500px)");
    
    const { localization } = Content[lang];
    

    const { loading, error, createData } = useFetcher();
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const onFinish = () => {
        formik.values.name = ""
        formik.values.mainCategory = ""

    }

    console.log(type);

    const formik = useFormik({
        initialValues: {
            name: "",
            mainCategory:"",
            submit: null,
        },
        validationSchema: Yup.object({
            name: Yup.string().min(2).required("Name is required"),
        }),

        onSubmit: async (values, helpers) => {
            try {
                const newData = {
                    name: values.name,  mainCategory: type || "",
                };
                createData(`/${type ? type : "expenses"}/create`, newData, "POST", getDatas, onFinish);


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
                sx={{m:1}}
                onClick={handleClickOpen}
                startIcon={
                    <SvgIcon fontSize="small">
                        <PlusIcon />
                    </SvgIcon>
                }
                variant="contained"
            >
                {type ? localization.modal.addCategory.subtitle : localization.modal.addCategory.title}

            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title"
onClose={handleClose}>
                    {type ? localization.modal.addCategory.subtitle : localization.modal.addCategory.title}
                </BootstrapDialogTitle>
                <form noValidate
onSubmit={formik.handleSubmit}>
                    <DialogContent dividers >
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