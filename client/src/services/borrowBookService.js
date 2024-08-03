import HttpRoutingService from "./httpRoutingService";

class borrowBookService {

    getAllBorrow(data) {
        return HttpRoutingService.getMethod('api/borrowBook/list', data);
    }

    createRequest(data) {
        return HttpRoutingService.postMethod('api/borrowBook/create', data);
    }

    updateStatus(data) {
        return HttpRoutingService.putMethod('api/borrowBook/update', data)

    }

    deleteStatus(id) {
        return HttpRoutingService.deleteMethod('api/borrowBook/delete', id);
    }

}

const BorrowBookService = new borrowBookService();

export default BorrowBookService;