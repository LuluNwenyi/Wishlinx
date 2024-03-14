"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import ArrowRightSvg from "./svgs/ArrowRightSvg";

export const Breadcrumbs = () => {
  const segments = useSelectedLayoutSegments();

  console.log(segments);

  return (
    <div>
      Dashboard <ArrowRightSvg />

      
    </div>
  );
};
