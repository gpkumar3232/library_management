import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import Loader from "../../shared/loader.js";
import CommonList from "../../shared/commonList.js";
import CommonDialogBox from "../../shared/commonDialogBox.js";

import GenreService from "../../services/genreServices.js";
import BookService from "../../services/bookServices.js";

import './settings.css'
//functional component to render Settings
function Settings() {
    // variable used to Define columns and actions for the CommonList component
    const list = [
        { column: 'title', type: 'Text', suffixText: 'title' },
        { icon: ['fa-pencil-alt', "fa-solid fa-trash"], color: ['#4b4a4a', '#de3a3b'], name: ['edit', 'delete'], type: 'action', suffixText: 'Action' }
    ]
    // variable to store List of genres
    const [data, setData] = useState([])
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable to store the selected genre details
    const [selectedVal, setSelectedVal] = useState({ title: '', isAdd: true, id: '' })
    //variable to maintain the visibility of the confirmation dialog
    const [isVisible, setIsVisible] = useState(false)
    //variable to store the dialog visibility
    const [isPopover, setIsPopover] = useState(false)
    // useEffect hook to Fetch all genres on component mount
    useEffect(() => {
        setLoad(true)
        getAllGenre();
    }, [])
    //Function which is used to Handle button clicks for edit and delete actions
    const onValueChange = (icon, value) => {
        setSelectedVal({ title: value?.title, isAdd: false, id: value["_id"] })
        if (icon === 'edit') {
            setIsPopover(true);
        } else {
            setIsVisible(true)
            // setSelectedVal({ title: value?.title, isAdd: false, id: value["_id"] })
        }
    }
    //Function which is used to Fetch all genres from the server
    const getAllGenre = () => {
        GenreService.getAllGenre().then(res => {
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
    //Function which is used to Handle genre updates
    const onUpdate = () => {
        if (selectedVal.isAdd)
            GenreService.createGenre({ title: selectedVal?.title }).then(res => {
                if (res) {
                    toast.success(res?.data?.message);
                    setLoad(true)
                    getAllGenre();

                }
            }).catch(err => {
                toast.error(err.data.error)
            })
        else
            GenreService.updateGenre({ title: selectedVal?.title, id: selectedVal?.id }).then(res => {
                if (res) {
                    toast.success(res?.data?.message);
                    setLoad(true)
                    getAllGenre();

                }
            }).catch(err => {
                toast.error(err.data.error)
            })
    }
    //Function which is used to Handle genre removal
    const onRemoveGenre = (val) => {
        BookService.getAllBook({ filterData: val }).then(res => {
            if (!res?.data?.rows?.length)
                GenreService.deleteGenre({ title: val }).then(res => {
                    if (res) {
                        toast.success(res?.data?.message);
                        setLoad(true)
                        getAllGenre();
                    }
                }).catch(err => {
                    toast.error(err.data.error)
                })
            else
                toast.error("Genre will be mapped " + res?.data?.rows?.length + " books")
        }).catch(err => {
            toast.error(err.data.error)
        })
    }
    // Function to handle confirmation dialog responses
    const confirmation = (value) => {
        if (value === "Yes")
            onRemoveGenre(selectedVal?.title)
        setIsVisible(false)
    }

    return (
        <main>
            <h2>Settings</h2>
            {load ?
                <Loader />
                :
                <div className="settingsCard">
                    <div className="subheader">
                        <div className="cardHeader">
                            <h3 className="genreTitle">Genre</h3>
                        </div>
                        <div className="addContainer">
                            <button onClick={() => { setIsPopover(true); setSelectedVal({ title: '', isAdd: true }) }} className="addGenre" type="button" name="add">Add Genre</button>
                        </div>
                    </div>
                    <CommonList list={list} data={data} onClick={onValueChange} />
                    <CommonDialogBox
                        visible={isVisible}
                        setVisible={setIsVisible}
                        title={'Confirmation'}
                        content={'Are you sure you want to remove this Genre?'}
                        button={['No', 'Yes']}
                        onClick={confirmation}
                    />
                </div>
            }
            <Dialog open={isPopover} onClose={() => { setIsPopover(false) }}>
                <DialogTitle className="dialogTitle">{(selectedVal?.isAdd ? 'Add' : 'Edit') + 'Genre'}</DialogTitle>
                <DialogContent style={{ padding: 5 }}>
                    <div className="reason">
                        <input type={"text"}
                            placeholder="title"
                            id="title" name="title"
                            value={selectedVal.title}
                            onChange={(e) => { setSelectedVal({ ...selectedVal, title: e.target.value }) }} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <button className="cancel" onClick={() => { setIsPopover(false) }}>Cancel</button>
                    <button className="submit" disabled={selectedVal?.title ? false : true} onClick={() => { onUpdate(); setIsPopover(false) }} type="submit">submit</button>
                </DialogActions>

            </Dialog>

        </main>
    )
}
export default Settings;