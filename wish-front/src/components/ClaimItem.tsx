import Link from "next/link";
import timeAgo from "../helpers/timeAgo";
import ClaimSvg from "./svgs/ClaimSvg";

const ClaimItem = ({
  wishId,
  name,
  time,
}: {
  wishId: string;
  name: string;
  time: string;
}) => {
  return (
    <div className="c-clm">
      <div className="c-clm-hdr">
        <ClaimSvg />
        <p className="c-clm-title">
          <span className="c-clm-title--bld c-clm-title--dkp">New Claim! </span>
          <Link href="#" className="c-clm-title--uln">
            Wish #{wishId}
          </Link>
          <span> has been claimed</span>
          <span className="c-clm-title--dkp"> by {name}</span>
        </p>
      </div>
      <p className="c-clm-time">{timeAgo(time)}</p>
    </div>
  );
};

export default ClaimItem;
