import React from "react";

function Register() {
  return (
    <div class="login-reg-panel">
      <div class="white-panel">
        <div class="register-show">
          <h2>REGISTER</h2>
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Confirm Password" />
          <input type="button" value="Register" />
        </div>
      </div>
    </div>
  );
}
export default Register;
