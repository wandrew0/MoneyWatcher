import React from "react";
import { getJsonData, buildIpAddress } from "../components/common";
import MainContext from "./MainContext"
import "../css/styles.css"
import NotLoggedInError from "./NotLoggedInError";
import ErrorBox from "./ErrorBox";

const AddItem = () => {
    const [errmsg, setErrmsg] = React.useState([]);
    const ctx = React.useContext(MainContext);
    const [selected, setSelected] = React.useState(new Set());
    const [tokens, setTokens] = React.useState([]);
    const [existingTokens, setExistingTokens] = React.useState([]);
    const [fetch, setFetch] = React.useState(false);

    const ulStyle = {
        listStyleType: 'none',
    }

    if (ctx.active === "0") {
        return (
            <NotLoggedInError/>
        )
    }
    React.useEffect(() => {
        getJsonData("/api/v1/customer/bank", {}).then((d) => {
            d.json().then((json) => {
                if (json.status == "success") {
                    //console.log("existing items:" + json.data);
                    setExistingTokens(json.data);
                }
            })
        })
        setTokens([{
            bank: "loading from Plaid sandbox...",
            token: "loading"
        }]);
        getJsonData("/api/v1/item/get_all", {}).then((d) => {
            d.json().then((json) => {
                if (json.status === "success") {
                    //console.log("tokens:" + json.data);
                    setTokens(json.data)
                }
            });
        });
        //console.log("tokens" + tokens);
    }, [fetch]);

    function handleErrorClose() {
        setErrmsg(''); // Clear the error message, hiding the error box
    };

    async function listSubmit(event) {
        console.log("listSubmit called");
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
            }
        }
        const res = await Promise.all(promises).catch((err) => {
            console.log(err);
        });
        if (!Array.isArray(res)) {
            setErrmsg("bad");
            return;
        }
        for (let i = 0; i < res.length; i++) {
            const json = await res[i].json();
            if (json.status === "fail") {
                newmsg.push(<div>{used[i]}: {json.status} {json.status === "fail" ? "- " + json.message : ""}<br/>
                </div>);
            }
            if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                localStorage.setItem("token", "");
                ctx.setActive1("0");
            }
        }
        if (newmsg.length > 0) {
            setErrmsg(newmsg);
        }
        setFetch((prevState) => !prevState);
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

    const renderCheckBox = (token, index) => {
        if (!existingTokens.includes(token.token)) {
            return (<li key={index}>
                <input type="checkbox" id={`token${index}`} value={token.token} onChange={handleCheck}
                />
                <label className="labelTextBankAccount" htmlFor={`token${index}`}>
                    {token.bank} {token.token === "loading" ? "" : " : " + token.token.slice(-5)}</label>
            </li>)
        } else {
            return (<li key={index}>
                <input type="checkbox" id={`token${index}`} value={token.token} onChange={handleCheck} checked={true}
                       disabled={true}
                />
                <label className="labelTextBankAccount" htmlFor={`token${index}`}>
                    {token.bank} {token.token === "loading" ? "" : " : " + token.token.slice(-5)}</label>
            </li>)
        }
    }

return (
    <div>

            <h2 className="blueHeader">Plaid Testing Bank Accounts</h2>
            <p className="leftAlignedText">
                This MoneyWatcher demo server has created several testing bank accounts in the Plaid sandbox environment.
                The testing bank accounts have simulated transactions.
                Bank accounts already associated with the user are listed with a &#x2705; .
                Please select one or more of the following accounts to be used for the demo.
                </p>


            <form onSubmit={listSubmit}>
                {
                    /*
                    bug:  https://github.com/orgs/react-hook-form/discussions/8049
                    only the last disabled/checked checkbox can work.
                     */
                }
                <ul style={ulStyle}>
                    {tokens.map((token, index) => {
                        return renderCheckBox(token, index);
                    })}
                </ul>
                <div className="button-container">
                <button type="submit" className="centered-button">Add Selected</button>
                </div>
            </form>
        {errmsg.length > 0 && (<ErrorBox errorMessage={errmsg} onClose={handleErrorClose} />)}
        </div>
    )
}

export default AddItem;