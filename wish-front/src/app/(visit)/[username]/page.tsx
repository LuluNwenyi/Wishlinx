"use client";
import useFetch from "@/hooks/useFetch";
import FullScreenLoader from "@/src/components/Loader";
import ChervonRight from "@/src/components/svgs/ChervonRight";
import { List, WishListItemProps } from "@/src/types/dashboard";
import cx from "classnames";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLayoutEffect } from "react";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

const WishlistItem = ({
  isCard = false,
  name,
  expDate,
  id,
}: WishListItemProps) => {
  return (
    <Link
      href={`${id}`}
      className={cx("c-wli", {
        ["c-wli--card"]: isCard,
      })}
    >
      <div className="c-wli-hdr">
        <div className="c-wli-hdr-image"></div>
        <div className="c-wli-dtl">
          <p className="c-wli-title">{name}</p>
          <p className="c-wli-date">expires {formatDate(expDate || "")}</p>
        </div>
      </div>
      <ChervonRight />
    </Link>
  );
};

const UserName = () => {
  const { username } = useParams();

  const {
    data: userProfile,
    loading: fetchingProfile,
    fetchData: fetchProfile,
  } = useFetch<{
    name: string;
    public_id: string;
    total_claims: number;
    total_wishes: number;
    username: string;
    lists: List[];
  }>({
    url: `/${username}`,
    method: "GET",
    // useCache: true,
    shouldToastSuccess: false,
  });

  useLayoutEffect(() => {
    fetchProfile();
  }, []);

  if (fetchingProfile) return <FullScreenLoader />;

  if (userProfile) {
    console.log(userProfile.lists);
  }

  return (
    <>
      <section>
        <h2>Wish Lists</h2>

        <div className="wl-grid">
          {userProfile && userProfile.lists.length < 1 ? (
            <p>No Lists created</p>
          ) : (
            <>
              {userProfile?.lists?.map((list) => (
                <WishlistItem
                  key={list.id}
                  isCard={true}
                  name={list?.title}
                  id={`/${username}/${list?.id}`}
                  expDate={list?.expiry_date}
                />
              ))}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default UserName;
