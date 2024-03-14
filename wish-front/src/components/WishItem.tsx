import Link from "next/link";
import { WishItemProps } from "../types/dashboard";

const WishItem = ({ claimed = false }: WishItemProps) => {
  return (
    <Link href="/wishes/wis/j" className="c-wh">
      <div className="c-wh-hdr">
        <div className="c-wh-hdr-image"></div>
        <div className="c-wh-dtl">
          <p className="c-wh-title">Apple watch SE 2</p>
          <p className="c-wh-pre">$ 250</p>
        </div>
      </div>
      {claimed && <div className="c-wh-cld">CLAIMED</div>}
    </Link>
  );
};

export default WishItem;
