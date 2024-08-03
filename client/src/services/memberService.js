import HttpRoutingService from "./httpRoutingService";

class memberService {

    saveMemberDetails(data, id) {
        if (id)
            return HttpRoutingService.putMethod('api/member/update', data)
        else
            return HttpRoutingService.postMethod('api/member/add', data);
    }

    deleteMember(id) {
        return HttpRoutingService.deleteMethod('api/member/delete', id);
    }

    getAllMember(data) {
        return HttpRoutingService.getMethod('api/member/list', data);
    }

}
const MemberService = new memberService();

export default MemberService;