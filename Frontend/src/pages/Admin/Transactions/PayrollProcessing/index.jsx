import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import axios from '../../../../api/axios';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = [2024, 2025, 2026];
const ITEMS_PER_PAGE = 10;

const formatAmount = (n) => {
    if (isNaN(n) || n === null || n === undefined) return 'Rs. 0';
    return `Rs. ${Number(n).toLocaleString('en-IN')}`;
};

const PayrollProcessing = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [status, setStatus] = useState(null);
    const [records, setRecords] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [marking, setMarking] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const resetState = () => {
        setStatus(null);
        setRecords([]);
        setSelectedIds([]);
        setCurrentPage(1);
    };

    const checkStatus = async () => {
        if (!selectedMonth || !selectedYear) {
            toast.error('Please select month and year');
            return;
        }
        setLoading(true);
        resetState();
        try {
            const { data } = await axios.get(
                `/payroll/status?month=${selectedMonth}&year=${selectedYear}`
            );
            setStatus(data);
            if (data.processed) {
                await fetchRecords();
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to check payroll status');
        } finally {
            setLoading(false);
        }
    };

    const fetchRecords = async () => {
        try {
            const { data } = await axios.get(
                `/payroll/records?month=${selectedMonth}&year=${selectedYear}`
            );
            setRecords(data);
            setSelectedIds([]);
            setCurrentPage(1);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch payroll records');
        }
    };

    const processPayroll = async () => {
        setProcessing(true);
        try {
            await axios.post('/payroll/process', {
                month: selectedMonth,
                year: selectedYear,
            });
            toast.success('Payroll processed successfully');
            setStatus({ processed: true });
            await fetchRecords();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to process payroll');
        } finally {
            setProcessing(false);
        }
    };

    const markAsPaid = async () => {
        if (selectedIds.length === 0) {
            toast.error('Please select at least one record');
            return;
        }
        setMarking(true);
        try {
            await axios.patch('/payroll/mark-paid', { ids: selectedIds });
            toast.success(`${selectedIds.length} record(s) marked as paid`);
            await fetchRecords();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to mark as paid');
        } finally {
            setMarking(false);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const processedRecords = records.filter((r) => r.status === 'processed');

    const toggleSelectAll = () => {
        if (processedRecords.length === 0) return;
        const allProcessedIds = processedRecords.map((r) => r.id);
        const allSelected = allProcessedIds.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? [] : allProcessedIds);
    };

    const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedRecords = records.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {Array.from({ length: 9 }).map((_, i) => (
                <td key={i} className="border-b border-[#eee] py-5 px-2 dark:border-strokedark">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName="Payroll Processing" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Filter & Actions */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Select Payroll Period
                        </h3>
                    </div>
                    <div className="p-6.5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Month <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => {
                                            setSelectedMonth(e.target.value);
                                            resetState();
                                        }}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    >
                                        <option value="">Select Month</option>
                                        {MONTHS.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Year <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => {
                                            setSelectedYear(e.target.value);
                                            resetState();
                                        }}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    >
                                        <option value="">Select Year</option>
                                        {YEARS.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={checkStatus}
                                    disabled={loading}
                                    className="w-full rounded bg-primary py-3 px-6 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Checking...' : 'Check Status'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Result */}
                {status && !status.processed && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6"
                    >
                        <div className="p-6.5 flex flex-col items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning bg-opacity-20">
                                <svg className="w-8 h-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-lg text-black dark:text-white">
                                Payroll for <span className="font-bold">{selectedMonth} {selectedYear}</span> has not been processed yet.
                            </p>
                            <button
                                onClick={processPayroll}
                                disabled={processing}
                                className="rounded bg-meta-3 py-3 px-8 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Process Payroll'}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Payroll Records Table */}
                {status?.processed && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                                <h5 className="text-lg font-bold text-black dark:text-white">
                                    Payroll Records &mdash; {selectedMonth} {selectedYear}
                                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                        ({records.length} employees)
                                    </span>
                                </h5>
                                {processedRecords.length > 0 && (
                                    <button
                                        onClick={markAsPaid}
                                        disabled={marking || selectedIds.length === 0}
                                        className="rounded bg-meta-3 py-2 px-6 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {marking
                                            ? 'Updating...'
                                            : `Mark as Paid (${selectedIds.length})`}
                                    </button>
                                )}
                            </div>

                            <div className="max-w-full overflow-x-auto py-4">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-2 dark:bg-meta-4">
                                            <th className="py-3 px-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        processedRecords.length > 0 &&
                                                        processedRecords.every((r) =>
                                                            selectedIds.includes(r.id)
                                                        )
                                                    }
                                                    onChange={toggleSelectAll}
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                />
                                            </th>
                                            <th className="py-3 px-2 font-medium text-black dark:text-white text-left">Employee Name</th>
                                            <th className="py-3 px-2 font-medium text-black dark:text-white text-left">Position</th>
                                            <th className="py-3 px-2 font-medium text-black dark:text-white text-center">Basic Salary</th>
                                            <th className="py-3 px-2 font-medium text-black dark:text-white text-center">Allowances</th>
                                            <th className="py-3 px-2 font-medium text-black dark:text-white text-center">Gross</th>
                                            <th className="py-3 px-2 font-medium text-black dark:text-white text-center">Deductions</th>
                                            <th className="py-3 px-2 font-medium text-black dark:text-white text-center">Net Salary</th>
                                            <th className="py-3 px-2 font-medium text-black dark:text-white text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <SkeletonRow key={i} />
                                            ))
                                        ) : paginatedRecords.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={9}
                                                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                                                >
                                                    No payroll records found.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedRecords.map((row) => (
                                                <tr key={row.id}>
                                                    <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(row.id)}
                                                            disabled={row.status === 'paid'}
                                                            onChange={() => toggleSelect(row.id)}
                                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                                        />
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-2 dark:border-strokedark">
                                                        <p className="text-black dark:text-white font-semibold">
                                                            {row.employee_name}
                                                        </p>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-2 dark:border-strokedark">
                                                        <p className="text-black dark:text-white">
                                                            {row.position_name}
                                                        </p>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                        <p className="text-black dark:text-white">
                                                            {formatAmount(row.basic_salary)}
                                                        </p>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                        <p className="text-black dark:text-white">
                                                            {formatAmount(row.allowances)}
                                                        </p>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                        <span className="inline-block rounded bg-blue-100 dark:bg-blue-900 py-0.5 px-2 text-blue-700 dark:text-blue-300 font-bold">
                                                            {formatAmount(row.gross_salary)}
                                                        </span>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                        <span className="inline-block rounded bg-red-100 dark:bg-red-900 py-0.5 px-2 text-red-700 dark:text-red-300 font-bold">
                                                            {formatAmount(row.total_deduction)}
                                                        </span>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                        <span className="inline-block rounded bg-green-100 dark:bg-green-900 py-0.5 px-2 text-green-700 dark:text-green-300 font-bold">
                                                            {formatAmount(row.net_salary)}
                                                        </span>
                                                    </td>
                                                    <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                        {row.status === 'paid' ? (
                                                            <span className="inline-block rounded-full bg-green-100 dark:bg-green-900 py-1 px-3 text-xs font-semibold text-green-700 dark:text-green-300">
                                                                Paid
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block rounded-full bg-yellow-100 dark:bg-yellow-900 py-1 px-3 text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                                                                Processed
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {records.length > ITEMS_PER_PAGE && (
                                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                                    <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                                        Showing {records.length === 0 ? 0 : startIndex + 1}-
                                        {Math.min(startIndex + ITEMS_PER_PAGE, records.length)} of{' '}
                                        {records.length} records
                                    </span>
                                    <div className="flex space-x-2 py-4">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage((p) => p - 1)}
                                            className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
                                        >
                                            Prev
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(
                                                (page) =>
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    Math.abs(page - currentPage) <= 1
                                            )
                                            .map((page, idx, arr) => (
                                                <span key={page} className="flex items-center">
                                                    {idx > 0 && arr[idx - 1] !== page - 1 && (
                                                        <span className="py-2 px-2 text-black dark:text-white">
                                                            ...
                                                        </span>
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
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </DefaultLayoutAdmin>
    );
};

export default PayrollProcessing;
