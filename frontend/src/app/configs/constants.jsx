export const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Post",
    href: "/post",
  },
  {
    title: "Profile",
    href: "/profile",
  },
];

export const calculateReadTime = (content) => {
  const wordsPerMinute = 120;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-UK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return "Unknown";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
