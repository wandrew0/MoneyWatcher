import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { useNavigate } from 'react-router-dom'

const Rule = () => {
    const navigate = useNavigate();
    const [trans, setTrans] = React.useState([]);
    const ctx = React.useContext(MainContext)
    React.useEffect(() => {
        getJsonData("/api/v1/rule")
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        // console.log("got rule json: ", json);
                        //console.log(json.data.transactions)
                        //setTrans(json.data.transactions);
                    })
            }).catch((err) => {
                // console.log("ERROR(rule)", err);
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
    const DrawTable = (({ tr }) => {
        // console.log("drawing trying", tr);
        if (!Array.isArray(tr)) return (<></>)
        // console.log("drawing start");
        return (
            <table border={1}>
                {drawHeader()}
            </table>
        )
    })
    //<DrawTable t={trans}/>
    if (ctx.active === "0")
        return (
            <p>Please Login !!!</p>
        )
    function add_rule() {
        navigate("/add_rule");
    }
    return (
        <div>
            <p>Rule Page</p>
            <button onClick={add_rule}>Add Rule</button>
            <DrawTable tr={trans} />
        </div>
    )
}

export default Rule