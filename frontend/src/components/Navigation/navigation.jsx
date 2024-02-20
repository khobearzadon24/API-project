import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav-bar">
      <li className="home">
        <NavLink className="home-text" to="/">
          Home
        </NavLink>
      </li>
      {isLoaded && (
        <li className="log-sign">
          <ProfileButton className="extra" user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
