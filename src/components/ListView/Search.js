import "./Search.css";
import deleteIcon from "../../assets/img/delete.png";
import plusIcon from "../../assets/img/plus.png";

import { Link } from "react-router-dom";
import { useStreetContext } from "../../utils/providers";

import useAnimation from "../../utils/hooks/useAnimation";

export default function Search() {
  const { search, undo } = useStreetContext();
  const animation = useAnimation("elastic", 600, 0);
  const style = { transform: `scale(${animation})`, transformOrigin: "bottom" };

  return (
    <div className="search overlay-search">
      <input
        placeholder="Search..."
        value={search[0].toUpperCase()}
        onChange={(e) => search[1](e.target.value.toUpperCase())}
      />
      <button onClick={undo} className="reset">
        <img src={deleteIcon} alt="" />
      </button>
      <button className="new" style={style}>
        <Link to="/new/0">
          <img src={plusIcon} alt="" />
        </Link>
      </button>
    </div>
  );
}
