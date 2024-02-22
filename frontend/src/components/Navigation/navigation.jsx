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
          <img
            className="airbnb-logo"
            src="https://i.postimg.cc/kGV4Lf6q/logo.jpg"
            alt="logo"
          />
        </NavLink>
      </li>

      {isLoaded && (
        <li className="logo-sign">
          <NavLink className="create" to="/spot/new">
            Create a Spot
          </NavLink>
          <ProfileButton className="extra" user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
