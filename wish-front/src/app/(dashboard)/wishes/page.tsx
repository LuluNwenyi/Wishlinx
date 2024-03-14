import WishlistItem from "@/src/components/WishlistItem";
import PlusSvg from "@/src/components/svgs/PlusSvg";
import Link from "next/link";

const Index = () => {
  return (
    <section>
      <h2>Your Lists</h2>

      <div className="wl-grid">
        <Link
          href="/wishes/create/list"
          className="c-btn wl-grid-btn c-btn--icon"
        >
          <PlusSvg /> Create new list
        </Link>
        {Array(7)
          .fill(null)
          .map((_, idx) => (
            <WishlistItem key={idx} isCard={true} />
          ))}
      </div>
    </section>
  );
};

export default Index;
