import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import { NavLink } from "react-router-dom";
import "./ProfileButton.css";
import { useNavigate } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate(`/`);
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  // console.log(user, "here is my user");
  // console.log(user.id);

  return (
    <div className="dropdown">
      <button className="dropbtn" onClick={toggleMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="dropdown-content-log-in">
            <li>
              Hello {user.firstName} {user.lastName}!
            </li>
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li>
              <NavLink className="manage-spots" to={`/spots/current`}>
                Manage Spots
              </NavLink>
            </li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </div>
        ) : (
          <div className="dropdown-content">
            <OpenModalButton
              className="log-in-button"
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalButton
              className="sign-up-button"
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
