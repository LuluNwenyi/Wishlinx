"use client";
import useFetch from "@/hooks/useFetch";
import FullScreenLoader from "@/src/components/Loader";
import Nav from "@/src/components/Nav";
import Profile from "@/src/components/Profile";
import { List } from "@/src/types/dashboard";
import { useParams } from "next/navigation";
import React, { useLayoutEffect } from "react";

const VisitorsLayout = ({ children }: { children: React.ReactNode }) => {
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

  return (
    <div>
      <Nav visit />
      <Profile
        title={userProfile?.name}
        claims={userProfile?.total_claims}
        wishes={userProfile?.total_wishes}
        link={`https://wishlinx.applikuapp.com/${userProfile?.username}`}
      />
      <div className="dsb-main-cnt">{children}</div>
    </div>
  );
};

export default VisitorsLayout;
