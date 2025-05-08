// app/dashboard/error.tsx
"use client";

export default function Error({ error }) {
  return (
    <div className="text-gray-500 w-full h-screen flex justify-center items-center font-bold text-center mt-10">
      {error.message}
    </div>
  );
}
