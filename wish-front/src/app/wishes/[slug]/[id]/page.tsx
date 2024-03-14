import Nav from "@/src/components/Nav";
import Profile from "@/src/components/Profile";
import ArrowRightSvg from "@/src/components/svgs/ArrowRightSvg";
import EditSvg from "@/src/components/svgs/EditSvg";
import LovePlusSvg from "@/src/components/svgs/LovePlusSvg";
import PlusSvg from "@/src/components/svgs/PlusSvg";
import WishItem from "@/src/components/WishItem";
import Link from "next/link";

const Index = () => {
  return (
    <>
      <Nav />
      <main>
        <div className="wh-s-wpr">
          <div className="wh-s-hdr">
            <h2>Wish #245697</h2>
            <Link href="/wishes/wis/j/edit" className="wh-s-hdr-link">
              Edit <EditSvg />
            </Link>
          </div>
          <div className="wh-s-pfl">
            <div className="wh-s-pfl-image"></div>
            <div className="wh-s-pfl-dtl">
              <p className="wh-s-pfl-dtl-status">unclaimed</p>
              <h3 className="wh-s-pfl-dtl-title">Apple watch SE 2</h3>
              <p className="wh-s-pfl-dtl-desc">
                An apple watch so I can track my workouts. 🤭
              </p>

              <div className="wh-s-pfl-dtl-info">
                <p>$300</p> <span />
                <p>Qty: 7</p>
              </div>

              <div className="wh-s-pfl-dtl-atn">
                <Link href="#" className=" wh-s-pfl-dtl-link--oln">
                  View item
                  <ArrowRightSvg />
                </Link>
                <Link href="j/claim" className="wh-s-pfl-dtl-link--fld">
                  Claim this item
                  <LovePlusSvg />
                </Link>
              </div>
            </div>
          </div>

          <section>
            <div className="wh-s-lt-wpr">
              <h2 className="wh-s-ls-hdr">More in this list</h2>
              <div className="wh-s-main">
                <Link
                  href="/wishes/create/wish"
                  className="c-btn wl-grid-btn hide-on-dkp c-btn--icon"
                >
                  <PlusSvg /> Create new wish
                </Link>

                <div className="wh-grid">
                  {Array(4)
                    .fill(null)
                    .map((_, idx) => (
                      <WishItem key={idx} />
                    ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Index;
