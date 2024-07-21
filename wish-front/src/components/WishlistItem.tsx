import cx from "classnames";
import Link from "next/link";
import { WishListItemProps } from "../types/dashboard";
import ChervonRight from "./svgs/ChervonRight";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

const WishlistItem = ({
  isCard = false,
  name,
  expDate,
  id,
}: WishListItemProps) => {
  return (
    <Link
      href={`wishes/${id}`}
      className={cx("c-wli", {
        ["c-wli--card"]: isCard,
      })}
    >
      <div className="c-wli-hdr">
        <div className="c-wli-hdr-image"></div>
        <div className="c-wli-dtl">
          <p className="c-wli-title">{name}</p>
          <p className="c-wli-date">expires {formatDate(expDate || "")}</p>
        </div>
      </div>
      <ChervonRight />
    </Link>
  );
};

export default WishlistItem;
