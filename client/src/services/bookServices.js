import HttpRoutingService from "./httpRoutingService";

class bookService {

    saveBookDetails(data, id) {
        if (id)
            return HttpRoutingService.putMethod('api/book/update', data)
        else
            return HttpRoutingService.postMethod('api/book/add', data);
    }

    deleteBook(id) {
        return HttpRoutingService.deleteMethod('api/book/delete', id);
    }

    getAllBook(data) {
        return HttpRoutingService.getMethod('api/book/list', data);
    }

}
const BookService = new bookService();

export default BookService;