import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Dialog, OutlinedInput, InputAdornment } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@heroicons/react/24/solid/XMarkIcon';
import { XMarkIcon, PencilIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { NumericFormatCustom } from '../FormatedImput';
import { useToasts } from "react-toast-notifications";
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
import { SvgIcon } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import {
    Box,
    Button,
    Stack,
    TextField,
    useMediaQuery
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

export default function AddCompanyModal({ getDatas, row, setCart, cart }) {
    const [count, setCount] = useState(1)
    const { addToast } = useToasts();
    const matches = useMediaQuery("(min-width:500px)");

    const { lang } = useSelector((state) => state.localiztion);

    const { localization } = Content[lang];



    const { loading, error, createData } = useFetcher();
    const [open, setOpen] = React.useState(false);
    const [discountPercentage, setDiscountPercentage] = React.useState(10);
    let interest = Number(row?.product_id?.newPrice) * Number(discountPercentage) / 100; // calculate interest based on percentage rate
    let finalAmount = Number(row?.product_id?.newPrice) + interest; // add interest to the initial amount  
    const [price, setPrice] = React.useState(finalAmount);
    const handleClickOpen = () => {
        setOpen(true);
        setCount(1)
    };
    const handleClose = () => {
        setOpen(false);
        setCount(1)
    };


    function handleAddToCart() {
        const item = {
            _id:row?._id,
            id: row?.product_id?._id,
            name: row?.product_id?.mainProduct_id?.name,
            price: row?.product_id?.newPrice,
            newPrice: price,
            overall_price: price * count,
            amount: count,
            max_amount: row.amount,
            warehouse_id: row?.werehouse_id?._id,
            queue:cart.length
        }
        setCart([...cart, item])

        addToast(localization.alerts.added, { appearance: "success", autoDismiss: true });

    }

    return (
        <div>
            <Button
                disabled={!row.amount || cart.map(item => item.id).includes(row?.product_id?._id)}
                variant="outlined"
                color="success"
                onClick={handleClickOpen}
                startIcon={
                    <SvgIcon fontSize="small">
                        <PlusIcon />
                    </SvgIcon>
                }
            >
                {localization.modal.addProduct.sale}
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title"
onClose={handleClose}>
                    {localization.modal.addProduct.addtocart}

                </BootstrapDialogTitle>
                <form noValidate >
                    <DialogContent dividers>
                        <Stack spacing={3}
width={matches ? 400 : null}>
                            <TextField
                                fullWidth
                                disabled
                                label={localization.table.product_name}
                                name="name"
                                type="text"
                                value={row?.product_id?.mainProduct_id?.name}
                            />
                            <TextField
                                fullWidth
                                label={localization.table.price}

                                disabled
                                name="price"
                                type="text"
                                value={row?.product_id?.newPrice}
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                }}
                            />

                            <OutlinedInput
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                }}
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value)
                                    const discountPercentage = ((Number(e.target.value) - Number(row?.product_id?.newPrice)) / Number(row?.product_id?.newPrice)) * 100;
                                    setDiscountPercentage(discountPercentage.toFixed(2))

                                }}
                              
                                placeholder="Price"
                                endAdornment={<InputAdornment position="end">$</InputAdornment>}
                            />
                            <OutlinedInput
                                onChange={(e) => {
                                    setDiscountPercentage(e.target.value)
                                    let interest = Number(row?.product_id?.newPrice) * Number(e.target.value) / 100; // calculate interest based on percentage rate
                                    let finalAmount = Number(row?.product_id?.newPrice) + interest; // add interest to
                                    setPrice(finalAmount)

                                }}
                                value={discountPercentage}
                                placeholder="Percentage"
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                            />
                            <Box sx={{ display: "flex", alignItems: "center", height: 40 }}>
                                <Button sx={{ height: '100%' }}
variant="outlined"
type='button'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setCount(count > 1 ? Number(count) - 1 : 1)
                                    }}>    <SvgIcon

                                    >
                                        <MinusIcon width={25} />
                                    </SvgIcon></Button>
                                <input style={{ height: '100%', maxWidth: 80, textAlign: 'center', outline: 'none', border: 'none', fontWeight: 700, fontSize: 20 }}
value={count}
onChange={(e) => {
                                    e.preventDefault()
                                    if (!isNaN(e.target.value)) {
                                        if (row.amount < Number(e.target.value)) {
                                            setCount(Number(row.amount))
                                        } else {
                                            setCount(Number(e.target.value))
                                        }
                                    }
                                }}
defaultValue={1} />
                                <Button sx={{ height: '100%' }}
variant="outlined"
                                    type='button'
                                    onClick={(e) => {
                                        e.preventDefault()

                                        if (row.amount <= Number(count) + 1) {
                                            setCount(Number(row.amount))
                                        } else {
                                            setCount(Number(count) + 1)
                                        }

                                    }}
                                >    <SvgIcon

                                >
                                        <PlusIcon width={25} />
                                    </SvgIcon></Button>
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button fullWidth
size="large"
sx={{ my: 1 }}
onClick={() => {
                            handleAddToCart()
                            handleClose()
                        }}
variant="contained">
                            {localization.modal.add}
                        </Button>
                    </DialogActions>
                </form>

            </BootstrapDialog>
        </div>
    );
}