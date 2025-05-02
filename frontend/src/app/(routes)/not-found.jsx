export default function NotFound() {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800">404 - Post Not Found</h1>
      <p className="mt-4 text-gray-600">
        The post you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Go to Home
      </a>
    </div>
  );
}
