import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import './commonDialogBox.css'
//functional component to render DialogBox
function CommonDialogBox(props) {
    return (
        <Dialog open={props?.visible} onClose={() => { props.setVisible(false) }}>
            <DialogTitle className="dialogBoxTitle">{props?.title}</DialogTitle>
            <DialogContent>
                <div className="contentContainer">
                    <p>{props?.content}</p>
                </div>
            </DialogContent>
            <DialogActions>
                <div className="action">
                    {props?.button?.map((item, key) => (
                        <button className={key ? "submit" : "cancel"} onClick={() => { props?.onClick(item) }}>{item}</button>
                    ))}
                </div>
            </DialogActions>
        </Dialog>)
}
export default CommonDialogBox;