import React from "react";
import '../css/styles.css';
import { Link } from "react-router-dom";
//import LoginWin from "./LoginWin";

import { isActive } from "../components/common";
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
                Please <Link to="/login">log in</Link> or{" "}
                <Link to="/signup">sign up!</Link>
            </p>
        );
    };
    return (
        <div>
            <h1 className="blueHeader">
                Welcome to MoneyWatcher Demo </h1>
            <p className="leftAlignedText">
                This web server is created to demo MoneyWatcher's features.
                You can sign up or log in. For the demo, we have pre-created
                several test bank accounts with Plaid sandbox server. You can 
                choose one or several test bank accounts as your own to try out
                MoneyWatcher. (Using the Add Bank Account(s)). After that, with
                Transaction tab, you can query your recent bank charge transactions.

            </p>
            {!!active && ActiveWin()}
            {!active && InactiveWin()}
        </div>
    );
};

export default RootWin;
