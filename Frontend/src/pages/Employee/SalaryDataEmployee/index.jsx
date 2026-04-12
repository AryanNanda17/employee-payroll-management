import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutEmployee from '../../../layout/DefaultLayoutEmployee';
import { BreadcrumbEmployee } from '../../../components';
import { TfiPrinter } from 'react-icons/tfi';
import axios from '../../../api/axios';

const ITEMS_PER_PAGE = 10;

const formatRupiah = (number) => {
    return `Rs. ${Number(number).toLocaleString('en-IN')}`;
};

const SalaryDataEmployee = () => {
    const [salaryHistory, setSalaryHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const fetchSalaryHistory = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/salary/my-history');
            setSalaryHistory(data);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch salary history');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalaryHistory();
    }, [fetchSalaryHistory]);

    const totalPages = Math.ceil(salaryHistory.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = salaryHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );

    return (
        <DefaultLayoutEmployee>
            <BreadcrumbEmployee pageName="Salary Data" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6"
            >
                <div className="max-w-full overflow-x-auto py-4">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Month/Year</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Basic Salary</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Transport Allowance</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Meal Allowance</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Deduction</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Total Salary</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Print Payslip</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No salary records found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{item.month} {item.year}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{formatRupiah(item.basic_salary)}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{formatRupiah(item.transport_allowance)}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{formatRupiah(item.meal_allowance)}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{formatRupiah(item.total_deduction)}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white font-semibold">{formatRupiah(item.net_salary)}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark text-center">
                                            <button onClick={() => window.print()} className="hover:text-black">
                                                <TfiPrinter className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                            Showing {salaryHistory.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, salaryHistory.length)} of {salaryHistory.length} salary records
                        </span>
                    </div>
                    <div className="flex space-x-2 py-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                            .map((page, idx, arr) => (
                                <span key={page} className="flex items-center">
                                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                                        <span className="py-2 px-2 text-black dark:text-white">...</span>
                                    )}
                                    <button
                                        onClick={() => setCurrentPage(page)}
                                        className={`py-2 px-4 rounded-lg border font-semibold ${
                                            page === currentPage
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-2 bg-gray text-black dark:bg-transparent dark:border-strokedark dark:text-white'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                </span>
                            ))}
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </motion.div>
        </DefaultLayoutEmployee>
    );
};

export default SalaryDataEmployee;
