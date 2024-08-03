import axios from "axios";
import { config } from "../env";

export const getToken = () => {
    return {
        Authorization: JSON.parse(localStorage.getItem('token'))
    }
}

class httpRoutingService {
    getMethod(url, queryParams) {
        url = url?.replace(/#/g, '%23');
        return axios.get(config.apiUrldb + url, {
            params: queryParams,
            headers: getToken(),
        });
    }

    postMethod(url, data) {
        return axios.post(config.apiUrldb + url, data, {
            headers: getToken(),
        });
    }

    putMethod(url, data) {
        return axios.put(config.apiUrldb + url, data, {
            headers: getToken(),
        });
    }

    deleteMethod(url, queryParams) {
        return axios.delete(config.apiUrldb + url, {
            params: queryParams,
            headers: getToken(),
        });
    }

}

const HttpRoutingService = new httpRoutingService();

export default HttpRoutingService;