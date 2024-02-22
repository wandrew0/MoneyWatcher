import React from "react";
import '../css/styles.css';
import { Link } from "react-router-dom";
//import LoginWin from "./LoginWin";

import { isActive } from "../components/common";
import BlueLink from "./BlueLink";
// <LoginWin/>

//<Link to="/Merchant">Merchant</Link>
//<Link to="/Rule">Rule</Link>

const RootWin = () => {
    const active = JSON.parse(isActive());
    const ActiveWin = () => {
        return (
            <div>
                <table>
                    <tr>
                        <td>
                            <Link to="/Transaction">Transaction</Link>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/Merchant">Merchant</Link>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/Rule">Rule</Link>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/add_item">
                                Add Bank Account(s)
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Link to="/Alert">Alert History</Link>
                        </td>
                    </tr>
                </table>
            </div>
        );
    };
    const InactiveWin = () => {
        return (
            <p className="leftAlignedText">
                Please <BlueLink to="/login" text="Log In" /> or <BlueLink to="/signup" text="Sign Up" />
            </p>
        );
    };
    return (
        <div>
            <h1 className="blueHeader">
                Welcome to MoneyWatcher Demo </h1>
            <p className="leftAlignedText">
                This web server showcases the features of MoneyWatcher. 
                Users can register to get an account to begin exploring its capabilities. 
                We've set up multiple test bank accounts through the Plaid sandbox server for demo purposes. 
                You're invited to select one or multiple test accounts as your own through the "Add Bank Account(s)" option. 
                Following this, the "Transactions" tab allows you to review your recent bank charge transactions. 
                Moreover, you can set up spending rules and track any alerts these rules trigger.
            </p>
            {!!active && ActiveWin()}
            {!active && InactiveWin()}
        </div>
    );
};

export default RootWin;
