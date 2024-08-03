import axios from "axios";
import { config } from "../env";
import HttpRoutingService from "./httpRoutingService";

class authService {

    changePassword(data) {
        let url = 'api/auth/changePassword';
        return axios.put(config.apiUrldb + url, data);
    }

    login(data) {
        let url = 'api/auth/login'?.replace(/#/g, '%23');
        return axios.get(config.apiUrldb + url, {
            params: data,
        });
    }

    getUserDetails() {
        return HttpRoutingService.getMethod('api/auth/userDetails');

    }

}
const AuthService = new authService();

export default AuthService;