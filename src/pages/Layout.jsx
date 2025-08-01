import React, { useEffect, useState } from "react";
import TopHeader from "../components/header/TopHeader";
import BtmHeader from "../components/header/BtmHeader";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../components/ScrollToTop";
import PageTransation from "../components/PageTransation";
import { AnimatePresence } from "framer-motion";
import Loading from "./Loading";
import { auth } from "./../auth/firebse";
import { onAuthStateChanged } from "firebase/auth";
import Footer from "../components/Footer";
const Layout = () => {
  const location = useLocation();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return <Loading />;
  }
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" class />

      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <TopHeader />
        <BtmHeader />
      </header>
      <div className="pt-30">
        <AnimatePresence mode="await">
          <PageTransation key={location.key}>
            <Outlet />
          </PageTransation>
        </AnimatePresence>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
