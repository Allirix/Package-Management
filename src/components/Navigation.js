import { Link, useLocation } from "react-router-dom";

import home from "../assets/img/home.png";
import map from "../assets/img/map.png";
import locations from "../assets/img/locations.png";

const icons = { home, map, locations };

export default function Navigation({ pages }) {
  return (
    <nav>
      {pages.map(({ path }) => (
        <NavItem key={path} path={path} />
      ))}
    </nav>
  );
}

const NavItem = ({ path }) => {
  const location = useLocation();
  const p = `/${path}`;
  const isDisabled = location.pathname === p;
  return (
    <Link to={p} key={p}>
      <button disabled={isDisabled}>
        <img src={icons[path]} alt="" />
        <span>{path.toUpperCase()}</span>
      </button>
    </Link>
  );
};
