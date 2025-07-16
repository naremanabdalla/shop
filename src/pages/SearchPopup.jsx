import React, { useState, useEffect, useContext } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { ProductsContext } from "../Context/ProductsContextProvider";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { allProducts } = useContext(ProductsContext);

  const location = useLocation();
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const performSearch = (query) => {
      // This would typically be an API call or filtering your data

      const mockResults = allProducts
        .flat()
        .filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

      setSearchResults(mockResults);
    };
    if (searchValue.trim() === "") {
      setSearchResults([]);
      return;
    }

    performSearch(searchValue);
  }, [searchValue, allProducts]);

  const { t } = useTranslation();
  return (
    <div className="relative">
      {/* Search Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
        aria-label="Search"
      >
        <FiSearch className="w-5 h-5" />
      </button>

      {/* Search Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/60 z-50 flex justify-center items-start pt-20 px-4">
          <div
            // ref={popupRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            {/* Search Header */}
            <div className="flex items-center border-b border-gray-200 p-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t("Search for products...")}
                  className="w-full pl-10 pr-4 py-2 border-none focus:ring-2 focus:ring-pink-400 rounded-lg text-gray-800"
                  autoFocus
                />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-4 p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close search"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto max-h-[calc(80vh-60px)]">
              {searchResults.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {searchResults.map((item) => (
                    <li
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <Link
                        to={`/product/${item.id}`} // Replace with your product link
                        className="flex items-center p-4"
                      >
                        <img src={item.thumbnail} alt="" className="h-15" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-pink-400 truncate">
                            {item.category}
                          </p>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-semibold text-pink-500">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-8 text-center">
                  {searchValue ? (
                    <p className="text-gray-500">
                      {t("No results found for")} "{searchValue}"
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      {t("Start typing to search for products...")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Recent Searches (optional) */}
            {/* <div className="p-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Headphones", "Shoes", "Coffee"].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchValue(term)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPopup;
