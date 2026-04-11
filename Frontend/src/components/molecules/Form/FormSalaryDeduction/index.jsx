import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import BreadcrumbAdmin from '../../../atoms/Breadcrumb/BreadcrumbAdmin';
import api from '../../../../api/axios';

const inputClass =
  'w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:text-white';

const FormSalaryDeduction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [deductionName, setDeductionName] = useState('');
  const [deductionAmount, setDeductionAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/admin/transactions/salary-deductions');
      return;
    }
    const fetchDeduction = async () => {
      try {
        const { data } = await api.get(`/salary-deductions/${id}`);
        setDeductionName(data.deduction || '');
        setDeductionAmount(data.deduction_amount ?? '');
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Failed to load deduction data');
      }
    };
    fetchDeduction();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.patch(`/salary-deductions/${id}`, {
        deduction: deductionName,
        deduction_amount: Number(deductionAmount),
      });
      toast.success('Deduction amount updated successfully');
      navigate('/admin/transactions/salary-deductions');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName="Edit Salary Deduction" />

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
                Edit Deduction Amount
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <div className="w-full mb-4">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Deduction Type
                    </label>
                    <input
                      type="text"
                      value={deductionName}
                      disabled
                      className={`${inputClass} cursor-not-allowed opacity-70`}
                    />
                  </div>

                  <div className="w-full mb-4">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Deduction Amount (per day) <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={deductionAmount}
                      onChange={(e) => setDeductionAmount(e.target.value)}
                      placeholder="Enter deduction amount"
                      className={inputClass}
                    />
                  </div>
                </div>

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
                    to="/admin/transactions/salary-deductions"
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

export default FormSalaryDeduction;
