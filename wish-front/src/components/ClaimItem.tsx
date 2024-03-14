import Link from "next/link";
import ClaimSvg from "./svgs/ClaimSvg";

const ClaimItem = () => {
  return (
    <div className="c-clm">
      <div className="c-clm-hdr">
        <ClaimSvg />
        <p className="c-clm-title">
          <span className="c-clm-title--bld c-clm-title--dkp">New Claim! </span>
          <Link href="#" className="c-clm-title--uln">
            Wish #236871
          </Link>
          <span> has been claimed</span>
          <span className="c-clm-title--dkp"> by Oluchi</span>
        </p>
      </div>
      <p className="c-clm-time">2h ago</p>
    </div>
  );
};

export default ClaimItem;
