import * as Yup from 'yup'
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import AuthService from "../../services/authServices";

import './changePassword.css'

//functional component to render Login 
const ChangePassword = () => {
    // Variable to store navigation from useNavigate hook
    const navigate = useNavigate();
    // Variable which is used to define validation schema using Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email Id is Required')
            .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/, 'Email Id is Invalid Format'),
        oldPassword: Yup.string()
            .required('Old Password is Required'),
        newPassword: Yup.string()
            .required('New Password is Required')
            .min(8, 'Password must contains atleast 8 characters'),
        confirmPassword: Yup.string()
            .required('Confirm Password is Required')
            .when("newPassword", (value, schema) => {
                if (value[0]) {
                    return schema.oneOf([Yup.ref("newPassword")], "Does not match New Password");
                } else {
                    return schema;
                }
            }),
    })
    // Variable which is used to initialize formik with initial values, validation schema, and submit handler
    const formik = useFormik({
        initialValues: {
            email: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: () => { setPassword() }
    })
    //Method to Call login service and change Password
    const setPassword = () => {
        const data = {
            email: formik.values.email,
            oldPassword: formik.values.oldPassword,
            newPassword: formik.values.confirmPassword,
        }
        AuthService.changePassword(data).then(res => {
            if (res) {
                toast.success(res.data.message)
                navigate('/')
            }
        }).catch(err => {
            if (err?.response?.data?.message)
                toast.error(err.response.data.message)
        })
    }

    return (
        <div className={'changepwdContainer'}>
            <div className="img-container">
                <img src={require('../../assets/changepassword.jpeg')} alt={require('../../assets/changepassword.jpeg')} className="loginImg" height={'100%'} width={'100%'} style={{ objectFit: 'cover' }} />
            </div>
            <div className="rootContainer">
                <div className="cardContainer">
                    <div className="headerTag">
                        <h2>Change Password</h2>
                    </div>
                    <div className="errorContainer">
                        <div className="inputContainer">
                            <PersonOutlineOutlinedIcon className="icon" />
                            <input
                                placeholder="Email"
                                type="email"
                                required
                                id='email'
                                name='email'
                                onBlur={formik.handleBlur('email')}
                                value={formik.values.email}
                                onChange={formik.handleChange('email')}
                                color="white"
                            />
                        </div>
                        {(formik.errors.email && formik.touched.email) && <span>{formik.errors.email}</span>}
                    </div>
                    <div className="errorContainer" style={(formik.errors.email && formik.touched.email) && { marginTop: -5 }}>
                        <div className="inputContainer">
                            <LockOutlinedIcon className="icon" />
                            <input
                                placeholder="Old Password"
                                type="text"
                                id="oldPassword"
                                name="oldPassword"
                                autoComplete='off'
                                value={formik.values.oldPassword}
                                onBlur={formik.handleBlur('oldPassword')}
                                onChange={formik.handleChange('oldPassword')}
                            />
                        </div>
                        {(formik.errors.oldPassword && formik.touched.oldPassword) && <span>{formik.errors.oldPassword}</span>}
                    </div>
                    <div className="errorContainer" style={(formik.errors.oldPassword && formik.touched.oldPassword) && { marginTop: -5 }}>
                        <div className="inputContainer">
                            <LockOutlinedIcon className="icon" />
                            <input
                                placeholder="New Password"
                                type="text"
                                id="newPassword"
                                name="newPassword"
                                autoComplete={"off"}
                                value={formik.values.newPassword}
                                onBlur={formik.handleBlur('newPassword')}
                                onChange={formik.handleChange('newPassword')}
                            />
                        </div>
                        {(formik.errors.newPassword && formik.touched.newPassword) && <span>{formik.errors.newPassword}</span>}
                    </div>
                    <div className="errorContainer" style={(formik.errors.newPassword && formik.touched.newPassword) && { marginTop: -5 }}>
                        <div className="inputContainer">
                            <LockOutlinedIcon className="icon" />
                            <input
                                placeholder="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onBlur={formik.handleBlur('confirmPassword')}
                                onChange={formik.handleChange('confirmPassword')}
                            />
                        </div>
                        {(formik.errors.confirmPassword && formik.touched.confirmPassword) && <span>{formik.errors.confirmPassword}</span>}
                    </div>
                    <div className="button-container" style={{ marginTop: '10px' }}>
                        <button
                            disabled={!formik.dirty && !formik.isValid} onClick={formik.handleSubmit} type="submit" name="submit">SUBMIT</button>
                    </div>
                    <div className="backto" >
                        <p onClick={() => { navigate('/') }}>Back to Login</p>
                    </div>
                </div>
            </div>

        </div>
    )

}
export default ChangePassword;