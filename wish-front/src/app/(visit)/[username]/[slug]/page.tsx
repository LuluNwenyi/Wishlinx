/* eslint-disable @next/next/no-img-element */
"use client";
import { useParams } from "next/navigation";

import useFetch from "@/hooks/useFetch";
import FullScreenLoader from "@/src/components/Loader";
import { WishItemProps, Wishes } from "@/src/types/dashboard";
import Link from "next/link";
import { useEffect } from "react";

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
    <Link href={`${id}`} className="c-wh">
      {content}
    </Link>
  );
};

const WishesPage = () => {
  const { username, slug } = useParams();
  if (username) {
    console.log(username, slug);
  }

  const {
    data: wishesList,
    loading: fetchingWishes,
    fetchData: fetchWishes,
  } = useFetch<Wishes[]>({
    url: `/${slug}/wish`,
    method: "GET",
  });

  useEffect(() => {
    fetchWishes();
  }, []);

  if (fetchingWishes) {
    return <FullScreenLoader />;
  }

  //   if (wishesList) {
  //     console.log(wishesList);
  //   }

  return (
    <>
      <section>
        <h2>Wish Lists</h2>

        <div className="wl-grid">
          {wishesList && wishesList?.length < 1 ? (
            <p>No wishes for this list.</p>
          ) : (
            <>
              {wishesList?.map((wish) => (
                <WishItem
                  key={wish.id}
                  name={wish?.item}
                  currency={wish?.currency}
                  id={`/${username}/${slug}/${wish?.id}`}
                  price={wish?.amount}
                  claimed={wish?.status}
                />
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default WishesPage;
