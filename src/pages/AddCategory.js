import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { Link, useNavigate } from 'react-router-dom'

const Merchant = ({ active }) => {
    const [cats, setCats] = React.useState([]);
    const [selected, setSelected] = React.useState("");
    const ctx = React.useContext(MainContext)
    React.useEffect(() => {
        refresh();
    }, []);
    function refresh() {
        getJsonData("/api/v1/category/get_custom", {})
            .then((d) => {
                d.json()
                    .then((json) => {
                        if (json.status === "success") {
                            setCats(json.data.custom);
                        } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    })
            }).catch((err) => {
                console.log("ERROR(categories)", err);
            })
    }
    function add_category(event) {
        event.preventDefault();
        if (event.target.name.value === "") {
            return;
        }
        console.log(event.target.name.value);
        getJsonData("/api/v1/category/create", {
            name: event.target.name.value
        }).then((d) => {
            d.json()
                .then((json) => {
                    if (json.status === "success") {
                    } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                        localStorage.setItem("token", "");
                        ctx.setActive1("0");
                    }
                    refresh();
                })
        }).catch((err) => {
            console.log("ERROR(categories)", err);
        })
    }
    const drawHeader = () => {
        return (
            <tr>
                <th>Name</th>
            </tr>
        )
    }
    function change(event) {
        event.preventDefault();
        setSelected(event.target.value);
    }
    const DrawTable = (({ input }) => {
        return (
            <div>
                <h4>existing custom categories</h4>
                <table border={1}>
                    <tbody>
                        {drawHeader()}
                        {input.map((t) => {
                            return (
                                <tr>
                                    <td>{t}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    })
    //<DrawTable t={trans}/>
    if (ctx.active === "0")
        return (
            <p>Please Login !!!</p>
        )
    return (
        <div>
            <h1>Custom Categories</h1>
            <form onSubmit={add_category}>
                <div>
                    <label htmlFor="name">category </label>
                    <input id="name" name="name" value={selected} onChange={change} />
                </div>
                <button>add</button>
            </form>
            <DrawTable input={cats} />
        </div>
    )
}

export default Merchant