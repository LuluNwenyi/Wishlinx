import Nav from "../../components/Nav";
import Button from "../../components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <section aria-labelledby="login">
      <div className="s-auth">
        <h2 className="s-auth-title">Welcome back!</h2>
        <p className="s-auth-desc">Sign in to continue to your wishlists.</p>

        <form className="s-auth-form">
          <div className="s-auth-form-input">
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              required
              className="c-input"
            />

            <input
              id="password"
              type="password"
              placeholder="Password"
              required
              className="c-input"
            />
          </div>
          <Button {...{ text: "Log In" }} extraClass="s-auth-form-btn" />
        </form>
        <p className="s-auth-ate">
          Don’t have an account?<Link href="/signup">Sign Up</Link>
        </p>
      </div>
    </section>
  );
}
