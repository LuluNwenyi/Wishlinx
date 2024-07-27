/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { WishItemProps } from "../types/dashboard";

const WishItem = ({
  id,
  name,
  price,
  claimed,
  currency,
  image,
}: WishItemProps) => {
  const content = (
    <>
      <div className="c-wh-hdr">
        <div className="c-wh-hdr-image">
          {image && (
            <img src={image} alt={name} width={"100%"} height={"100%"} />
          )}
        </div>
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
