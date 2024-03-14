"use client";

import { usePathname } from "next/navigation";
import { ActiveLinkProps } from "../types/nav";
import Link from "next/link";
import cx from "classnames";

const ActiveLink = ({
  name,
  path,
  defaultClass,
  activeClass,
}: ActiveLinkProps) => {
  const pathName = usePathname();

  const className = cx(defaultClass, {
    [activeClass]: path === pathName,
  });

  return (
    <Link href={path} className={className}>
      {name}
    </Link>
  );
};

export default ActiveLink;
