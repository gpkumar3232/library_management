import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import GenreService from "../../services/genreServices.js";
import CommonList from "../../shared/commonList.js";
import Loader from "../../shared/loader.js";

import './settings.css'

function Settings() {

    const list = [
        { column: 'title', type: 'Text', suffixText: 'title' },
        { icon: ['fa-pencil-alt', "fa-solid fa-trash"], color: ['#4b4a4a', '#de3a3b'], name: ['edit', 'delete'], type: 'action', suffixText: 'Action' }
    ]

    const [data, setData] = useState([])

    const [load, setLoad] = useState(true)

    const [selectedVal, setSelectedVal] = useState({ title: '', isAdd: true, id: '' })

    const [isPopover, setIsPopover] = useState(false)

    useEffect(() => {
        setLoad(true)
        getAllGenre();
    }, [])

    const onClick = (icon, value) => {
        if (icon === 'edit') {
            setSelectedVal({ title: value?.title, isAdd: false, id: value["_id"] })
            setIsPopover(true);
        } else
            onRemoveGenre(value?.title)
    }

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

    const onRemoveGenre = (val) => {
        GenreService.deleteGenre({ title: val }).then(res => {
            if (res) {
                toast.success(res?.data?.message);
                setLoad(true)
                getAllGenre();
            }
        }).catch(err => {
            toast.error(err.data.error)
        })
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
                    <CommonList list={list} data={data} onClick={onClick} />
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