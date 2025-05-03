"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/") //array of current paths
                     .filter(Boolean); // filert(bolean) cleans spaces ahead of latters

  const links = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    return { name: segment, href };
  });

  return (
    <div className="flex gap-2 text-sm">
      {links.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <Link href={item.href} className="text-blue-500 hover:underline capitalize">
            {item.name}
          </Link>
          <span>/</span>

        </span>
      ))}
    </div>
  );
}
