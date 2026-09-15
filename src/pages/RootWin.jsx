import React from "react";
import '../css/styles.css';
import { Link } from "react-router-dom";
//import LoginWin from "./LoginWin";

import { isActive } from "../components/common";
import BlueLink from "./BlueLink";
import DemoInstructions from "./DemoInstructions";
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
                                Add/View Bank Account(s)
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
            <DemoInstructions />                
            
            {!active && InactiveWin()}
        </div>
    );
};

export default RootWin;
