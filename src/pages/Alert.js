import {
    jsonFetch,
    buildIpAddress,
    getJsonData
} from "../components/common";
import React from "react";
import MainContext from "./MainContext";
import { Link, useNavigate } from "react-router-dom";
import NotLoggedInError from "./NotLoggedInError";

const Alert = ({ active }) => {
    const [alerts, setAlerts] = React.useState([]);
    const ctx = React.useContext(MainContext);
    React.useEffect(() => {
        refresh();
    }, []);
    function refresh() {
        getJsonData("/api/v1/alert/get", {})
            .then((d) => {
                d.json().then((json) => {
                    if (json.status === "success") {
                        setAlerts(json.data);
                    } else if (
                        json.message === "jwt malformed" ||
                        json.message === "user doesn't exist" ||
                        json.message === "not logged in"
                    ) {
                        localStorage.setItem("token", "");
                        ctx.setActive1("0");
                    }
                });
            })
            .catch((err) => {
                console.log("ERROR(categories)", err);
            });
    }

    const drawHeader = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Limit($)</th>
                <th>Days</th>
                <th>Date Triggered</th>
                <th>Actual Spending Amount($)</th>
            </tr>
        );
    };
    const DrawTable = ({ input }) => {
        if (input.length === 0 ) return (
            <p><strong>No Alerts.</strong></p>
        )
        return (
            <div>
                <table className="table-general">
                    <tbody>
                        {drawHeader()}
                        {input.map((t, index) => {
                            return (
                                <tr className={index%2 === 0 ? "table-tdEven" : "table-tdOdd"}>
                                    <td>{t.name}</td>
                                    <td>{t.category}</td>
                                    <td>{t.limit}</td>
                                    <td>{t.days}</td>
                                    <td>{t.trigger_date}</td>
                                    <td>{t.total}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };
    //<DrawTable t={trans}/>
    if (ctx.active === "0") return <NotLoggedInError />
    return (
        <div>
            <h2 className="blueHeader">Alerts</h2>
            <DrawTable input={alerts} />
        </div>
    );
};

export default Alert;
