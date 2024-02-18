import { jsonFetch, buildIpAddress, getJsonData } from "../components/common";
import React from "react";
import MainContext from "./MainContext"
import { Link, useNavigate } from 'react-router-dom'
import Categories from "../resources/Categories.js"
import '../css/styles.css'


const Merchant = ({ active }) => {
    const navigate = useNavigate();
    const [trans, setTrans] = React.useState([]);
    const [cats, setCats] = React.useState({});
    const [selected, setSelected] = React.useState("");
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

        getJsonData("/api/v1/category/get_custom", {})
            .then((d) => {
                // console.log("d=", d);
                d.json()
                    .then((json) => {
                        // console.log(json);
                        // console.log("got merchant json: ", json);
                        // console.log(json.data)
                        if (json.status === "success") {
                            const cats = {};
                            cats.custom = json.data.custom;
                            cats.plaid = {};
                            for (const pr in Categories) {
                                // console.log(Categories[pr]);
                                cats.plaid[pr] = Categories[pr].map((l) => l[1]);
                            }
                            setCats(cats);
                        } else if (json.message === "jwt malformed" || json.message === "user doesn't exist" || json.message === "not logged in") {
                            localStorage.setItem("token", "");
                            ctx.setActive1("0");
                        }
                    })
            }).catch((err) => {
                console.log("ERROR(categories)", err);
            })
    }
    const drawHeader = () => {
        return (
            <tr>
                <th>Name</th>
                <th>Primary</th>
                <th>Detailed</th>
                <th>Select for updating</th>
            </tr>
        )
    }
    const drawDropdown = () => {
        if (Object.keys(cats).length === 0) {
            return;
        }
        return <div>
            <label for="select_category">New Category: </label>
            <select id="select_category">
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
    function change(event) {
        event.preventDefault();
        setSelected(event.target.value);
    }
    const DrawTable = (({ tr }) => {
        const loading = !Array.isArray(tr);
        return (
            <div>

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
                                        <td>
                                            <button onClick={() => {
                                                setSelected(t.name);
                                            }}>Select</button>
                                        </td>
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
            <h1 className="blueHeader">Merchant Page</h1>
            <p className="leftAlignedText"> 
            A merchant is associated with both a type and a category. 
            A category represents a broad classification that groups merchants based on common attributes (e.g., "Food").
            Conversely, a type denotes a more specific classification within a category, grouping entities based 
            on more narrowly defined characteristics (e.g., "Food_Restaurant").
            <br />
            Typically, a merchant's category and type are determined by banks. 
            However, especially for small merchants, banks may not always have the correct information 
            and thus might classify some merchants based on their best 'guess'. 
            To enable users to better track their spending, MoneyWatcher allows users to define a new type 
            within the 'Custom' category. 
            Additionally, it permits users to modify a merchant's type using either predefined types or custom types.
            <br />
             <Link to="/add_category" className="blueText">You can add a new custom type.</Link>
            </p>
            
            <br />
            <br />
            <form onSubmit={modify_merchant}>
                <div>
                    <label htmlFor="name">merchant name</label>
                    <input id="name" name="name" value={selected} onChange={change} />
                </div>
                {drawDropdown()}
                <button>Modify</button>
            </form>
            <DrawTable tr={trans} />
        </div>
    )
}

export default Merchant