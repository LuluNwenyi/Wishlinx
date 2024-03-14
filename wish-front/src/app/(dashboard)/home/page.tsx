import Button from "@/src/components/Button";
import ClaimItem from "@/src/components/ClaimItem";
import WishlistItem from "@/src/components/WishlistItem";
import PlusSvg from "@/src/components/svgs/PlusSvg";

import Link from "next/link";

const Index = () => {
  return (
    <div>
      <div className="hm-main">
        <section aria-labelledby="lists" className="hm-main-left">
          <h2 id="lists">Your Lists</h2>
          <div className="hm-main-list hm-main-list--nmb">
            {Array(3)
              .fill(null)
              .map((_, idx) => (
                <WishlistItem key={idx} />
              ))}
          </div>
          <Button
            {...{
              text: "Create new list",
              icon: <PlusSvg />,
              foreignClass: "hm-main-list-btn c-btn--icon",
            }}
          />
        </section>
        <section aria-labelledby="claims" className="hm-main-right">
          <div className="hm-main-right-hdr">
            <h2 id="claims">Recent Claims</h2>
            <Link href="#" className="hm-main-hdr-link hide-on-mb">
              View all claims
            </Link>
          </div>
          <div className="hm-main-list hm-main-list--btp">
            {Array(5)
              .fill(null)
              .map((_, idx) => (
                <ClaimItem key={idx} />
              ))}
          </div>
          <Button
            {...{
              text: "View all claims",
              foreignClass: "hm-main-list-btn hide-on-dkp",
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default Index;
