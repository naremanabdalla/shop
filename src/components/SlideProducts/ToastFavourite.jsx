import React from 'react'
import { useTranslation } from 'react-i18next';

export default function ToastFavourite({item}) {
      const { t } = useTranslation();
    
  return (
    <> <div className="flex gap-2 items-center justify-between text-gray-800 font-medium">
              <img src={item.thumbnail} alt="" className="h-15" />
              <div className="text-sm">
                <p>
                  {item.title} <span> {t("added to Favourite")}</span>
                </p>
              </div>
            </div></>
  )
}
