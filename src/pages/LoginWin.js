import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import { jsonFetch, buildIpAddress, setActive } from "../components/common";
import MainContext from "./MainContext"
//import { fetchText } from "../components/common.js"

const LoginWin = () => {
  let navigate = useNavigate();
  const firstName_0 = "";
  const lastName_0 = "";
  const email_0 = ""
  const password_0 = "";
  const [firstName, setFirstName] = React.useState(firstName_0);
  const [lastName, setLastName] = React.useState(lastName_0);
  const [email, setEmail] = React.useState(email_0)
  const [password, setPassword] = React.useState(password_0)
  const ctx = React.useContext(MainContext)
  const [errmsg, setErrmsg] = React.useState("");

  function prepEdited() { setErrmsg(""); }
  function firstNameChange(e) { setFirstName(e.target.value); prepEdited(); }
  function lastNameChange(e) { setLastName(e.target.value); prepEdited(); }
  function emailChange(e) { setEmail(e.target.value); prepEdited(); }
  function passwordChange(e) { setPassword(e.target.value); prepEdited(); }
  function resetHandle() {
    setFirstName(firstName_0);
    setLastName(lastName_0);
    setEmail(email_0);
    setPassword(password_0);
  }
  function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    // const ..= fd.getAll("multiple")  //for same name, diff value
    const data = Object.fromEntries(fd.entries());
    // console.log(data);
    const postdata = {
      email: data.email,
      password: data.password
    }
    // console.log("data=", data, "post=", postdata);
    const filename = buildIpAddress(3000, "/api/v1/customer/login");
    //const filename = "http://127.0.0.1:3000/api/v1/login"
    jsonFetch(filename, postdata)
      .then((d) => {
        // console.log("d=", d);
        d.json()
          .then((json) => {
            // console.log("got json: ", json, "data=", data);
            if (json.status === "success") {
              // console.log('good');
              localStorage.setItem("first_name", json.data.first_name)
              localStorage.setItem("last_name", json.data.last_name)
              localStorage.setItem("email", json.data.email)
              localStorage.setItem("token", json.token)
              ctx.setActive1("1");
              setErrmsg("");
              navigate("/");
            } else {
              setErrmsg("Login Error");
            }
          })
      }).catch((err) => {
        // console.log("ERROR(signup)", err);
        setErrmsg("Login Error2");
      })
  }
  /*<Link to='/forgotpassword' style={{margin:"1rem"}}>Forgot Password</Link>*/
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {/* <div>
            <label htmlFor="name">First Name</label>
            <input id="firstname" type="name" name="firstname" value={firstName} onChange={firstNameChange} required/>
          </div>
          <div>
            <label htmlFor="name">Last Name</label>
            <input id="lastname" type="name" name="lastname" value={lastName} onChange={lastNameChange} required/>
          </div> */}
        <div>
          <label htmlFor="email">email</label>
          <input id="email" type="email" name="email" onChange={emailChange} value={email} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" value={password} onChange={passwordChange} required />
        </div>
        <p className="form-actions">
          <button className="button button-flat" onClick={resetHandle}>
            Reset
          </button>
          <button type="submit" className="button">
            Log In
          </button>
        </p>
      </form>
      <Link to='/signup'>Sign Up</Link>
      {errmsg !== "" && (<p>{errmsg}</p>)}
    </div>
  )
}

export default LoginWin;