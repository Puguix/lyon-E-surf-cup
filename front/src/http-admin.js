// the baseURL, it depends on REST APIs url that the Server configures

import axios from "axios";
export default axios.create({
    baseURL: "/admin",
    headers: {
        "Content-type": "application/json",
    },
});
