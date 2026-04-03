import NavBar from "./NavBar";

function BaseLayout({ children }) {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="page-container">{children}</main>
    </div>
  );
}

export default BaseLayout;
