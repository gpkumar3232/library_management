import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import * as Yup from 'yup'
import { useFormik } from "formik";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import UserContext from "../../shared/userContext";
import AuthService from "../../services/authServices";

import './login.css'

function Login() {

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Email is Required'),
        password: Yup.string()
            .required('Password is Required')
            .min(8, 'Minimum 8 Characters Required'),
        // .min(8,'Minimum 8 Characters Required'),
        role: Yup.string()
            .required('Role is Required'),
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            role: 'Admin',
        },
        validationSchema: validationSchema,
        onSubmit: () => { onLogin() }
    })

    const navigate = useNavigate();

    const { setIsLogged, setUserDetails } = useContext(UserContext);


    const onLogin = () => {
        const data = {
            email: formik.values.username,
            password: formik.values.password,
            isAdmin: (formik.values.role === 'Admin') ? true : false,
        }
        AuthService.login(data).then(res => {
            if (res) {
                setIsLogged(true)
                toast.success('Login Successfully');
                localStorage.setItem('token', JSON.stringify(res?.data?.token))
                setUserDetails(res?.data?.details)
                navigate('/')
            }
        }).catch(err => {
            setIsLogged(false)
            toast.error("Invalid Login")
        })
    }

    return (
        <div className="mainContainer">
            <div className="img-container">
                <img src={require('../../assets/zit-2.jpeg')} alt={require('../../assets/zit-2.jpeg')} className="loginImg" height={'100%'} width={'100%'} style={{ objectFit: 'cover' }} />
            </div>
            <div className="signInContainer">
                <h2>Login</h2>
                <div className="quote">
                    <p>"Books are a uniquely portable magic."</p>
                    <p>– Stephen King</p>
                </div>
                <div className="role">
                    <div >
                        <input type="radio" id="option1" name="option1" value={'Admin'} checked={(formik.values.role === 'Admin')} onChange={(e) => { formik.setFieldValue('role', e.target.value) }} />
                        <label htmlFor="option1">Admin</label>
                    </div>
                    <div>
                        <input type="radio" id="option2" name="option2" value={'Member'} checked={formik.values.role === 'Member'} onChange={(e) => { formik.setFieldValue('role', e.target.value) }} />
                        <label htmlFor="option2">Member</label>
                    </div>
                </div>
                <div className="errorContainer">
                    <div className="inputContainer">
                        <PersonOutlineOutlinedIcon className="icon" />
                        <input
                            placeholder="Email"
                            type="email"
                            required
                            id='username'
                            name='username'
                            onBlur={formik.handleBlur('username')}
                            value={formik.values.username}
                            onChange={formik.handleChange('username')}
                            color="white"
                        />
                    </div>
                    {(formik.errors.username && formik.touched.username) && <span>{formik.errors.username}</span>}
                </div>
                <div className="errorContainer" style={(formik.errors.username && formik.touched.username) && { marginTop: -5 }}>
                    <div className="inputContainer">
                        <LockOutlinedIcon className="icon" />
                        <input
                            placeholder="Password"
                            type="password"
                            id="password"
                            name="password"
                            value={formik.values.password}
                            onBlur={formik.handleBlur('password')}
                            onChange={formik.handleChange('password')}
                        />
                    </div>
                    {(formik.errors.password && formik.touched.password) && <span>{formik.errors.password}</span>}
                </div>
                <div className="forgetpwd" style={(formik.errors.password && formik.touched.password) && { marginTop: -10 }} >
                    <p onClick={() => { navigate('/changePassword') }} className="forgetText">Change Password</p>
                </div>
                <div className="button-container" style={{ marginTop: '1rem' }}>
                    <button
                        disabled={!formik.dirty && !formik.isValid} onClick={formik.handleSubmit} type="submit" name="submit">LOGIN</button>
                </div>
            </div>
        </div>
    )
}
export default Login;