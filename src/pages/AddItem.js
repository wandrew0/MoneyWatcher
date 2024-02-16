import React from "react";
import ErrorBoxWithLink from "./ErrorBoxWithLink";
import { getJsonData, buildIpAddress } from "../components/common";
import { Link } from 'react-router-dom'
import MainContext from "./MainContext"
import "./AddItem.css"
import "../css/styles.css"
import { set } from "mongoose";

const AddItem = () => {
    const [errmsg, setErrmsg] = React.useState([]);
    const ctx = React.useContext(MainContext);
    const [selected, setSelected] = React.useState(new Set());
    const [tokens, setTokens] = React.useState([]);
    console.log("AddItem");
    function handleErrorClose()  {
        console.log('reset');
        setErrmsg(''); // Clear the error message, hiding the error box
    }
    if (ctx.active === "0") {
        return (
            <ErrorBoxWithLink errorMessage='You are not signed in.' link='/login' linkText='Sign In' />
        )
    }
    React.useEffect(() => {
        setTokens([{
            bank: "loading",
            token: "loading"
        }]);
        getJsonData("/api/v1/item/get_all", {}).then((d) => {
            d.json().then((json) => {
                if (json.status === "success") {
                    setTokens(json.data)
                }
            });
        })
    }, []);
    function handleErrorClose()  {
        setErrmsg(''); // Clear the error message, hiding the error box
      };
    async function listSubmit(event) {
        event.preventDefault();
        const newmsg = [];
        const promises = [];
        const used = [];
        setErrmsg([]);
        for (const el of event.target) {
            if (el.getAttribute("type") === "checkbox" && el.checked) {
                const data = {
                    access_token: el.getAttribute("value")
                }
                promises.push(getJsonData("/api/v1/customer/item", data));
                used.push(data.access_token);
                // .then((json) => {
                //     // newmsg.push(<div>{el.getAttribute("value")}:  {json.status} {json.status === "failure" ? ": " + json.message : ""}<br /></div>);
                //     errmsg.push(<div>HI</div>);
                //     console.log(errmsg);
                //     setErrmsg(errmsg);
                //     if (json.message === "user doesn't exist" || json.message === "not logged in") {
                //         localStorage.setItem("token", "");
                //         ctx.setActive1("0");
                //     }
                // }).catch((err) => {
                // });
            }
        }
        const res = await Promise.all(promises).catch((err) => {
            console.log("?");
        });
        if (!Array.isArray(res)) {
            setErrmsg("bad");
            return;
        }
        for (let i = 0; i < res.length; i++) {
            const json = await res[i].json();
            newmsg.push(<div>{used[i]}: {json.status} {json.status === "fail" ? "- " + json.message : ""}<br /></div>);
            if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                localStorage.setItem("token", "");
                ctx.setActive1("0");
            }
        }
        setErrmsg(newmsg);
    }
    function handleSubmit(event) {
        event.preventDefault();
        const fd = new FormData(event.target);
        const data = Object.fromEntries(fd.entries());
        const postdata = {
            access_token: data.token
        }
        // console.log("data=", data, "post=", postdata);
        // const filename = buildIpAddress(3000, "/api/v1/customer/item");
        //const filename = "http://127.0.0.1:3000/api/v1/customer"


        getJsonData("/api/v1/customer/item", postdata)
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        console.log("got json: ", json);
                        setErrmsg(<div>{json.status === "success" ? json.status : json.status + ": " + json.message}</div>);
                        if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    }).catch((err) => {
                        // console.log("??????" + err);
                    });
            }).catch((err) => {
                // console.log("ERROR(signup)", err);
            })
    }
    function handleCheck(el) {
        const value = el.target.getAttribute("value");
        if (el.target.checked === false) {
            selected.delete(value);
        } else {
            selected.add(value);
        }
        setSelected(selected)
    }
   
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2 className="blueHeader">Plaid Testing Bank Accounts</h2>
                <p className="leftAlignedText">
                    This MoneyWatcher demo server has created several testing bank accounts in the Plaid sandbox environment.
                    The testing bank accounts have simulated transactions. Please select one or more from the following accounts
                    to be used for demo.
                </p>
                {/* <div>
                    <label htmlFor="token">Access token: </label>
                    <input id="token" type="token" name="token" required size="50" />
                </div>
                <p className="form-actions">
                    <button type="reset" className="button button-flat">
                        Reset
                    </button>
                    <button type="submit" className="button">
                        Add (manually input a token above)
                    </button>
                </p> */}
            </form>
            <form onSubmit={listSubmit}>
                <ul className="tokens">
                    {tokens.map((token, index) => {
                        return <li key={index}>
                            <input type="checkbox" id={`token${index}`} value={token.token} onClick={handleCheck} />
                            <label className="labelTextBankAccount" htmlFor={`token${index}`}>{token.bank}: XXXX{token.token.slice(-5)}</label>
                        </li>
                    })}
                </ul>
                <div className="button-container">
                <button type="reset" className="centered-button"> Reset</button>
                <button type="submit" className="centered-button">Add Selected</button>
                </div>
            </form>
            {errmsg}
        </div>
    )
}

export default AddItem;