import { useEffect, useState, useRef } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon, Box, TextField, MenuItem } from '@mui/material';
import useFetcher from 'src/hooks/use-fetcher';
import Content from "src/Localization/Content";
import { useSelector } from "react-redux";


export const CustomersSearch = ({ onSearch, select,  type, extraData }) => {
  const { data, loading, error, fetchData } = useFetcher();
      const [subCategories, setSubCategories] = useState([]);

   useEffect(() => {
  if (type === "incomes" || type === "expenses") {
    setSubCategories(
      (extraData[`/${type}/all`]?.[`${type}`] &&
        extraData[`/${type}/all`]?.[`${type}`].find((item) => item._id == select.value)) ||
        []
    );
  }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [select?.value, type]);

  
  


 const { lang } = useSelector((state) => state.localiztion);

 const { localization } = Content[lang];


  return (
    <Card sx={{ p: 2 }}>
      {type === "soldproduct" ? (
        <Box sx={{ display: "flex", mr: 1 }}>
          <TextField
            defaultValue={"all"}
            sx={{ width: 200, mr: 1 }}
            select
            label={localization.table.warehouse}
            onChange={select.handleChange}
            type="text"
            value={select.value}
          >
            <MenuItem selected
value="all">
              {localization.table.all}
            </MenuItem>
            {data[`/werehouse/all`]?.werehouses &&
              data[`/werehouse/all`]?.werehouses.map((item) => (
                <MenuItem key={item?._id}
value={item?._id}>
                  {item?.name}
                </MenuItem>
              ))}
          </TextField>
          <OutlinedInput
            onChange={(e) => onSearch(e)}
            fullWidth
            placeholder={localization.table.product_name}
            startAdornment={
              <InputAdornment position="start">
                <SvgIcon color="action"
fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
            sx={{ maxWidth: 300 }}
          />
        </Box>
      ) : type === "expenses" || type === "incomes" ? (
        <Box sx={{ display: "flex", mr: 1 }}>
          <TextField
            defaultValue={"all"}
            sx={{ width: 200, mr: 1 }}
            select
            label={localization.modal.addCategory.category}
            onChange={select.handleChange}
            type="text"
            value={select.value}
          >
            <MenuItem selected
value="all">
              {localization.table.all}
            </MenuItem>
            {extraData[`/${type}/all`]?.[`${type}`] &&
              extraData[`/${type}/all`]?.[`${type}`].map((item) => (
                <MenuItem key={item?._id}
value={item?._id}>
                  {item?.name}
                </MenuItem>
              ))}
          </TextField>
          <TextField
            defaultValue={"all"}
            sx={{ width: 200, mr: 1 }}
            select
            label={localization.modal.addCategory.subcategory}
            onChange={select.handleChangeSub}
            type="text"
            value={select.subvalue}
          >
            <MenuItem selected
value="all">
              {localization.table.all}
            </MenuItem>
            {subCategories.subCategories &&
              subCategories.subCategories.map((e) => (
                <MenuItem key={e._id}
value={e._id}>
                  {e.name}
                </MenuItem>
              ))}
          </TextField>
        </Box>
      ) : type === "fesshipment" ? (
        <OutlinedInput
          onChange={(e) => onSearch(e)}
          fullWidth
          placeholder={
            localization.table.client_name +
            " | " +
            localization.table.deliver_name +
            " | " +
            localization.table.warehouse +    " | " +
            localization.table.product_name
          }
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action"
fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500 }}
        />
      ) : (
        <OutlinedInput
          onChange={(e) => onSearch(e)}
          fullWidth
          placeholder={
             localization.table.name
          }
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action"
fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500 }}
        />
      )}
    </Card>
  );
}