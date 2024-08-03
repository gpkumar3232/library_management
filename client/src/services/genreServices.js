import HttpRoutingService from "./httpRoutingService";

class genreService {

    getAllGenre(data) {
        return HttpRoutingService.getMethod('api/genre/list', data);
    }

    createGenre(data) {
        return HttpRoutingService.postMethod('api/genre/create', data);
    }

    updateGenre(data) {
        return HttpRoutingService.putMethod('api/genre/update', data)

    }

    deleteGenre(id) {
        return HttpRoutingService.deleteMethod('api/genre/delete', id);
    }

}

const GenreService = new genreService();

export default GenreService;