// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Brands from "layouts/brands";
import AddSale from "layouts/addSale";
import Banks from "layouts/banks";
import Signup from "layouts/authentication/users/Signup"

//auth routes
import BanksDetail from "layouts/banks/components/Detail"
import SalesDetail from "layouts/addSale/components/Detail"

// @mui icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LoginIcon from '@mui/icons-material/Login';
import * as React from 'react'
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";

const AdminAuthRoutes = ({ children }) => {
  const { role } = useContext(AuthContext)
  return role === "admin" ? children : <Navigate to="/login" />
}
const BrandAuthRoutes = ({ children }) => {
  const { role } = useContext(AuthContext)
  return role === "brand" ? children : <Navigate to="/login" />
}
const BankAuthRoutes = ({ children }) => {
  const { role } = useContext(AuthContext)
  return role === "bank" ? children : <Navigate to="/login" />
}

const routes = [
  {
    routeRole: "admin",
    type: "collapse",
    name: "Demo Dashboard",
    key: "admin/dashboard",
    icon: <DashboardIcon />,
    route: "/admin/dashboard",
    component: <AdminAuthRoutes><Dashboard /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Users",
    key: "admin/brands",
    icon: <AccountBoxIcon />,
    route: "/admin/users",
    component: <AdminAuthRoutes><Brands /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Add Sale",
    key: "admin/addSale",
    icon: <InventoryIcon />,
    route: "/admin/addSale",
    component: <AdminAuthRoutes><AddSale /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Banks",
    key: "admin/banks",
    icon: <AccountBalanceIcon />,
    route: "/admin/banks",
    component: <AdminAuthRoutes><Banks /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "collapse",
    name: "Signup",
    icon: <LoginIcon />,
    route: "/admin/signup",
    component: <AdminAuthRoutes><Signup /></AdminAuthRoutes>,
  },
  {
    routeRole: "brand",
    type: "collapse",
    name: "Demo Dashboard",
    key: "brand/dashboard",
    icon: <DashboardIcon />,
    route: "/brand/dashboard",
    component: <BrandAuthRoutes><Dashboard /></BrandAuthRoutes>
  },
  {
    routeRole: "brand",
    type: "collapse",
    name: "Add Sale",
    key: "brand/addSale",
    icon: <InventoryIcon />,
    route: "/brand/addSale",
    component: <BrandAuthRoutes><AddSale /></BrandAuthRoutes>,
  },
  {
    routeRole: "bank",
    type: "collapse",
    name: "Demo Dashboard",
    key: "bank/dashboard",
    icon: <DashboardIcon />,
    route: "/bank/dashboard",
    component: <BankAuthRoutes><Dashboard /></BankAuthRoutes>,
  },
]

const authRoutes = [
  {
    routeRole: "admin",
    type: "authRoutes",
    route: "/admin/banks/detail/:id",
    component: <AdminAuthRoutes><BanksDetail /></AdminAuthRoutes>,
  },
  {
    routeRole: "admin",
    type: "authRoutes",
    route: `/admin/addSale/detail/:id`,
    component: <AdminAuthRoutes><SalesDetail /></AdminAuthRoutes>,
  },
  {
    routeRole: "brand",
    type: "authRoutes",
    route: `/brand/addSale/detail/:id`,
    component: <BrandAuthRoutes><SalesDetail /></BrandAuthRoutes>,
  },
]
export default routes;
export { authRoutes }
