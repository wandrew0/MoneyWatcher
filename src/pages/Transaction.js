import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { useNavigate } from 'react-router-dom'

const Transaction = () => {
    const navigate = useNavigate();
    const [trans, setTrans] = React.useState([]);
    const ctx = React.useContext(MainContext)
    React.useEffect(() => {
        // console.log(localStorage.token);
        getJsonData("/api/v1/transaction", {
            start_date: "2023-01-01",
            end_date: "2025-01-01",
            count: 200
        }).then((d) => {
            // console.log("d=", d);
            d.json()
                .then((json) => {
                    // console.log("got transaction json: ", json);
                    if (json.status === "success") {
                        setTrans(json.data.transactions);
                    } else if (json.message === "user doesn't exist" || json.message === "not logged in") {
                        localStorage.token = "";
                        ctx.setActive1("0");
                    }
                })
        }).catch((err) => {
            // console.log("ERROR(transaction)", err);
        })
    }, []);
    const drawHeader = () => {
        return (
            <tr>
                <th>Store</th>
                <th>Date</th>
                <th>Amount($)</th>
                <th>Description</th>
            </tr>
        )
    }
    function add_transaction() {
        navigate("/add_transaction");
    }
    const DrawTable = (({ tr }) => {
        // console.log("drawing trying", tr);
        if (!Array.isArray(tr)) return (<></>)
        // console.log("drawing start");
        return (
            <div>
                <h1>Transaction Page</h1>
                <button onClick={add_transaction}>Add</button>
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
                                        {t.amount.$numberDecimal}
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