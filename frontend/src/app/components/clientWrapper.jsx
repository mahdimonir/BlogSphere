"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PaginationClient from "./pagination";

const ClientWrapper = ({ currentPage, pageSize, totalCount,api }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    router.push(`${api}?${params.toString()}`);
  };

  return (
    <PaginationClient
      currentPage={currentPage}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={onPageChange}
    />
  );
};

export default ClientWrapper;
