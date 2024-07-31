"use client";
import useFetch from "@/hooks/useFetch";
import FullScreenLoader from "@/src/components/Loader";
import Nav from "@/src/components/Nav";
import Profile from "@/src/components/Profile";
import { User } from "@/src/types/dashboard";
import { useLayoutEffect } from "react";
import "../../styles/index.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, loading, fetchData } = useFetch<User>({
    url: "/user",
    method: "GET",
    useCache: true,
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
  const {
    data: totalClaims,
    loading: fetchingClaims,
    fetchData: fetchClaims,
  } = useFetch<{ message: string; total_claims: number }>({
    url: "/total-claims",
    method: "GET",
    shouldToastSuccess: false,
  });

  useLayoutEffect(() => {
    fetchClaims();
    fetchWishes();
    fetchData();
  }, []);

  if (loading || fetchingClaims || fetchingWishes) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Nav />
      <main>
        <Profile
          title={data?.name}
          claims={totalClaims?.total_claims}
          wishes={totalWishes?.total_wishes}
          link={`https://wishlinx.vercel.app/${data?.username}`}
        />
        <div className="dsb-main-cnt">{children}</div>
      </main>
    </>
  );
}
