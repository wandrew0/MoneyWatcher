import React from "react";
import { getJsonData, buildIpAddress } from "../components/common";
import { Link } from 'react-router-dom'
import MainContext from "./MainContext"
import "./AddItem.css"

const tokens = ["access-sandbox-9291a618-3d1a-44de-a524-18036d897b92",
    "access-sandbox-a71517d6-51ff-4dbd-8a27-9f2b1a53d5b2",
    "access-sandbox-7791cf79-ec31-49ec-95ba-62dc0c91efa4",
    "access-sandbox-297b2808-77f3-4930-96a5-c7daba96a85b",
    "access-sandbox-466d3104-7a21-425c-aef8-7abb44afc244",
    "access-sandbox-332128cf-575e-4073-a908-0a625203333b",
    "access-sandbox-cb253371-dbcb-4a15-aefc-a38e3e2bf349",
    "access-sandbox-eaebe5a3-bd9a-4c7f-88ef-2f9278372815",
    "access-sandbox-62542a4c-0e59-4eca-9fdf-c47074b77575",
    "access-sandbox-2414d68b-b5d4-4d49-965a-c5f75bf5607a",
    "access-sandbox-750ce342-4371-48fb-ab64-06dac54295e3",
    "access-sandbox-7807e2a5-3925-4bb6-a546-f47a79856866",
    "access-sandbox-13e10e89-3062-4707-8bfe-6ebbcb0c2a26",
    "access-sandbox-8308b59b-8c01-45d4-90d8-5517a8107f0b",
    "access-sandbox-ac1c3478-c28c-4012-926f-a7e3b162409c"]

const AddItem = () => {
    const [errmsg, setErrmsg] = React.useState([]);
    const ctx = React.useContext(MainContext);
    const [selected, setSelected] = React.useState(new Set());
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
            if (json.message === "user doesn't exist" || json.message === "not logged in") {
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
                        // console.log("got json: ", json);
                        setErrmsg(<div>{json.status === "success" ? json.status : json.status + ": " + json.message}</div>);
                        if (json.message === "user doesn't exist" || json.message === "not logged in") {
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
    if (ctx.active === "0") {
        return <p>Please Login !!!</p>;
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Plaid Access Token</h2>
                <div>
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
                </p>
            </form>
            <form onSubmit={listSubmit}>
                <ul className="tokens">
                    {tokens.map((token, index) => {
                        return <li key={index}>
                            <input type="checkbox" id={`token${index}`} value={token} onClick={handleCheck} />
                            <label htmlFor={`token${index}`}>{"    " + token}</label>
                        </li>
                    })}
                </ul>
                <button type="reset" className="button button-flat"> Reset</button>
                <button type="submit" className="button">Add Selected</button>
            </form>
            {errmsg}
        </div>
    )
}

export default AddItem;