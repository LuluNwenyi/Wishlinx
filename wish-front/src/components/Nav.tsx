"use client";
import Link from "next/link";
import Button from "./Button";

import { usePathname } from "next/navigation";
import cx from "classnames";
import { navLinkList } from "../util/nav";
import { NavLinkList } from "../types/nav";
import NotificationSvg from "./svgs/NotificationSvg";
import ActiveLink from "./ActiveLink";

const Nav = () => {
  const pathname = usePathname();
  const isLogin = pathname === "/";

  const isAuth = ["/", "/signup"].includes(pathname);
  const isGuest = true;

  return (
    <header>
      <nav className="c-nav">
        <div className={cx("c-nav-title", { ["c-nav-title--sml"]: !isAuth })}>
          <h1>
            wish<span>linx</span>
          </h1>
        </div>
        <div className="c-nav-main">
          {/* unauthorized */}
          <div
            className={cx("c-nav-lgn", {
              ["c-nav-main--auth"]: isAuth,
            })}
          >
            <Link href={isLogin ? "/signup" : "/"} className="c-btn">
              {isLogin ? "Sign Up" : "Log In"}
            </Link>
          </div>

          {/* authorized */}

          {isGuest && (
            <div
              className={cx("c-nav-ctrl", {
                ["c-nav-main--auth"]: !isAuth,
              })}
            >
              <div className="c-nav-ctrl-search">
                <input
                  type="text"
                  placeholder="Search for wishes, categories..."
                />
              </div>
              <div className="c-nav-ctrl-link">
                {navLinkList.map(({ name, path }: NavLinkList, idx: number) => (
                  <ActiveLink
                    key={idx}
                    {...{
                      name,
                      path,
                      defaultClass: "c-nav-ctrl-link-item",
                      activeClass: "c-nav-ctrl-link-item--active",
                    }}
                  />
                ))}
              </div>
              <div className="c-nav-ctrl-pfl">
                <NotificationSvg />
                <Link href="/profile">
                  <div className="c-nav-ctrl-pfl-image" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
