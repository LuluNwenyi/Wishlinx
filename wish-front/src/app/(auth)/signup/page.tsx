/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import useFetch from "@/hooks/useFetch";
import Button from "@/src/components/Button";
import { setCookie } from "@/utils/cookies";
import { createData } from "@/utils/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const { data, loading, fetchData } = useFetch<{
    message: string;
    login_token: string;
    refresh_token: string;
  }>({
    url: "/create-user",
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
    if (data && data?.message) {
      // console.log(data);
      toast.success(data.message);

      if (data.login_token) {
        createData("saitama-token", data.login_token);
        setCookie("saitama-token", true);
        createData("saitamaRefresh-token", data.refresh_token);

        router.push("/home");
      }
    }
  }, [data]);

  return (
    <section aria-labelledby="login">
      <div className="s-auth">
        <h2 className="s-auth-title">Join Wishlinx</h2>
        <p className="s-auth-desc">
          Create an account to share your wishlists.
        </p>

        <form className="s-auth-form" onSubmit={handleSubmit}>
          <div className="s-auth-form-input">
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              required
              className="c-input"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              id="username"
              type="text"
              placeholder="Select a username"
              required
              className="c-input"
              value={formData.username}
              onChange={handleChange}
            />
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
            {...{ text: "Sign Up" }}
            extraClass="s-auth-form-btn"
            loading={loading}
            type="submit"
          />
        </form>

        <p className="s-auth-ate">
          Already have an account?<Link href="/">Log In</Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
