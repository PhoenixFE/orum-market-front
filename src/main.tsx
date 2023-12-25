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
import ProductManager from './components/seller/ProductManager.tsx';
import SellerOrderManager from './components/seller/SellerOrderManager.tsx';
import SignInPage from './pages/user/SignIn.tsx';
import SignUpPage from './pages/user/SignUp.tsx';
import { SearchPage } from './pages/product/SearchPage.tsx';
import CheckOut from './pages/user/CheckOut.tsx';
import BuyerRecentlyView from './components/buyer/BuyerRecentlyView.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import BuyerOrderDetail from './components/buyer/BuyerOrderDetail.tsx';

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: '/', element: <Home /> },
      { path: '/products', element: <SearchPage /> },
      { path: '/products/:productId', element: <ProductDetail /> },
      { path: '/cart', element: <MyCart /> },
      { path: '/checkout', element: <CheckOut /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/sign-in', element: <SignInPage /> },
      { path: '/sign-up', element: <SignUpPage /> },
    ],
  },
  {
    path: '/user',
    element: <Dashboard />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <BuyerHome /> },
      { path: 'order-list', element: <BuyerOrdeList /> },
      { path: 'info', element: <BuyerInfo /> },
      { path: 'favorites', element: <BuyerFavorite /> }, // Changed from 'buyer-favorite'
      { path: 'seller/orders', element: <SellerOrderManager /> }, // Nested under 'seller' to indicate resource
      { path: 'seller/products/new', element: <ProductCreate /> },
      { path: 'seller/products/:productId/edit', element: <ProductUpdate /> }, // RESTful way to indicate editing
      { path: 'seller/info', element: <SellerInfo /> },
      { path: 'seller/products', element: <ProductManager /> }, // Changed to indicate a collection of products
      { path: 'recently-viewed', element: <BuyerRecentlyView /> }, // Simplified
      { path: 'order-list/:orderId', element: <BuyerOrderDetail /> }, // Changed to indicate a specific order
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>,
);
