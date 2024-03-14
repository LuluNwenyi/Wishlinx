import Link from "next/link";
import ArrowRightSvg from "./svgs/ArrowRightSvg";
import { ProfileProps } from "../types/dashboard";
import { genericTextFormat } from "../util/dashboard";

const Profile = ({ title, wishes, claims }: ProfileProps) => {
  return (
    <section aria-labelledby="profile">
      <div className="c-pfl">
        <div className="c-pfl-main">
          <div className="c-pfl-image"></div>
          <div>
            <h2 className="c-pfl-title">{title}</h2>
            <div className="c-pfl-dtl">
              <p className="c-pfl-dtl-item">
                {genericTextFormat(wishes, "wish", "wishes")}
              </p>
              <span className="c-pfl-dtl-dot"></span>
              <p className="c-pfl-dtl-item">
                {genericTextFormat(claims, "claim", "claims")}
              </p>
            </div>
          </div>
        </div>
        <div>
          <Link href="#" className="c-pfl-link">
            <span>Share your link</span>
            <ArrowRightSvg />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Profile;
