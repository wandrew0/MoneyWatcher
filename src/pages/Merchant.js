import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { useNavigate } from 'react-router-dom'

const Merchant = ({ active }) => {
    const navigate = useNavigate();
    const [trans, setTrans] = React.useState({});
    const ctx = React.useContext(MainContext)
    React.useEffect(() => {
        getJsonData("/api/v1/merchant", {})
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        // console.log("got merchant json: ", json);
                        // console.log(json.data)
                        if (json.status === "success") {
                            setTrans(json.data);
                        } else if (json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    })
            }).catch((err) => {
                console.log("ERROR(merchant)", err);
            })
    }, []);
    const drawHeader = () => {
        return (
            <tr>
                <th>Store</th>
                <th>Type</th>
                <th>Description</th>
            </tr>
        )
    }
    const DrawTable = (({ tr }) => {
        function add_merchant() {
            navigate("/add_merchant");
        }
        const loading = !Array.isArray(tr);
        return (
            <div>
                <h1>Merchant Page</h1>
                <button onClick={add_merchant}>Add</button>
                <table border={1}>
                    <tbody>
                        {drawHeader()}
                        {loading ? "loading" :
                            tr.map((t) => {
                                return (
                                    <tr>
                                        <td>{t.name}</td>
                                        <td>{t.primary}</td>
                                        <td>{t.detailed}</td>
                                    </tr>
                                )
                            })
                        }
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

export default Merchant