import Button from "@/src/components/Button";
import Link from "next/link";

const Index = () => {
  return (
    <section aria-labelledby="login">
      <div className="s-auth">
        <h2 className="s-auth-title">Join Wishlinx</h2>
        <p className="s-auth-desc">
          Create an account to share your wishlists.
        </p>

        <form className="s-auth-form">
          <div className="s-auth-form-input">
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              required
              className="c-input"
            />
            <input
              id="username"
              type="text"
              placeholder="Select a username"
              required
              className="c-input"
            />
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              required
              className="c-input"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="c-input"
            />
          </div>

          <Button {...{ text: "Sign Up" }} extraClass="s-auth-form-btn" />
        </form>

        <p className="s-auth-ate">
          Already have an account?<Link href="/">Log In</Link>
        </p>
      </div>
    </section>
  );
};

export default Index;
