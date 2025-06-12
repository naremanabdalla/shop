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
      ],
    },
  ]);
  return (
    <>
      <CartContextProvider>
        <ProductsContextProvider>
          {/* <AnimatePresence mode="await"> */}
          <RouterProvider router={routes} />
          {/* </AnimatePresence> */}
        </ProductsContextProvider>
      </CartContextProvider>
    </>
  );
}

export default App;
