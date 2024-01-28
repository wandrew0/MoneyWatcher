import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { useNavigate } from 'react-router-dom'
import Categories from "../resources/Categories.js"

const Merchant = ({ active }) => {
    const navigate = useNavigate();
    const [trans, setTrans] = React.useState({});
    const ctx = React.useContext(MainContext)
    React.useEffect(() => {
        refresh();
    }, []);
    function refresh() {
        getJsonData("/api/v1/merchant", {})
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        // console.log("got merchant json: ", json);
                        // console.log(json.data)
                        if (json.status === "success") {
                            setTrans(json.data);
                        } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    })
            }).catch((err) => {
                console.log("ERROR(merchant)", err);
            })
    }
    const drawHeader = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Primary</th>
                <th>Detailed</th>
            </tr>
        )
    }
    const DrawDropdown = () => {
        return <div>
            <label for="select_category">New Category: </label>
            <select id="select_category">
                {Object.entries(Categories).map(([k, v]) => {
                    return <optgroup label={k}>
                        {v.map((cat) => {
                            return <option data-primary={cat[0]} data-detailed={cat[1]} value={cat[1]}>{cat[1].split(cat[0] + "_")[1]}</option>
                        })}
                    </optgroup>
                })}
            </select>
        </div>
    }
    function modify_merchant(event) {
        event.preventDefault();
        const dropdown = event.target.select_category;
        const selected = dropdown[dropdown.selectedIndex];
        // console.log(selected.dataset.primary);
        // console.log(selected.dataset.detailed);
        getJsonData("/api/v1/merchant/update", {
            merchant: event.target.name.value,
            primary: selected.dataset.primary,
            detailed: selected.dataset.detailed
        }).then((r) => {
            refresh();
        }).catch((err) => {
            console.log(err);
            //
        })
    }
    const DrawTable = (({ tr }) => {
        const loading = !Array.isArray(tr);
        return (
            <div>
                <h1>Merchant Page</h1>
                <form onSubmit={modify_merchant}>
                    <div>
                        <label htmlFor="name">merchant name</label>
                        <input id="name" name="name" />
                    </div>
                    <DrawDropdown />
                    <button>Modify</button>
                </form>
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