import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { useNavigate } from 'react-router-dom'

const Rule = () => {
    const navigate = useNavigate();
    const [rules, setRules] = React.useState([]);
    const ctx = React.useContext(MainContext)
    function refresh() {
        getJsonData("/api/v1/rule", {})
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        console.log("got rule json: ", json);
                        setRules(json.data)
                    })
            }).catch((err) => {
                // console.log("ERROR(rule)", err);
            })
    }
    React.useEffect(() => {
        refresh();
    }, []);
    const drawHeader = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Days</th>
                <th>Limit($)</th>
                <th>Category</th>
                <th>email</th>
                <th>Last Triggered</th>
                <th>Actions</th>
            </tr>
        )
    }
    function addRule(event) {
        event.preventDefault();
        getJsonData("/api/v1/rule/create", {
            name: event.target.name.value,
            limit: event.target.limit.value,
            days: event.target.days.value,
            category: event.target.category.value,
            email: event.target.category.value
        }).then((r) => {
            r.json()
                .then((json) => {
                    refresh();
                })
        }).catch((err) => {
            // console.log(err);
        })
    }
    const deleteRule = (event) => {
        console.log(event.target.parentNode.parentNode.dataset.name);
        getJsonData("/api/v1/rule/delete", {
            name: event.target.parentNode.parentNode.dataset.name
        }).then((r) => {
            // console.log(r);
            refresh();
        }).catch((err) => {
            // console.log(err);
        })
    }
    const DrawTable = (({ rules }) => {
        // console.log("drawing trying", tr);
        if (!Array.isArray(rules)) return (<></>)
        // console.log("drawing start");
        return (
            <table border={1}>
                {drawHeader()}
                {rules.map((r) => {
                    return <tr data-name={r.name}>
                        <td>{r.name}</td>
                        <td>{r.days}</td>
                        <td>{r.limit}</td>
                        <td>{r.category}</td>
                        <td>{r.email}</td>
                        <td>{r.last_triggered}</td>
                        <td>
                            <button onClick={deleteRule}>delete</button>
                        </td>
                    </tr>
                })}
            </table>
        )
    })
    //<DrawTable t={trans}/>
    if (ctx.active === "0")
        return (
            <p>Please Login !!!</p>
        )
    return (
        <div>
            <p>Rule Page</p>
            <form onSubmit={addRule}>
                <div>
                    <label htmlFor="name">name (required)  </label>
                    <input id="name" name="name" />
                </div>
                <div>
                    <label htmlFor="limit">$ limit (required) </label>
                    <input id="limit" name="limit" />
                </div>
                <div>
                    <label htmlFor="days">days (required)  </label>
                    <input id="days" name="days" />
                </div>
                <div>
                    <label htmlFor="category">category (not implemented)  </label>
                    <input id="category" name="category" />
                </div>
                <div>
                    <label htmlFor="email">email  </label>
                    <input id="email" name="email" />
                </div>
                <button>Add Rule</button>
            </form>
            <DrawTable rules={rules} />
        </div>
    )
}

export default Rule