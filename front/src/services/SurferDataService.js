// to send and post request

import http from "../http-common";

class SurferDataService {
    getAll() {
        return http.get("/admin");
    }
    get(id) {
        return http.get(`/admin/${id}`);
    }
    create(data) {
        return http.post("/create", data);
    }
    update(id, data) {
        return http.put(`/edit/${id}`, data);
    }
    delete(id) {
        return http.delete(`/admin/${id}`);
    }
    deleteAll() {
        return http.delete(`/admin`);
    }
    find(search) {
        return http.get(`/admin?search=${search}`);
    }
    findBis(search) {
        return http.get(`/home?search=${search}`);
    }
}
export default new SurferDataService();
