import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import Home from './pages/Home.tsx';
import ProductList from './pages/product/ProductList.tsx';
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
import { ClerkProvider, SignIn, SignUp } from '@clerk/clerk-react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: '/', element: <Home /> },
      { path: '/product', element: <ProductList /> },
      { path: '/product/:id', element: <ProductDetail /> },
      { path: '/cart', element: <MyCart /> },
      { path: '/sign-in/*', element: <SignIn /> },
      { path: '/sign-up/*', element: <SignUp /> },
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
    ],
  },
]);

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={clerkPubKey} afterSignUpUrl="/">
    <RouterProvider router={router} />
  </ClerkProvider>,
);
