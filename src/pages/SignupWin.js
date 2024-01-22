import React from "react";
import { jsonFetch, buildIpAddress } from "../components/common";
import MainContext from "./MainContext"
import { Link } from "react-router-dom";

const SignupWin = () => {
  const firstName_0 = "";
  const lastName_0 = "";
  const email_0 = ""
  const password_0 = "";
  const [firstName, setFirstName] = React.useState(firstName_0);
  const [lastName, setLastName] = React.useState(lastName_0);
  const [email, setEmail] = React.useState(email_0)
  const [password, setPassword] = React.useState(password_0)
  const [errmsg, setErrmsg] = React.useState("");

  function firstNameChange(e) { setFirstName(e.target.value) }
  function lastNameChange(e) { setLastName(e.target.value) }
  function emailChange(e) { setEmail(e.target.value) }
  function passwordChange(e) { setPassword(e.target.value) }
  const ctx = React.useContext(MainContext);
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
    // const postdata = new FormData();
    // postdata.append("first_name", data.firstname);
    // postdata.append("last_name", data.lastname);
    // postdata.append("email", data.email);
    // postdata.append("password", data.password);
    const postdata = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      password: data.password
    }
    // console.log("data=", data, "post=", postdata);
    const filename = buildIpAddress(3000, "/api/v1/customer/signup");
    //const filename = "http://127.0.0.1:3000/api/v1/customer"
    jsonFetch(filename, postdata)
      .then((d) => {
        // console.log("d=", d);
        d.json()
          .then((json) => {
            // console.log("got json: ", json);
            if (json.status === "success") {
              // console.log('good');
              localStorage.setItem("first_name", json.data.first_name)
              localStorage.setItem("last_name", json.data.last_name)
              localStorage.setItem("email", json.data.email)
              localStorage.setItem("token", json.token)
              ctx.setActive1("1");
              setErrmsg(<p>Success! Next step:  <Link to="/add_item">add bank accounts</Link></p>);
            } else {
              setErrmsg("error");
            }
          })
      }).catch((err) => {
        // console.log("ERROR(signup)", err);
      })
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div>
          <label htmlFor="name">First Name</label>
          <input id="firstname" type="name" name="firstname" value={firstName} onChange={firstNameChange} required />
        </div>
        <div>
          <label htmlFor="name">Last Name</label>
          <input id="lastname" type="name" name="lastname" value={lastName} onChange={lastNameChange} required />
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input id="email" type="email" name="email" onChange={emailChange} value={email} required />
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
            Sign Up
          </button>
        </p>
      </form>
      {errmsg !== "" && (<p>{errmsg}</p>)}
    </div>
  )
}

export default SignupWin;