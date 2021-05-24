import React from "react";

function Login() {
  return (
    <div class="login-reg-panel">
    
      <div class="white-panel">
        <div class="login-show">
          <h2>LOGIN</h2>
          <input type="text" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input  type="button" value="Login" />
          <a href="">Forgot password?</a>
        </div>
      
      </div>
    </div>
  );
}
export default Login;
