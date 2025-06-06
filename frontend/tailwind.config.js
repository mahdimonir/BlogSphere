// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/app/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "420px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  safelist: [
    "top-[120px]",
    "top-[80px]",
    "top-[4rem]",
    "top-4",
    "right-4",
    "pt-16",
    "mt-8",
    "mt-6",
    "w-[16rem]",
    "w-[28rem]",
    "w-[20rem]",
    "w-[50px]",
    "w-16",
    "w-64",
    "xs:w-64",
    "xs:ml-64",
    "xs:block",
    "xs:sticky",
    "ml-0",
    "h-[23px]",
    "h-[calc(100vh-4rem)]",
    "h-[calc(100vh-8rem)]",
    "h-64",
    "z-20",
    "z-30",
    "z-40",
    "z-50",
    "pb-20",
    "md:p-6",
    "pointer-events-auto",
    "bg-blue-600",
    "bg-green-500",
    "border-blue-700",
    "bg-gray-200",
    "bg-gray-700",
    "bg-gray-800",
    "dark:bg-gray-700",
    "bg-red-500",
    "hover:bg-green-600",
    "hover:bg-red-600",
    "hover:bg-gray-700",
    "border-gray-200",
    "dark:border-gray-700",
    "bg-black",
    "bg-opacity-50",
    "max-w-[1200px]",
    "border-b-2",
    "border-blue-500",
    "text-blue-500",
    "grid-cols-1",
    "sm:grid-cols-2",
    "lg:grid-cols-3",
    "gap-6",
    "w-24",
    "h-24",
    "md:w-32",
    "md:h-32",
    "text-2xl",
    "text-3xl",
  ],
  plugins: [],
};
