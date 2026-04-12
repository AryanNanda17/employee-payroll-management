import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { FaRegEdit } from 'react-icons/fa';
import axios from '../../../../api/axios';

const formatRupiah = (number) => {
    return `Rs. ${Number(number).toLocaleString('en-IN')}`;
};

const SalaryDeductionSettings = () => {
    const [deductions, setDeductions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDeductions = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/salary-deductions');
            setDeductions(data);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch deduction settings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDeductions();
    }, [fetchDeductions]);

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
                <td key={i} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName="Salary Deduction Settings" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6"
            >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    These deductions are applied per day based on attendance records. Edit the amount to adjust how much is deducted per absent or sick day.
                </p>

                <div className="max-w-full overflow-x-auto py-4">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Deduction Type</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Amount per Day</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : deductions.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No deduction settings found.
                                    </td>
                                </tr>
                            ) : (
                                deductions.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white font-medium">{item.deduction}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{formatRupiah(item.deduction_amount)}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <button
                                                onClick={() => navigate(`/admin/transactions/salary-deductions/salary-deduction-form?id=${item.id}`)}
                                                className="hover:text-black"
                                            >
                                                <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DefaultLayoutAdmin>
    );
};

export default SalaryDeductionSettings;
