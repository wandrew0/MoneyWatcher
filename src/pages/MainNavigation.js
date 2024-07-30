import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { isActive } from "../components/common";
//import classes from "./MainNavigation.css"
import "./MainNavigation.css";
import MainContext from "./MainContext";

const MainNavigation = ({ active }) => {
    const navigate = useNavigate();
    const ctx = React.useContext(MainContext);
    function Logout() {
        ctx.setActive1("0");
        localStorage.token = "";
        navigate("/login");
    }
    const UserName = () => {
        const name =
            "Hello, " +
            localStorage.getItem("first_name") +
            " " +
            localStorage.getItem("last_name");
        return <span className="navUserName2">{name}</span>;
    };
    return (
        <div>
            <header className="header">
                <nav className="nav">
                    <div className="navline">
                        <ul className="list">
                            <li>
                                <NavLink to="/"> Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/Transaction">
                                    Transaction
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/Merchant">
                                    Merchant
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/Rule"> Rule</NavLink>
                            </li>
                            <li>
                                <NavLink to="/add_item">
                                    Add/View Bank Account(s)
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/Alert"> Alert</NavLink>
                            </li>
                            {active === "0" && (
                                <li>
                                    <NavLink to="/login">
                                        Login
                                    </NavLink>
                                </li>
                            )}
                            {active === "0" && (
                                <li>
                                    <NavLink to="/signup">
                                        Signup
                                    </NavLink>
                                </li>
                            )}
                            {active === "1" && (
                                <li>
                                    <button onClick={Logout}>
                                        Logout
                                    </button>
                                </li>
                            )}
                        </ul>
                        {active === "1" && (
                            <UserName className="navUserName" />
                        )}
                    </div>
                </nav>
            </header>
            <hr />
        </div>
    );
};

export default MainNavigation;
