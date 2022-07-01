import { Link, useLocation } from "react-router-dom";

import home from "../assets/img/home.png";
import map from "../assets/img/map.png";
import locations from "../assets/img/locations.png";

const icons = { home, map, locations };

export default function Navigation({ pages }) {
  const { pathname } = useLocation();
  console.log(pathname, pathname.includes("new"));
  if (pathname.includes("new")) return null;

  return (
    <nav>
      {pages.map(({ path }) => (
        <NavItem key={path} path={path} pathname={pathname} />
      ))}
    </nav>
  );
}

const NavItem = ({ path, pathname }) => {
  const p = `/${path}`;
  const isDisabled = pathname === p;
  return (
    <Link to={p} key={p}>
      <button disabled={isDisabled}>
        <img src={icons[path]} alt="" />
        <span>{path.toUpperCase()}</span>
      </button>
    </Link>
  );
};
