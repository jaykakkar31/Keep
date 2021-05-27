import React, { useState } from "react";
function Register(props) {
  const [registerDetails, setRegisterDetails] = useState({
    email: "",
    username: "",
    password: "",
  });
  function handleChange(event) {
    const { name, value } = event.target;
    console.log(name);
    setRegisterDetails((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }
  function submit(event) {
    event.preventDefault();

    if (registerDetails.email === "") {
      alert("Email Cannot Be Empty");
    } else if (registerDetails.username === "") {
      alert("Username Cannot Be Empty");
    } else if (registerDetails.password === "") {
      alert("Password Cannot Be Empty");
    } else {
      props.register(registerDetails);
      console.log(registerDetails);
    }
    setRegisterDetails({
      email:"",username:"",password:""
    })

  }
  return (
    <div className="login-reg-panel">
      <div className="white-panel">
        <div className="register-show">
          <h2>REGISTER</h2>
          <form
           
          >
            <input
              onChange={handleChange}
              type="email"
              placeholder="Email"
              name="email"
              value={registerDetails.email}
            />
            <input
              onChange={handleChange}
              type="text"
              placeholder="Username"
              name="username"
              value={registerDetails.username}
            />
            <input
              onChange={handleChange}
              type="password"
              placeholder="Password"
              name="password"
              value={registerDetails.password}
            />
            <button onClick={submit}>Register</button>
          </form>
          {/* <input type="button" value="Register" /> */}
        </div>
      </div>
    </div>
  );
}
export default Register;
