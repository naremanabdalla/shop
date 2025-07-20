import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className=" flex flex-col items-center justify-center  p-4">
      <div className="text-center max-w-md">
        {/* Icon or Emoji */}
        <span className="text-6xl mb-4" role="img" aria-label="Sad face">
          😢
        </span>

        {/* Title */}
        <h1 className="text-4xl mt-8 font-bold text-[color:var(--color-primary)] mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {t("Page Not Found")}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {t("The page you are looking for does not exist or has been moved.")}
        </p>

        {/* Button to go back home */}
        <button
          className="px-6 py-2 bg-[color:var(--color-primary)] text-white rounded-lg hover:bg-[color:var(--color-secondary)] transition-colors shadow-md"
          onClick={() => navigate("/")}
        >
          {t("Go to Home")}
        </button>
      </div>
    </div>
  );
}
