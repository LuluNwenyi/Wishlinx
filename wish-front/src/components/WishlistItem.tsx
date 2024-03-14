import Link from "next/link";
import ChervonRight from "./svgs/ChervonRight";
import cx from "classnames";
import { WishListItemProps } from "../types/dashboard";

const WishlistItem = ({ isCard = false }: WishListItemProps) => {
  return (
    <Link
      href="/wishes/wish1"
      className={cx("c-wli", {
        ["c-wli--card"]: isCard,
      })}
    >
      <div className="c-wli-hdr">
        <div className="c-wli-hdr-image"></div>
        <div className="c-wli-dtl">
          <p className="c-wli-title">Favour&apos;s birthday wishlist</p>
          <p className="c-wli-date">expires Aug 31, 2023</p>
        </div>
      </div>
      <ChervonRight />
    </Link>
  );
};

export default WishlistItem;
