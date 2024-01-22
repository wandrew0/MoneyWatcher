import React from "react";
import { Link } from 'react-router-dom'
//import LoginWin from "./LoginWin";

import { isActive } from "../components/common";
// <LoginWin/>

//<Link to="/Merchant">Merchant</Link>
//<Link to="/Rule">Rule</Link>

const RootWin = () => {
  const active = JSON.parse(isActive());
  const ActiveWin = () => {
    return (<div>
      <table>
        <tr><td><Link to="/Transaction">Transaction</Link></td></tr>
        <tr><td><Link to="/Merchant">Merchant</Link></td></tr>
        <tr><td><Link to="/Rule">Rule</Link></td></tr>
        <tr><td><Link to="/add_item">Add Bank Account(s)</Link></td></tr>
      </table>
    </div>)
  }
  const InactiveWin = () => {
    return (<p>Please <Link to="/login">log in</Link> or <Link to="/signup">sign up!</Link></p>)
  }
  return (
    <div>
      <h1>Welcome to MoneyWatcher</h1>
      {!!active && ActiveWin()}
      {!active && InactiveWin()}
    </div>
  )
}

export default RootWin;