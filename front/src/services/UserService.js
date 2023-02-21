// to send and post request

import http from "../http-admin";

class UserService {
    login(data) {
        console.log("front ok pour login");
        return http.post("/login", data);
    }
    register(data) {
        console.log("front ok pour register");
        return http.post("/register", data);
    }
    isLogged() {
        console.log("front ok pour isLogged");
        return http.post("/isLogged");
    }
}
export default new UserService();
