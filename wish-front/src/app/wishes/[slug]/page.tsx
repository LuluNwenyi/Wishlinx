import Nav from "@/src/components/Nav";
import Profile from "@/src/components/Profile";
import PlusSvg from "@/src/components/svgs/PlusSvg";
import WishItem from "@/src/components/WishItem";
import Link from "next/link";

const Index = () => {
  return (
    <>
      <Nav />
      <main>
        <Profile title="Favour’s birthday wishlist" claims={0} wishes={4} />
        <div className="dsb-main-cnt">
          <section>
            <h2>Your Wishes</h2>
            <div className="wh-main">
              <Link
                href="/wishes/create/wish"
                className="c-btn wl-grid-btn hide-on-dkp c-btn--icon"
              >
                <PlusSvg /> Create new wish
              </Link>

              <div className="wh-grid">
                <Link
                  href="/wishes/create/wish"
                  className="c-btn wl-grid-btn hide-on-mb c-btn--icon"
                >
                  <PlusSvg /> Create new wish
                </Link>

                {Array(7)
                  .fill(null)
                  .map((_, idx) => (
                    <WishItem key={idx} />
                  ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Index;
