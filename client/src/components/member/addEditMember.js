import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from 'yup';
import { toast } from "react-toastify";

import MemberService from "../../services/memberService";
import Loader from "../../shared/loader";

import '../book/addEditBook.css'
import CommonDialogBox from "../../shared/commonDialogBox";
//functional component to render Add Edit Member Details
function AddEditMember() {
    // variable to store props value from useLocation hook
    const parms = useLocation();
    // variable to store navigation from useNavigate hook
    const navigate = useNavigate();
    //variable to store the member details in edit case
    const [data, setData] = useState()
    //variable is used to maintain the Loader
    const [load, setLoad] = useState(true)
    //variable is used to List of Roles
    const roleList = ['Student', 'Faculty', 'Technician', 'Lab Assitant', 'Office Assistant']
    //variable to maintain the visibility of the confirmation dialog
    const [isVisible, setIsVisible] = useState(false)
    // useEffect hook to fetch member details if editing otherwise, just stop loading 
    useEffect(() => {
        setLoad(true)
        if (parms?.state)
            getOneMemberDetails()
        else
            setLoad(false)
    }, [])
    // Function which is used to fetch details for a specific member based on ID
    const getOneMemberDetails = () => {
        MemberService.getAllMember({ id: parms?.state?.id }).then(res => {
            if (res) {
                setData(res?.data?.details)
                setTimeout(() => {
                    setLoad(false)
                }, 500)
            }
        }).catch(err => {
            console.log('Get One Member Details Error')
        })
    }
    // variable which is used to define validation schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Member name is Required'),
        id: Yup.string()
            .min(3, 'ID should be at least 3 characters')
            .required('ID is Required'),
        email: Yup.string()
            .email('Enter a valid email address')
            .required('Email is Required'),
        phone: Yup.number()
            .typeError('Phone number must be a number')
            .required('Phone Number is Required')
            .test("IsCorrect", 'Phone number is Invalid', (val) => {
                return /^[1-9]{1}\d{9}$/.test(String(val));
            }),
        role: Yup.string()
            .required('Please select a role')
    })
    // variable which is used to initialize formik with initial values, validation schema, and submit handler
    const formik = useFormik({
        initialValues: {
            name: data?.name ? data?.name : '',
            id: data?.id ? data?.id : '',
            email: data?.email ? data?.email : '',
            phone: data?.phone ? data?.phone : '',
            role: data?.role ? data?.role : 'Faculty',
        },
        enableReinitialize: true,
        onSubmit: () => { onUploadMember() },
        validationSchema: validationSchema
    })
    // Function which is used to upload member details
    const onUploadMember = () => {
        let val = formik.values;
        if (data)
            val['_id'] = data['_id'];
        MemberService.saveMemberDetails(val, data ? data['_id'] : '').then(res => {
            if (res) {
                toast.success(res?.data?.message)
                navigate('/members')
            }
        }).catch(err => {
            toast.error(err?.response.data.message)
            console.log(err?.response)
        })
    }
    // Function to handle confirmation dialog responses
    const confirmation = (value) => {
        if (value === "Yes") {
            navigate('/members');
            formik.resetForm();
        }
        setIsVisible(false)
    }

    return (
        <main className={'addBookRoot'}>
            <h2>{data ? 'Edit' : 'Add'} Member Details</h2>
            {load ?
                <Loader />
                :
                <div className="bookForm">

                    <label>Name *</label>
                    <input type="text"
                        name="name"
                        id="name"
                        value={formik.values.name}
                        onBlur={formik.handleBlur('name')}
                        onChange={formik.handleChange('name')}
                        placeholder="Enter the Name"
                        autoComplete="off"
                    />
                    {(formik.errors.name && formik.touched.name) && <span>{formik.errors.name}</span>}

                    <label>ID *</label>
                    <input type="text"
                        placeholder="Enter the ID"
                        name="id"
                        id="id"
                        value={formik.values.id}
                        onBlur={formik.handleBlur('id')}
                        onChange={formik.handleChange('id')}
                        autoComplete="off" />
                    {(formik.errors.id && formik.touched.id) && <span>{formik.errors.id}</span>}

                    <label>Email *</label>
                    <input type="email"
                        placeholder="Enter the Email"
                        name="email"
                        id="email" value={formik.values.email}
                        onBlur={formik.handleBlur('email')}
                        onChange={formik.handleChange('email')}
                        autoComplete="off" />
                    {(formik.errors.email && formik.touched.email) && <span>{formik.errors.email}</span>}

                    <label>Phone Number *</label>
                    <input type="text"
                        placeholder="Enter the Phone Number"
                        name="phone"
                        id="phone" value={formik.values.phone}
                        onBlur={formik.handleBlur('phone')}
                        onChange={formik.handleChange('phone')}
                        // minLength={10}
                        autoComplete="off" />
                    {(formik.errors.phone && formik.touched.phone) && <span>{formik.errors.phone}</span>}

                    <label>Role *</label>
                    <select name="role" value={formik.values.role} onBlur={formik.handleBlur('role')} onChange={(e) => { formik.setFieldValue('role', e.target.value); }}>
                        {roleList?.map((item, key) => (
                            <option value={item} key={key}>{item}</option>
                        ))}
                    </select>


                    <div className="formButton">
                        <button className="back" type="reset" onClick={() => { formik.dirty ? setIsVisible(true) : navigate('/members'); }}>Back</button>
                        <button className="submit" type="submit" disabled={!formik.dirty && !formik.isValid} onClick={formik.handleSubmit}>Submit</button>
                    </div>
                </div>
            }
            <CommonDialogBox
                visible={isVisible}
                setVisible={setIsVisible}
                title={'Confirmation'}
                content={'Are you sure you want to leave this Page?'}
                button={['No', 'Yes']}
                onClick={confirmation}
            />
        </main>
    )
}
export default AddEditMember;