import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import Home from './pages/Home.tsx';
import ProductDetail from './pages/product/ProductDetail.tsx';
import MyCart from './pages/MyCart.tsx';
import Dashboard from './pages/user/Dashboard.tsx';
import BuyerInfo from './components/buyer/BuyerInfo.tsx';
import BuyerOrdeList from './components/buyer/BuyerOrderList.tsx';
import BuyerFavorite from './components/buyer/BuyerFavorite.tsx';
import { BuyerHome } from './components/buyer/BuyerHome.tsx';
import ProductCreate from './components/seller/ProductCreate.tsx';
import ProductUpdate from './components/seller/ProductUpdate.tsx';
import SellerInfo from './components/seller/SellerInfo.tsx';
import SellerOrderList from './components/seller/SellerOrderList.tsx';
import ProductManager from './components/seller/ProductManager.tsx';
import SignInPage from './pages/user/SignIn.tsx';
import SignUpPage from './pages/user/SignUp.tsx';
import { CategoryList } from './pages/product/CategoryList.tsx';
import { SearchPage } from './pages/product/SearchPage.tsx';
import CheckOut from './pages/user/CheckOut.tsx';
import BuyerRecentlyView from './components/buyer/BuyerRecentlyView.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: '/', element: <Home /> },
      { path: '/category/:category', element: <CategoryList /> },
      { path: '/product', element: <SearchPage /> },
      { path: '/product/:id', element: <ProductDetail /> },
      { path: '/cart', element: <MyCart /> },
      { path: '/checkout', element: <CheckOut /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/sign-in', element: <SignInPage /> },
      { path: '/sign-up', element: <SignUpPage /> },
    ],
  },
  {
    path: '/user/:id',
    element: <Dashboard />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: '/user/:id', element: <BuyerHome /> },
      {
        path: '/user/:id/buyer-orderlist',
        element: <BuyerOrdeList />,
      },
      {
        path: '/user/:id/buyer-info',
        element: <BuyerInfo />,
      },
      {
        path: '/user/:id/buyer-favorite',
        element: <BuyerFavorite />,
      },
      {
        path: '/user/:id/product-manager',
        element: <ProductManager />,
      },
      {
        path: '/user/:id/product-create',
        element: <ProductCreate />,
      },
      {
        path: '/user/:id/product-update',
        element: <ProductUpdate />,
      },
      {
        path: '/user/:id/seller-info',
        element: <SellerInfo />,
      },
      {
        path: '/user/:id/seller-orderlist',
        element: <SellerOrderList />,
      },
      {
        path: '/user/:id/recently-viewed-items',
        element: <BuyerRecentlyView />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
