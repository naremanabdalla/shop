export default function NotFound() {
  return (
    <div className=" flex flex-col items-center justify-center  p-4">
      <div className="text-center max-w-md">
        {/* Icon or Emoji */}
        <span className="text-6xl mb-4" role="img" aria-label="Sad face">
          😢
        </span>

        {/* Title */}
        <h1 className="text-4xl font-bold text-pink-400 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Button to go back home */}
        <button
          className="px-6 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition-colors shadow-md"
          onClick={() => (window.location.href = "/")}
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}
