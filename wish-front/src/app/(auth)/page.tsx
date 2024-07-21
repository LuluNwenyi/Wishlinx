/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useFetch from "@/hooks/useFetch";
import { setCookie } from "@/utils/cookies";
import { createData } from "@/utils/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../components/Button";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { data, loading, fetchData } = useFetch<{
    token: string;
    refresh_token: string;
  }>({
    url: "/login",
    method: "POST",
    body: formData,
    shouldToastError: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  useEffect(() => {
    if (data && data?.token) {
      toast.success("Login Successful");

      createData("saitama-token", data.token);
      setCookie("saitama-token", true);
      createData("saitamaRefresh-token", data.refresh_token);

      router.push("/home");
    }
  }, [data]);

  return (
    <section aria-labelledby="login">
      <div className="s-auth">
        <h2 className="s-auth-title">Welcome back!</h2>
        <p className="s-auth-desc">Sign in to continue to your wishlists.</p>

        <form className="s-auth-form" onSubmit={handleSubmit}>
          <div className="s-auth-form-input">
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              required
              className="c-input"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              id="password"
              type="password"
              placeholder="Password"
              required
              className="c-input"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <Button
            {...{ text: "Log In" }}
            extraClass="s-auth-form-btn"
            type="submit"
            loading={loading}
          />
        </form>

        <p className="s-auth-ate">
          Don’t have an account?<Link href="/signup">Sign Up</Link>
        </p>
      </div>
    </section>
  );
}
