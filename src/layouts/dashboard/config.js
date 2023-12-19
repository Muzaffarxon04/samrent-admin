import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import CarIcon from "@heroicons/react/24/solid/TruckIcon";
import PhoneIcon from "@heroicons/react/24/solid/DeviceTabletIcon";

import UsersIcon from "@heroicons/react/24/solid/AdjustmentsVerticalIcon";

import QueueListIcon from "@heroicons/react/24/solid/QueueListIcon";

import { SvgIcon } from '@mui/material';
import Content from "src/Localization/Content";
import { useSelector } from 'react-redux';
export function Items() {
  const { lang } = useSelector((state) => state.localiztion);

  const { localization } = Content[lang];



  const items = [
    // {
    //   accessRole: [
    //     "owner",
    //     "tasischi",
    //     "moliyachi",
    //     "sotuvchi",
    //     "omborchi",
    //     "prorab",
    //     "taminotchi",
    //     "kassir",
    //   ],
    //   title: localization.sidebar.home,
    //   path: "/",
    //   icon: (
    //     <SvgIcon fontSize="small">
    //       <ChartBarIcon />
    //     </SvgIcon>
    //   ),
    // },

    {
      title: localization.sidebar.banners,
      path: "/banners",
      icon: (
        <SvgIcon fontSize="small">
          <UsersIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.answers,
      path: "/faqs",
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.reviews,
      path: "/review",
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.leeds,
      path: "/leeds",
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.cars,
      path: "/cars",
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.admins,
      path: "/admins",
      icon: (
        <SvgIcon fontSize="small">
          <CogIcon />
        </SvgIcon>
      ),
    },
    {
      title: localization.sidebar.mobile,
      path: "/mobile",
      icon: (
        <SvgIcon fontSize="small">
          <PhoneIcon />
        </SvgIcon>
      ),
      subItems: [
        {
          title: localization.sidebar.cars,
          path: "/mobile/cars",
          icon: (
            <SvgIcon fontSize="small">
              <CarIcon />
            </SvgIcon>
          ),
        },
      ],
    },
  ];

return items
}
