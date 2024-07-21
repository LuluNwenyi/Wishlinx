/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useFetch from "@/hooks/useFetch";
import FullScreenLoader from "@/src/components/Loader";
import Nav from "@/src/components/Nav";
import Profile from "@/src/components/Profile";
import PlusSvg from "@/src/components/svgs/PlusSvg";
import WishItem from "@/src/components/WishItem";
import { List, Wishes } from "@/src/types/dashboard";
import { createData } from "@/utils/storage";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Wish = () => {
  const { slug } = useParams();
  // console.log(slug);

  const {
    data: list,
    loading: fetchingList,
    fetchData: fetchList,
  } = useFetch<List>({
    url: `list/${slug}`,
    method: "GET",
  });
  const { data, loading, fetchData } = useFetch<Wishes[]>({
    url: `/${slug}/wish`,
    method: "GET",
  });

  const {
    data: totalClaims,
    loading: fetchingClaims,
    fetchData: fetchTotalClaims,
  } = useFetch<{ message: string; total_claims: number }>({
    url: "/total-claims",
    method: "GET",
    shouldToastSuccess: false,
  });

  const {
    data: totalWishes,
    loading: fetchingWishes,
    fetchData: fetchWishes,
  } = useFetch<{
    message: string;
    total_wishes: number;
  }>({
    url: "/total-wishes",
    method: "GET",
    shouldToastSuccess: false,
  });

  useEffect(() => {
    fetchList();
    fetchTotalClaims();
    fetchWishes();
    fetchData();
    createData("listSlug", slug);
  }, []);

  if (loading || fetchingClaims || fetchingWishes || fetchingList) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Nav />
      <main>
        <Profile
          title={list?.title}
          claims={totalClaims?.total_claims}
          wishes={totalWishes?.total_wishes}
        />
        <div className="dsb-main-cnt">
          <section>
            <h2>Your Wishes</h2>
            <div className="wh-main">
              <Link
                href={`/wishes/create/${slug}`}
                className="c-btn wl-grid-btn hide-on-dkp c-btn--icon"
              >
                <PlusSvg /> Create new wish
              </Link>

              <div className="wh-grid">
                <Link
                  href={`/wishes/create/${slug}`}
                  className="c-btn wl-grid-btn hide-on-mb c-btn--icon"
                >
                  <PlusSvg /> Create new wish
                </Link>

                {data && data?.length < 1 ? (
                  <p>No wishes for this list.</p>
                ) : (
                  <>
                    {data?.map((wish) => (
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
          </section>
        </div>
      </main>
    </>
  );
};

export default Wish;
