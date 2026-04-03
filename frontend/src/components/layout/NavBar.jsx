import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/election/active", label: "Active Election" },
  { to: "/student/login", label: "Student Login" },
  { to: "/admin/login", label: "Admin Login" },
  { to: "/results", label: "Results" },
];

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar__brand">Online Voting System</div>
      <div className="navbar__links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default NavBar;
