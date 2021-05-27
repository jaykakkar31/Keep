import React, { useState } from "react";

function Login(props) {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  function handleChange(event) {
    const { name, value } = event.target;
    console.log(name);
    setLoginDetails((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }
  function submit(event) {
    event.preventDefault();

    if (loginDetails.email === "") {
      alert("Email Cannot Be Empty");
    } else if (loginDetails.password === "") {
      alert("Password Cannot Be Empty");
    } else {
      props.login(loginDetails);
      console.log(loginDetails);

      setLoginDetails({
        email: "",
        password: "",
      });
    }
  }
  return (
    <div className="login-reg-panel">
      <div className="white-panel">
        <div className="login-show">
          <h2>LOGIN</h2>
          <form>
            <input
              onChange={handleChange}
              type="email"
              placeholder="Email"
              name="email"
              value={loginDetails.email}
autoComplete="on"
            />
            <input
              onChange={handleChange}
              type="password"
              placeholder="Password"
              name="password"
              value={loginDetails.password}
            />

            <button
              type="submit"
              onClick={submit}
              // onclick={props.login(loginDetails)}
            >
              LOGIN
            </button>

            {/* <input type="button" value="Login" /> */}
            {/* <a href="">Forgot password?</a> */}
          </form>
          <p>{props.LoginResponse}</p>
          {console.log(props.LoginResponse + "  pppppppppppp")}
        </div>
      </div>
    </div>
  );
}
export default Login;
