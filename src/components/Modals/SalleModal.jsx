import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Paper from "@mui/material/Paper";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  TextField,
  MenuItem,
  SvgIcon,
  Autocomplete,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { XMarkIcon, PencilIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import useFetcher from "src/hooks/use-fetcher";
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";
export default function DeleteModal({ getDatas, handleClose, open, data, setTramferedData }) {
  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];

  const { fetchData, loading, data: datas, error, createData } = useFetcher();

  const [warehouse, setWarehouse] = useState("");
  const [client, setClient] = useState("");
  const [isWerehouse, setIsWerehouse] = useState(false);

  const [errorLabel, setErrorLabel] = useState(null);

  const handleSubmit = () => {
    if (warehouse || client) {
      const newData = {
        products: data.map((el) => {
          return {
            product_id: el.id,
            amount: el.amount,
            newPrice: el.newPrice,
            totalPrice: el.overall_price,
          };
        }),
        werehouse_id: data[0]?.warehouse_id,
        client_id: client._id,
      };
      const newDataSecond = {
        products: data.map((el) => {
          return { product_id: el._id, amount: el.amount, price: el.newPrice };
        }),
        fesApplication_id: warehouse._id,
      };
      createData(
        `${!isWerehouse ? "/soldproduct/create" : "/fesapplication/addproduct"}`,
        isWerehouse ? newDataSecond : newData,
        "POST",
        () => {
          getDatas();
          handleClose();
          setWarehouse("");
          setClient("");
          setTramferedData([]);
        }
      );
    } else {
      setErrorLabel("Please select Warehouse");
    }
  };

  function getCountries() {
    fetchData(`/client/all`);
    fetchData(`/fesapplication/all`);
  }

  useEffect(() => {
    getCountries();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }}
{...other}>
        {children}
        {onClose ? (
          <SvgIcon
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
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

  const data2 = data.map((item) => item.overall_price);
  const sumWithInitial = data2.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (
    <>
      <Dialog onClose={handleClose}
open={open}>
        <BootstrapDialogTitle onClose={handleClose}>
          {localization.modal.addProduct.sale_product}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {data &&
            data
              .sort((a, b) => a.queue - b.queue)
              .map((row) => {
                let Card = (
                  <CardItem
                    key={row.id}
                    row={row}
                    data={data}
                    setTramferedData={setTramferedData}
                    cancel={handleClose}
                  />
                );
                return <>{Card}</>;
              })}

          <b>
            {localization.modal.addProduct.total_price}: {sumWithInitial} dollar
          </b>
        </DialogContent>
        <FormControlLabel
          sx={{ pl: 3 }}
          control={<Switch onChange={() => setIsWerehouse(!isWerehouse)}
checked={isWerehouse} />}
          label="add to fes"
        />
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}
        >
          {isWerehouse ? (
            <Autocomplete
              sx={{
                width: 200,
                ml: 2,
              }}
              error={errorLabel}
              helperText={errorLabel}
              onChange={(e, v) => {
                setWarehouse(v);
                setErrorLabel(null);
              }}
              id="free-solo-2-demo"
              disableClearable
              getOptionLabel={(option) => option.stock_id+" " +option?.client_info[0]?.name+ " "+ option.power}
              getOptionSelected={(option, value) => option._id === value._id}
              value={warehouse ? warehouse : null}
              options={datas["/fesapplication/all"]?.fesApplication || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={localization.sidebar.fes_clients}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
          ) : (
            <Autocomplete
              sx={{
                width: 200,
                ml: 2,
              }}
              error={errorLabel}
              helperText={errorLabel}
              onChange={(e, v) => {
                setClient(v);
                setErrorLabel(null);
              }}
              id="free-solo-2-demo"
              disableClearable
              getOptionLabel={(option) => option.client_id + " " + option.name}
              getOptionSelected={(option, value) => option._id === value._id}
              value={client ? client : null}
              options={datas["/client/all"]?.clients}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={localization.table.client_name}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
          )}

       
          <Box>
            <Button sx={{ color: "red" }}
onClick={handleClose}>
              {localization.alerts.no}
            </Button>
            <Button onClick={handleSubmit}>{localization.modal.addProduct.sale}</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}

function CardItem({ row, setTramferedData, data, cancel }) {
  const [count, setCount] = useState(row.amount);

  function UpdateCount(id, count) {
    if (data.length == 1 && count == 0) {
      cancel();
      setTramferedData([]);
    }
    const item = data.find((item) => item.id == id);
    if (item) {
      item.amount = count;
      item.overall_price = item.newPrice * count;
      if (count < 1) {
        setTramferedData([...data.filter((elem) => elem.id != id)]);
      } else {
        setTramferedData([item, ...data.filter((elem) => elem.id != id)]);
      }
    }
  }

  return (
    <Paper
      sx={{
        padding: 2,
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      elevation={12}
    >
      <h3 className="tranfer-item__title">
        {" "}
        {row.name} ({row.newPrice} dollar)
      </h3>
      <Box sx={{ display: "flex", alignItems: "center", height: 40 }}>
        <Button
          sx={{ height: "100%" }}
          variant="outlined"
          type="button"
          onClick={(e) => {
            e.preventDefault();

            setCount(count > 0 ? Number(count) - 1 : 0);
            UpdateCount(row.id, count > 0 ? Number(count) - 1 : 0);
          }}
        >

          <SvgIcon>
            <MinusIcon width={25} />
          </SvgIcon>
        </Button>
        <input
          style={{
            height: "100%",
            maxWidth: 80,
            textAlign: "center",
            outline: "none",
            border: "none",
            fontWeight: 700,
            fontSize: 20,
          }}
          value={count}
          onChange={(e) => {
            e.preventDefault();
            if (!isNaN(e.target.value)) {
              if (row.max_amount <= Number(e.target.value)) {
                setCount(Number(row.max_amount));
                UpdateCount(row.id, Number(row.max_amount));
              } else {
                setCount(Number(e.target.value));
                UpdateCount(row.id, Number(e.target.value));
              }
            }
          }}
          defaultValue={1}
        />
        <Button
          sx={{ height: "100%" }}
          variant="outlined"
          type="button"
          onClick={(e) => {
            e.preventDefault();

            if (row.max_amount <= Number(count)) {
              setCount(Number(row.max_amount));
              UpdateCount(Number(row.max_amount));
            } else {
              setCount(Number(count) + 1);
              UpdateCount(row.id, Number(count) + 1);
            }
          }}
        >
          {" "}
          <SvgIcon>
            <PlusIcon width={25} />
          </SvgIcon>
        </Button>
      </Box>
    </Paper>
  );
}
