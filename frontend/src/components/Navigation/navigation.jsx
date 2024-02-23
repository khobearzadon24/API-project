import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav-bar">
      <NavLink className="home-text" to="/">
        Home
        <img
          className="airbnb-logo"
          src="https://i.postimg.cc/VNJM4vrB/logo-removebg-preview.png"
          alt="logo"
        />
      </NavLink>

      {isLoaded && (
        <div className="logo-sign">
          <NavLink className="create" to="/spot/new">
            Create a Spot
          </NavLink>
          <ProfileButton className="extra" user={sessionUser} />
        </div>
      )}
    </ul>
  );
}

export default Navigation;
