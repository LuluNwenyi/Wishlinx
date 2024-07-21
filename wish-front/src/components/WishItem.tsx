import Link from "next/link";
import { WishItemProps } from "../types/dashboard";

const WishItem = ({ id, name, price, claimed, currency }: WishItemProps) => {
  const content = (
    <>
      <div className="c-wh-hdr">
        <div className="c-wh-hdr-image"></div>
        <div className="c-wh-dtl">
          <p className="c-wh-title">{name}</p>
          {currency === "naira" ? (
            <p className="c-wh-pre">₦{price}</p>
          ) : (
            <p className="c-wh-pre">${price}</p>
          )}
        </div>
      </div>
      {claimed === "claimed" && <div className="c-wh-cld">CLAIMED</div>}
    </>
  );

  return claimed === "claimed" ? (
    <div className="c-wh c-wh-disabled">{content}</div>
  ) : (
    <Link href={`/wishes/wish/${id}`} className="c-wh">
      {content}
    </Link>
  );
};

export default WishItem;
