/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useFetch from "@/hooks/useFetch";
import FullScreenLoader from "@/src/components/Loader";
import ClaimSvg from "@/src/components/svgs/ClaimSvg";
import { ClaimsResponse } from "@/src/types/dashboard";
import { useEffect } from "react";

const Claim = () => {
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
    data,
    loading,
    fetchData: fetchClaims,
  } = useFetch<ClaimsResponse>({
    url: "/claims",
    method: "GET",
    shouldToastSuccess: false,
  });

  useEffect(() => {
    fetchClaims();
    fetchTotalClaims();
  }, []);

  if (fetchingClaims || loading) {
    return <FullScreenLoader />;
  }

  return (
    <section aria-labelledby="claims">
      <div>
        <h2 id="claims">Your Claims</h2>

        <div className="clm-grid">
          <div className="clm-ci hide-on-mb">
            <h3 className="clm-ci-title">{totalClaims?.total_claims}</h3>
            <p className="clm-ci-text">claimed items</p>
          </div>

          <div className="clm-grid-right">
            {data && data.claims.length < 1 ? (
              <p> No claims yet</p>
            ) : (
              data?.claims.map((claim) => (
                <div key={claim.id} className="clm-cd">
                  <div className="clm-cd-hdr">
                    <ClaimSvg />
                    <div className="clm-cd-title">
                      <p className="clm-cd-title--md">Wish #{claim?.wish_id}</p>
                      <p className="clm-cd-desc">
                        <span> {claim.name} - </span>
                        <a
                          href="#"
                          className="c-clm-title--uln clm-cd-title--bld"
                        >
                          {claim?.email}
                        </a>
                      </p>
                    </div>
                  </div>
                  <p className="c-clm-time">{claim?.created_at}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Claim;
