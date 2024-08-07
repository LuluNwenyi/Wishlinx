import Nav from "@/src/components/Nav";
import "../../styles/index.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="auth">
        <div className="auth-nav">
          <Nav />
        </div>
        <div className="auth-main">
          <div className="auth-image"></div>
          <div className="auth-main-cnt">{children}</div>
        </div>
      </div>
    </>
  );
}
