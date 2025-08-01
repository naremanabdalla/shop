import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import ProductsContextProvider from "./Context/ProductsContextProvider";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import CartContextProvider from "./Context/CartContextProvider";
import Cart from "./pages/cart";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import CategoryPage from "./pages/categoryPage/CategoryPage";
import SearchPopup from "./pages/SearchPopup";
import Favourite from "./pages/Favourite";
import ContactUS from "./pages/ContactUS";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthContext, { useAuth } from "./Context/authContext";
import Profile from "./pages/Profile";
import FavouriteContextprovider from "./Context/FavouriteContextprovider";
import NotFound from "./pages/NotFound";
import { useTranslation } from "react-i18next";
import ResetPassword from "./pages/resetPassword";
import { WebchatProvider } from "@botpress/webchat";
function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "product/:productID", element: <ProductDetails /> },
        { path: "/cart", element: <Cart /> },
        { path: "/category/:categoryName", element: <CategoryPage /> },
        { path: "/favourite", element: <Favourite /> },
        { path: "/contact", element: <ContactUS /> },
        { path: "/signin", element: <SignIn /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/profile", element: <Profile /> },
        { path: "/reset-password", element: <ResetPassword /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ]);
  const { i18n } = useTranslation();
  const { currentUser } = useAuth();

  return (
    <div dir={i18n.language === "en" ? "ltr" : "rtl"}>
      <WebchatProvider
        botId="e4daeba3-c296-4803-9af6-91c0c80ab5de"
        clientId={currentUser.uid}
        hostUrl="https://cdn.botpress.cloud/webchat/v0"
      >
        <AuthContext>
          <CartContextProvider>
            <FavouriteContextprovider>
              <ProductsContextProvider>
                {/* <AnimatePresence mode="await"> */}
                <RouterProvider router={routes} />
                {/* </AnimatePresence> */}
              </ProductsContextProvider>
            </FavouriteContextprovider>
          </CartContextProvider>
        </AuthContext>
      </WebchatProvider>
    </div>
  );
}

export default App;
