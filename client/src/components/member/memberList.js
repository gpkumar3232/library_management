import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../shared/loader.js";
import CommonList from "../../shared/commonList.js";
import CommonSearchBar from "../../shared/commonSearchBar.js";
import CommonDialogBox from "../../shared/commonDialogBox.js";

import MemberService from "../../services/memberService.js";

import './memberList.css'
//functional component to render List of Members
function MemberList() {
    // variable to store navigation from useNavigate hook
    const navigate = useNavigate()
    //variable to store the member list
    const [data, setData] = useState([])
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable to store the values of search text
    const [search, setSearch] = useState(null)
    //variable to store the selected member details for actions
    const [selectedVal, setSelectedVal] = useState()
    //variable to maintain the visibility of the confirmation dialog
    const [isVisible, setIsVisible] = useState(false)
    //variable to store the structure of the list to display in the CommonList component
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
    // useEffect hook to Fetch all members initially and when search text changes
    useEffect(() => {
        setLoad(true)
        getAllMember();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // UseEffect used to Debounce search input to limit API calls frequency 
    useEffect(() => {
        const searchDebounceFunction = setTimeout(() => {
            if (search !== null && ((search === '') || !(search?.trim() === ''))) {
                setLoad(true)
                getAllMember()
            }
        }, 1000)
        return () => clearTimeout(searchDebounceFunction)
    }, [search])
    // Function which is used to fetch all members from the API
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
    // Function which is used to remove a member by ID
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
    // Function which is used to handle icon clicks in the CommonList component
    const onValueChange = (icon, value) => {
        if (icon === 'edit')
            navigate('/memberDetails', { state: value })
        else {
            setIsVisible(true)
            setSelectedVal(value)
        }
    }
    // Function to handle confirmation dialog responses
    const confirmation = (value) => {
        if (value === "Yes")
            onRemoveMember(selectedVal.id)
        setIsVisible(false)
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
                    <CommonList list={list} data={data} onClick={onValueChange} />
                    <CommonDialogBox
                        visible={isVisible}
                        setVisible={setIsVisible}
                        title={'Confirmation'}
                        content={'Are you sure you want to remove this Member?'}
                        button={['No', 'Yes']}
                        onClick={confirmation}
                    />
                </div>
            }
        </main>
    )
}
export default MemberList;