/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useFetch from "@/hooks/useFetch";
import FullScreenLoader from "@/src/components/Loader";
import Nav from "@/src/components/Nav";
import ArrowRightSvg from "@/src/components/svgs/ArrowRightSvg";
import EditSvg from "@/src/components/svgs/EditSvg";
import LovePlusSvg from "@/src/components/svgs/LovePlusSvg";
import PlusSvg from "@/src/components/svgs/PlusSvg";
import WishItem from "@/src/components/WishItem";
import formatCurrency from "@/src/helpers/formatCurrency";
import { Wishes } from "@/src/types/dashboard";
import { readData } from "@/utils/storage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const SingleWish = () => {
  const { id } = useParams();
  const listId = readData("listSlug");
  const url = `${listId}/wish/${id}`;
  const { data, loading, fetchData } = useFetch<Wishes>({
    url: url,
    method: "GET",
  });

  const {
    data: wishes,
    loading: fetchingWishes,
    fetchData: fetchWishes,
  } = useFetch<Wishes[]>({
    url: `/${listId}/wish`,
    method: "GET",
  });

  useEffect(() => {
    fetchWishes();
    fetchData();
  }, []);

  if (loading || fetchingWishes) {
    return <FullScreenLoader />;
  }

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
              <p className="wh-s-pfl-dtl-status">{data?.status}</p>
              <h3 className="wh-s-pfl-dtl-title">{data?.item}</h3>
              <p className="wh-s-pfl-dtl-desc">{data?.description} 🤭</p>

              <div className="wh-s-pfl-dtl-info">
                {data && <p>{formatCurrency(data.currency, data.amount)}</p>}

                <span />
                <p>Qty: {data?.quantity}</p>
              </div>

              <div className="wh-s-pfl-dtl-atn">
              <Link
                  href={`${data?.link}`}
                  className=" wh-s-pfl-dtl-link--oln"
                >
                  View item
                  <ArrowRightSvg />
                </Link>
                <Link href={`${id}/claim`} className="wh-s-pfl-dtl-link--fld">
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
                  {wishes && wishes?.length < 1 ? (
                    <p>No wishes for this list.</p>
                  ) : (
                    <>
                      {wishes?.map((wish) => (
                        <WishItem
                          key={wish.id}
                          name={wish?.item}
                          currency={wish?.currency}
                          id={wish?.id}
                          price={wish?.amount}
                          claimed={wish?.status}
                        />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default SingleWish;
