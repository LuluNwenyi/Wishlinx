/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useFetch from "@/hooks/useFetch";
import FullScreenLoader from "@/src/components/Loader";
import WishlistItem from "@/src/components/WishlistItem";
import PlusSvg from "@/src/components/svgs/PlusSvg";
import { List } from "@/src/types/dashboard";
import Link from "next/link";
import { useEffect } from "react";

const Lists = () => {
  const { data, loading, fetchData } = useFetch<List[]>({
    url: "/lists",
    method: "GET",
  });

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

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
        {data && data.length < 1 ? (
          <p>No Lists created</p>
        ) : (
          <>
            {data?.map((list) => (
              <WishlistItem
                key={list.id}
                isCard={true}
                name={list?.title}
                id={list?.id}
                expDate={list?.expiry_date}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Lists;
