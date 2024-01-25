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
    // React.useEffect(() => {
    //     getJsonData("/api/v1/transaction", {
    //         start_date: "2023-01-01",
    //         end_date: "2025-01-01",
    //         count: 200
    //     }).then((d) => {
    //         d.json()
    //             .then((json) => {
    //                 if (json.status === "success") {
    //                     setTrans(json.data.transactions);
    //                 } else if (json.message === "user doesn't exist" || json.message === "not logged in") {
    //                     localStorage.token = "";
    //                     ctx.setActive1("0");
    //                 }
    //             })
    //     }).catch((err) => {
    //         // console.log("ERROR(transaction)", err);
    //     })
    // }, []);
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
        getJsonData("/api/v1/transaction", {
            start_date: event.target.start.value,
            end_date: event.target.end.value,
            count: 50
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