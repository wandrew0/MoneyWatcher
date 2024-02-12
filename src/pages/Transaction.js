import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { useNavigate } from 'react-router-dom'

const Transaction = () => {
    const navigate = useNavigate();
    const [trans, setTrans] = React.useState([]);
    const ctx = React.useContext(MainContext)
    const [end, setEnd] = React.useState(new Date().toISOString().split('T')[0]);
    const [start, setStart] = React.useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0])
    const [cats, setCats] = React.useState({});
    React.useEffect(() => {
        getJsonData("/api/v1/category/get", {})
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        // console.log(json);
                        // console.log("got merchant json: ", json);
                        // console.log(json.data)
                        if (json.status === "success") {
                            setCats(json.data);
                        } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    })
            }).catch((err) => {
                console.log("ERROR(categories)", err);
            })
    }, [])
    const drawDropdown = () => {
        if (Object.keys(cats).length === 0) {
            return;
        }
        return <div>
            <label for="select_category">New Category: </label>
            <select id="select_category">
                <option>ANY</option>
                {Object.entries(cats.plaid).map(([k, v]) => {
                    return <optgroup label={k}>
                        {v.map((cat) => {
                            // console.log(cat);
                            return <option data-primary={k} data-detailed={cat} value={cat}>{cat.split(k + "_")[1]}</option>
                        })}
                    </optgroup>
                })}
                <optgroup label="CUSTOM">
                    {cats.custom.map((cat) => {
                        return <option data-primary="CUSTOM" data-detailed={cat} value={cat}>{cat}</option>
                    })}
                </optgroup>
            </select>
        </div>
    }
    const drawHeader = () => {
        return (
            <tr>
                <th>Store</th>
                <th>Date</th>
                <th>Amount($)</th>
                <th>Category</th>
            </tr>
        )
    }
    function getTransactions(event) {
        event.preventDefault();
        setStart(event.target.start.value);
        setEnd(event.target.end.value);
        const dropdown = event.target.select_category;
        const selected = dropdown[dropdown.selectedIndex];
        getJsonData("/api/v1/transaction", {
            start_date: event.target.start.value,
            end_date: event.target.end.value,
            count: 50,
            category: selected.dataset.detailed
        }).then((d) => {
            d.json()
                .then((json) => {
                    if (json.status === "success") {
                        setTrans(json.data.transactions);
                    } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                        localStorage.token = "";
                        ctx.setActive1("0");
                    }
                })
        }).catch((err) => {
            // console.log("ERROR(transaction)", err);
        })
    }
    const DrawTable = (({ tr }) => {
        // console.log("drawing trying", tr);
        if (!Array.isArray(tr)) return (<></>)
        // console.log("drawing start");
        return (
            <div>
                <h1>Transaction Page</h1>
                <form onSubmit={getTransactions}>
                    <div>
                        <label htmlFor="end">end date (required, YYYY-MM-DD)  </label>
                        <input id="end" name="end" defaultValue={end} />
                    </div>
                    <div>
                        <label htmlFor="start">start date (required, YYYY-MM-DD)  </label>
                        <input id="start" name="start" defaultValue={start} />
                    </div>
                    {drawDropdown()}
                    <button>Get Transactions</button>
                </form>
                <table border={1}>
                    <tbody>
                        {drawHeader()}
                        {tr.map((t) => {
                            // console.log(t.name, t.category);
                            return (
                                <tr>
                                    <td>
                                        {t.name}
                                    </td>
                                    <td>
                                        {t.date}
                                    </td>
                                    <td>
                                        {t.amount}
                                    </td>
                                    <td>
                                        {t.category.detailed}
                                    </td>
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
            <DrawTable tr={trans} />
        </div>
    )
}

export default Transaction