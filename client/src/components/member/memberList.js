import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../shared/loader.js";
import CommonList from "../../shared/commonList.js";
import CommonSearchBar from "../../shared/commonSearchBar.js";
import MemberService from "../../services/memberService.js";

import './memberList.css'

function MemberList() {

    const list = [
        { column: 'name', type: 'Text', suffixText: 'Name' },
        { column: 'id', type: 'Text', suffixText: 'Id' },
        { column: 'email', type: 'Text', suffixText: 'email' },
        { column: 'phone', type: 'Text', suffixText: 'phone' },
        { column: 'role', type: 'Text', suffixText: 'Role' },
        {
            icon: ['fa-pencil-alt', "fa-solid fa-trash"], color: ['#4b4a4a', '#de3a3b'], name: ['edit', 'delete'], type: 'action', suffixText: 'Action'
        }
    ]
    const navigate = useNavigate()

    const [data, setData] = useState([])

    const [load, setLoad] = useState(true)

    const [search, setSearch] = useState(null)

    useEffect(() => {
        setLoad(true)
        getAllMember();
    }, [])

    // UseEffect used to search 
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search !== null && ((search === '') || !(search?.trim() === ''))) {
                setLoad(true)
                getAllMember()
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])


    const onClick = (icon, value) => {
        if (icon === 'edit')
            navigate('/memberDetails', { state: value })
        else {
            onRemoveMember(value.id)
        }
    }

    const getAllMember = () => {
        MemberService.getAllMember({ searchText: search }).then(res => {
            if (res) {
                setData(res?.data?.rows);
                setTimeout(() => {
                    setLoad(false)
                }, 500)
            }
        }).catch(err => {
            console.log('Error', err)
        })
    }

    const onRemoveMember = (val) => {
        MemberService.deleteMember({ id: val }).then(res => {
            if (res) {
                toast.success(res?.data?.message);
                setLoad(true)
                getAllMember();
            }
        }).catch(err => {
            toast.error(err.data.error)
        })
    }

    return (
        <main>
            <h2>Member</h2>
            {load ?
                <Loader />
                :
                <div>
                    <div className="subheader">
                        <div className="search-container">
                            <CommonSearchBar search={search} setSearch={setSearch} placeholder={'Search by Name, Id, Email'} />
                        </div>
                        <div className="addContainer">
                            <button onClick={() => { navigate('/memberDetails') }} className="addBook" type="button" name="add">Add Member</button>
                        </div>
                    </div>
                    <CommonList list={list} data={data} onClick={onClick} />
                </div>
            }
        </main>
    )
}
export default MemberList;