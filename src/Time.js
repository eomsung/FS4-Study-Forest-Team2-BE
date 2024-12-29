import react, { useState, useEffect } from "react";
import './Time.css';

function Time() {
    const [timer, setTimer] = useState("00:00:00");

    const currentTimer = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const date = String(today.getDate()).padStart(2, "0");
        const hours = String(today.getHours()).padStart(2, "0");
        const minutes = String(today.getMinutes()).padStart(2, "0");
        const seconds = String(today.getSeconds()).padStart(2, "0");

        setTimer(`${year}-${month}-${date} 오후${hours}:${minutes}:${seconds}`);
    };

    useEffect(() => {
        const interval = setInterval(currentTimer, 1000);
        return() => clearInterval(interval);
    }, []);

    return <div className="time">{timer}</div>;
}

export default Time;