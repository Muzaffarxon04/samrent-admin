import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Paper from '@mui/material/Paper';
import DialogTitle from '@mui/material/DialogTitle';
import { Scrollbar } from '../scrollbar';
import { Box, TextField, MenuItem, SvgIcon, Autocomplete, Table, TableBody, TableCell, TableRow, TableHead, FormControlLabel, Switch, useMediaQuery } from '@mui/material';
import { XMarkIcon, PencilIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
export default function GetProductModal({ getDatas, handleClose, open, data, setTramferedData, type }) {
    const { lang } = useSelector((state) => state.localiztion);



    const { localization } = Content[lang];
    const matches = useMediaQuery("(min-width:500px)");



    function BootstrapDialogTitle(props) {
        const { children, onClose, ...other } = props;

        return (
            <DialogTitle width={matches? 500 : null}
sx={{ m: 0, p: 2 }}
{...other}>
                {children}
                {onClose ? (
                    <SvgIcon
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 10,
                            top: 10,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <XMarkIcon width={25} />
                    </SvgIcon>
                ) : null}
            </DialogTitle>
        );
    }

 
    return (
        <>
         
          
            <Dialog 
                onClose={handleClose}
                open={open}
                
            >
             <BootstrapDialogTitle  onClose={handleClose}>
                    {localization?.modal.fes?.AddModal.power}: {open && type === "fesShipment" ? open.fesApplication_info[0].power : open.power }; {localization?.modal.fes?.AddModal.type}: {open && type === "fesShipment" ? open?.fesApplication_info[0]?.type : open.type}   
                </BootstrapDialogTitle>
                <DialogContent dividers  >
                    <Box>
                            <Table >
                                <TableHead>
                                        <TableRow>
                                            <TableCell>{localization.table.product_name}</TableCell>
                                    <TableCell>{localization.table.amount}</TableCell>
                                    {open && open?.products[0]?.werehouse_id ? <TableCell>{localization.table.warehouse}</TableCell> : null}
                                        </TableRow>
                                
                                </TableHead>
                                <TableBody>
                                {open && open.products.map((customer, index) => {
                                     
                                        return (
                                            <TableRow hover
key={customer._id}>
                                                <TableCell>{customer?.product_id?.name}{customer?.product_info?.mainProduct_id
?.name}</TableCell>
                                                <TableCell>{customer?.amount}</TableCell>  
                                                {customer?.werehouse_id  && <TableCell>{customer?.werehouse_id?.name}</TableCell> } 
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                            
                            </Table>
                    </Box>
                </DialogContent>
                    {open && <Box display="flex"
justifyContent={"space-between"}
alignItems={"center"}>

                    <TableCell>
                        <p><b>{localization.table.client_id}: </b>{open?.client_info[0]?.client_id}</p>
                    </TableCell>
                        <TableCell>
                        <p><b>{localization.table.client_name}: </b>{open?.client_info[0]?.name}</p>
                        </TableCell>
                        <TableCell>
                            <a href={`tel:+${open?.client_info[0]?.tel}`}>+{open?.client_info[0]?.tel}</a>
                        </TableCell>
                    </Box>}
                <DialogActions sx={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
                    <b>{localization.table.price}: {open && open.price} sum</b>
                
                    <Button onClick={handleClose}
                        autoFocus>
                        {localization.alerts.ok}

                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

