import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const validationObj = {};
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [disable, setDisable] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    setSubmitted(true);
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemo = (e) => {
    e.preventDefault();
    setErrors({});
    const demoUser = {};
    demoUser.credential = "spongebob@user.io";
    demoUser.password = "gary123";
    return dispatch(sessionActions.login(demoUser))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  if (!credential || !password) {
    validationObj.required = "Username or email is required";
  }

  return (
    <div className="log-in-modal">
      <h1 className="log-in-title">Log In</h1>
      <form className="log-in-form" onSubmit={handleSubmit}>
        <label className="user-email">
          Username or Email
          <input
            className="user-email-box"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        {submitted && "required" in validationObj && (
          <p>{validationObj.required}</p>
        )}
        <label className="password">
          Password
          <input
            className="password-box"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button
          type="submit"
          disabled={credential.length > 3 && password.length > 5 ? false : true}
        >
          Log In
        </button>
      </form>
      <button className="demo-user" onClick={handleDemo}>
        Demo User
      </button>
    </div>
  );
}

export default LoginFormModal;
