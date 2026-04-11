import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import BreadcrumbAdmin from '../../../atoms/Breadcrumb/BreadcrumbAdmin';
import api from '../../../../api/axios';

const inputClass =
  'w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:text-white';

const selectClass =
  'relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:text-white';

const FormEmployeeData = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nik: '',
    employeeName: '',
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    positionId: '',
    joinDate: '',
    status: '',
    accessRights: '',
  });
  const [positions, setPositions] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const { data } = await api.get('/positions');
        setPositions(data);
      } catch (err) {
        toast.error('Failed to load positions');
      }
    };
    fetchPositions();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        try {
          const { data } = await api.get(`/employees/${id}`);
          setFormData({
            nik: data.nik || '',
            employeeName: data.employee_name || '',
            username: data.username || '',
            password: '',
            confirmPassword: '',
            gender: data.gender || '',
            positionId: data.positionId || '',
            joinDate: data.join_date ? data.join_date.slice(0, 10) : '',
            status: data.status || '',
            accessRights: data.role || '',
          });
        } catch (err) {
          toast.error(err.response?.data?.msg || 'Failed to load employee data');
        }
      };
      fetchEmployee();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (isEdit && formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('nik', formData.nik);
      payload.append('employee_name', formData.employeeName);
      payload.append('username', formData.username);
      if (formData.password) payload.append('password', formData.password);
      if (formData.confirmPassword) payload.append('confirmPassword', formData.confirmPassword);
      payload.append('gender', formData.gender);
      payload.append('positionId', formData.positionId);
      payload.append('join_date', formData.joinDate);
      payload.append('status', formData.status);
      payload.append('role', formData.accessRights);
      if (photo) payload.append('photo', photo);

      if (isEdit) {
        await api.patch(`/employees/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Employee created successfully');
      }

      navigate('/admin/master-data/employees');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName={isEdit ? 'Edit Employee' : 'Add Employee'} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sm:grid-cols-2"
      >
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                {isEdit ? 'Edit Employee Data' : 'Add Employee Data'}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                {/* Employee ID & Employee Name */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Employee ID <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="nik"
                      required
                      value={formData.nik}
                      onChange={handleChange}
                      placeholder="Enter Employee ID"
                      className={inputClass}
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Employee Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="employeeName"
                      required
                      value={formData.employeeName}
                      onChange={handleChange}
                      placeholder="Enter employee name"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Username & Password */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Username <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      className={inputClass}
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Password {!isEdit && <span className="text-meta-1">*</span>}
                    </label>
                    <input
                      type="password"
                      name="password"
                      required={!isEdit}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={isEdit ? 'Leave blank to keep current' : 'Enter password'}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Confirm Password & Gender */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Confirm Password {!isEdit && <span className="text-meta-1">*</span>}
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required={!isEdit}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className={inputClass}
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Gender <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Position (Dropdown) & Join Date */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Position <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="positionId"
                        required
                        value={formData.positionId}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">Select Position</option>
                        {positions.map((pos) => (
                          <option key={pos.id} value={pos.id}>
                            {pos.position_name}
                          </option>
                        ))}
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Join Date <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="date"
                      name="joinDate"
                      required
                      value={formData.joinDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Status & Access Rights */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Status <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="status"
                        required
                        value={formData.status}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">Select</option>
                        <option value="Permanent Employee">Permanent Employee</option>
                        <option value="Contract Employee">Contract Employee</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Access Rights <span className="text-meta-1">*</span>
                    </label>
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="accessRights"
                        required
                        value={formData.accessRights}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        <option value="">Select</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl">
                        <MdOutlineKeyboardArrowDown />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Photo */}
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke dark:file:border-strokedark file:bg-[#EEEEEE] dark:file:bg-white/30 dark:file:text-white file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row w-full gap-3 text-center mt-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded bg-primary py-3 px-10 font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {submitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <Link
                    to="/admin/master-data/employees"
                    className="inline-flex items-center justify-center rounded border border-stroke py-3 px-10 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white transition"
                  >
                    Back
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </DefaultLayoutAdmin>
  );
};

export default FormEmployeeData;
