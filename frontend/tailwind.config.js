import { defineConfig } from "tailwindcss";
import colors from "tailwindcss/colors";

const baseColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
  "slate",
  "zinc",
  "neutral",
  "stone",
  "amber",
  "lime",
];

const shadeMapping = {
  50: "900",
  100: "800",
  200: "700",
  300: "600",
  400: "500",
  500: "400",
  600: "300",
  700: "200",
  800: "100",
  900: "50",
};

const generateThemeObject = (colors, mapping, invert = false) => {
  const theme = {};
  baseColors.forEach((color) => {
    theme[color] = {};
    Object.entries(mapping).forEach(([key, value]) => {
      const shadeKey = invert ? value : key;
      theme[color][key] = colors[color][shadeKey];
    });
  });
  return theme;
};

const lightTheme = generateThemeObject(colors, shadeMapping);
const darkTheme = generateThemeObject(colors, shadeMapping, true);

export default defineConfig({
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/app/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: lightTheme,
        dark: darkTheme,
        white: {
          light: "#ffffff",
          dark: colors.gray[900],
        },
        black: {
          light: colors.gray[900],
          dark: colors.gray[50],
        },
      },
    },
  },
  plugins: [],
});
