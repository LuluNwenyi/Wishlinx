/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import { toast } from "react-toastify";

interface ConfirmEmailResponse {
  message: string;
}

const Verify = () => {
  const { token } = useParams();
  const { data, loading, error, fetchData } = useFetch<ConfirmEmailResponse>({
    url: `/confirm_email/${token}`,
    method: "PATCH",
  });

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  return (
    <div className="verify-email">
      {loading && <h1>Verifying your email...</h1>}
      {error && <h1>{error}</h1>}
      {data && (
        <div>
          <h1>{data.message}</h1>
          <Link href="/login">
            <button>Go to Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Verify;
