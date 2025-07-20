import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ToastCart({item}) {
      const { t  } = useTranslation();
 
      return(
         <div className="">
          <div className="flex gap-3 items-center justify-between font-medium">
            <img src={item.thumbnail} alt="" className="h-15" />

            <div className="">
              <div className="text-sm w-full flex">
                <p>
                  {item.title}{" "}
                  <span className="text-sm"> {t("added to cart")}</span>
                </p>
              </div>

              <Link to="/cart">
                <button className="bg-[color:var(--color-primary)] text-[color:var(--color-secondary)] text-sm rounded-md px-1 py-1 mt-1">
                  {t("View Cart")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )
}
