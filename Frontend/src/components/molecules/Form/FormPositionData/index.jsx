import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import BreadcrumbAdmin from '../../../atoms/Breadcrumb/BreadcrumbAdmin';
import api from '../../../../api/axios';

const inputClass =
  'w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:text-white';

const FormPositionData = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    positionName: '',
    basicSalary: '',
    transportAllowance: '',
    mealAllowance: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchPosition = async () => {
        try {
          const { data } = await api.get(`/positions/${id}`);
          setFormData({
            positionName: data.positionName || '',
            basicSalary: data.basicSalary || '',
            transportAllowance: data.transportAllowance || '',
            mealAllowance: data.mealAllowance || '',
          });
        } catch (err) {
          toast.error(err.response?.data?.msg || 'Failed to load position data');
        }
      };
      fetchPosition();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await api.patch(`/positions/${id}`, formData);
        toast.success('Position updated successfully');
      } else {
        await api.post('/positions', formData);
        toast.success('Position created successfully');
      }
      navigate('/admin/master-data/positions');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName={isEdit ? 'Edit Position' : 'Add Position'} />

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
                {isEdit ? 'Edit Position Data' : 'Add Position Data'}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                {/* Position Name & Basic Salary */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Position Name <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="positionName"
                      required
                      value={formData.positionName}
                      onChange={handleChange}
                      placeholder="Enter position name"
                      className={inputClass}
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Basic Salary <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="basicSalary"
                      required
                      value={formData.basicSalary}
                      onChange={handleChange}
                      placeholder="Enter basic salary"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Transport Allowance & Meal Allowance */}
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Transport Allowance <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="transportAllowance"
                      required
                      value={formData.transportAllowance}
                      onChange={handleChange}
                      placeholder="Enter transport allowance"
                      className={inputClass}
                    />
                  </div>
                  <div className="w-full xl:w-1/2">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Meal Allowance <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      name="mealAllowance"
                      required
                      value={formData.mealAllowance}
                      onChange={handleChange}
                      placeholder="Enter meal allowance"
                      className={inputClass}
                    />
                  </div>
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
                    to="/admin/master-data/positions"
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

export default FormPositionData;
