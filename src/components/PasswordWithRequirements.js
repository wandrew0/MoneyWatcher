import React, {useState} from 'react';
const PasswordWithRequirements = () => {
    const lengthReq = "at least 8 characters long";
    const capitalReq = "at least 1 upper-case letter";
    const lowerReq = "at least 1 lower-case letter";
    const numberReq = "at least 1 number";
    const [password, setPassword] = useState("");
    const [requirements, setRequirements] = useState([
        {checked: false, label: lengthReq},
        {checked: false, label: capitalReq},
        {checked: false, label: lowerReq},
        {checked: false, label: numberReq},
    ]);

    const handlePasswordChange = (event) => {
        let value = event.target.value;
        setPassword(event.target.value);
        setRequirements([
            {checked: value.length >= 8, label: lengthReq},
            {checked: /[A-Z]/.test(value), label: capitalReq},
            {checked: /[a-z]/.test(value), label: lowerReq},
            {checked: /\d/.test(value), label: numberReq}
        ]);
    }
    return (
        <div>
            <label className="labelText" htmlFor="password">Password</label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
            />
            {
                requirements.map((item) => (
                    <div className="indent4">
                        <input type="checkbox" checked={item.checked} disabled/><label>{item.label}</label>
                    </div>))
            }
        </div>
    )
}


export default PasswordWithRequirements;