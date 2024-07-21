/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useFetch from "@/hooks/useFetch";
import Button from "@/src/components/Button";
import ClaimItem from "@/src/components/ClaimItem";
import FullScreenLoader from "@/src/components/Loader";
import WishlistItem from "@/src/components/WishlistItem";
import PlusSvg from "@/src/components/svgs/PlusSvg";
import { ClaimsResponse, List } from "@/src/types/dashboard";
import Link from "next/link";
import { useEffect } from "react";

const Home = () => {
  const { data, loading, fetchData } = useFetch<List[]>({
    url: "/lists",
    method: "GET",
  });

  const {
    data: Claims,
    loading: isFetchingClaims,
    fetchData: fetchClaims,
  } = useFetch<ClaimsResponse>({
    url: "/claims",
    method: "GET",
    shouldToastSuccess: false,
  });

  useEffect(() => {
    fetchClaims();
    fetchData();
  }, []);

  if (loading || isFetchingClaims) {
    return <FullScreenLoader />;
  }

  return (
    <div>
      <div className="hm-main">
        <section aria-labelledby="lists" className="hm-main-left">
          <h2 id="lists">Your Lists</h2>
          <div className="hm-main-list hm-main-list--nmb">
            {data && data?.length < 1 ? (
              <p>No list created</p>
            ) : (
              data?.map((list) => (
                <WishlistItem
                  key={list.id}
                  isCard={true}
                  name={list?.title}
                  id={list?.id}
                  expDate={list?.expiry_date}
                />
              ))
            )}
          </div>
          <Link href={"/wishes/create/list"}>
            <Button
              {...{
                text: "Create new list",
                icon: <PlusSvg />,
                foreignClass: "hm-main-list-btn c-btn--icon",
              }}
            />
          </Link>
        </section>
        <section aria-labelledby="claims" className="hm-main-right">
          <div className="hm-main-right-hdr">
            <h2 id="claims">Recent Claims</h2>
            <Link href="/claims" className="hm-main-hdr-link hide-on-mb">
              View all claims
            </Link>
          </div>
          <div className="hm-main-list hm-main-list--btp">
            {Claims && Claims.claims.length < 1 ? (
              <p> No claims yet</p>
            ) : (
              Claims?.claims.map((claim) => (
                <ClaimItem
                  key={claim.id}
                  wishId={claim.wish_id}
                  name={claim.name}
                  time={claim.created_at}
                />
              ))
            )}
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

export default Home;
