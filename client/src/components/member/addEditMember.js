import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from 'yup';
import { toast } from "react-toastify";

import MemberService from "../../services/memberService";
import Loader from "../../shared/loader";

import '../book/addEditBook.css'

function AddEditMember() {

    const parms = useLocation();

    const navigate = useNavigate();

    const [data, setData] = useState()

    const [load, setLoad] = useState(true)

    const roleList = ['Student', 'Faculty', 'Technician', 'Lab Assitant', 'Office Assistant']

    useEffect(() => {
        setLoad(true)
        if (parms?.state)
            getOneMemberDetails()
        else
            setLoad(false)
    }, [])

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

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is Required'),
        id: Yup.string()
            .min(3, 'Minimum length of ID is 3')
            .required('ID is Required'),
        email: Yup.string()
            .required('Email is Required'),
        phone: Yup.number().typeError('Invalid Type').required('Phone Number is Required'),
        role: Yup.string()
            .required('Role is Required')
    })

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

    const onUploadMember = () => {
        MemberService.saveMemberDetails(formik.values).then(res => {
            if (res) {
                toast.success(res?.data?.message)
                navigate('/members')
            }
        }).catch(err => {
            toast.error(err?.response.data.message)
            console.log(err?.response)
        })
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
                    />
                    {(formik.errors.name && formik.touched.name) && <span>{formik.errors.name}</span>}

                    <label>ID *</label>
                    <input type="text"
                        placeholder="Enter the ID"
                        name="id"
                        id="id"
                        value={formik.values.id}
                        onBlur={formik.handleBlur('id')}
                        onChange={formik.handleChange('id')} />
                    {(formik.errors.id && formik.touched.id) && <span>{formik.errors.id}</span>}

                    <label>Email *</label>
                    <input type="email"
                        placeholder="Enter the Email"
                        name="email"
                        id="email" value={formik.values.email}
                        onBlur={formik.handleBlur('email')}
                        onChange={formik.handleChange('email')} />
                    {(formik.errors.email && formik.touched.email) && <span>{formik.errors.email}</span>}

                    <label>Phone Number *</label>
                    <input type="text"
                        placeholder="Enter the Phone Number"
                        name="phone"
                        id="phone" value={formik.values.phone}
                        onBlur={formik.handleBlur('phone')}
                        onChange={formik.handleChange('phone')}
                        minLength={10} />
                    {(formik.errors.phone && formik.touched.phone) && <span>{formik.errors.phone}</span>}

                    <label>Role *</label>
                    <select name="role" value={formik.values.role} onBlur={formik.handleBlur('role')} onChange={(e) => { formik.setFieldValue('role', e.target.value); }}>
                        {roleList?.map((item, key) => (
                            <option value={item} key={key}>{item}</option>
                        ))}
                    </select>


                    <div className="formButton">
                        <button className="back" type="reset" onClick={() => { navigate('/members'); formik.resetForm(); }}>Back</button>
                        <button className="submit" type="submit" disabled={!formik.dirty && !formik.isValid} onClick={formik.handleSubmit}>Submit</button>
                    </div>
                </div>
            }

        </main>
    )
}
export default AddEditMember;