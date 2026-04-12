import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TfiEye, TfiPrinter } from 'react-icons/tfi';
import axios from '../../../../api/axios';

const ITEMS_PER_PAGE = 10;
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = [2024, 2025, 2026];

const formatRupiah = (number) => {
    return `Rs. ${Number(number).toLocaleString('en-IN')}`;
};

const SalaryData = () => {
    const [salaryData, setSalaryData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [displayMonth, setDisplayMonth] = useState('');
    const [displayYear, setDisplayYear] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchSalaryData = async () => {
        if (!selectedMonth || !selectedYear) {
            toast.error('Please select month and year');
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.get(`/salary/report?month=${selectedMonth}&year=${selectedYear}`);
            setSalaryData(data);
            setFilteredData(data);
            setDisplayMonth(selectedMonth);
            setDisplayYear(selectedYear);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch salary data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        const q = value.toLowerCase();
        const filtered = salaryData.filter(
            (s) =>
                (s.nik || '').toLowerCase().includes(q) ||
                (s.employee_name || '').toLowerCase().includes(q)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
            <BreadcrumbAdmin pageName="Employee Salary Data" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 mt-6">
                    <div className="border-b border-stroke py-2 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Filter Employee Salary Data</h3>
                    </div>
                    <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                        <div className="relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0">
                            <div className="relative">
                                <span className="px-4">Month</span>
                                <span className="absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl">
                                    <MdOutlineKeyboardArrowDown />
                                </span>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                >
                                    <option value="">Select Month</option>
                                    {MONTHS.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="relative w-full md:w-1/4 md:mr-2 mb-4 md:mb-0">
                            <div className="relative">
                                <span className="px-4">Year</span>
                                <span className="absolute top-1/2 left-55 z-30 -translate-y-1/2 text-xl">
                                    <MdOutlineKeyboardArrowDown />
                                </span>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="relative appearance-none rounded border border-stroke bg-transparent py-2 px-12 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                                >
                                    <option value="">Select Year</option>
                                    {YEARS.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full md:w-1/2 justify-between text-center">
                            <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
                                <ButtonOne onClick={fetchSalaryData}>
                                    <span>Show Data</span>
                                    <span><TfiEye /></span>
                                </ButtonOne>
                            </div>
                            <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
                                <ButtonOne onClick={() => window.print()}>
                                    <span>Print Salary List</span>
                                    <span><TfiPrinter /></span>
                                </ButtonOne>
                            </div>
                        </div>
                    </div>

                    {displayMonth && displayYear && (
                        <div className="bg-gray-2 text-left dark:bg-meta-4 mt-6">
                            <h2 className="px-4 py-2 text-black dark:text-white">
                                Showing employee salary data for month:
                                <span className="font-medium"> {displayMonth}</span> Year:
                                <span className="font-medium"> {displayYear}</span>
                            </h2>
                        </div>
                    )}
                </div>

                {displayMonth && displayYear && (
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                        <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                            <div className="relative flex-2 mb-4 md:mb-0">
                                <input
                                    type="text"
                                    placeholder="Type to search.."
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                <span className="absolute left-2 py-3 text-xl"><BiSearch /></span>
                            </div>
                        </div>

                        <div className="max-w-full overflow-x-auto py-4">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Employee ID</th>
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Employee Name</th>
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Gender</th>
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Position</th>
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Basic Salary</th>
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Transport Allowance</th>
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Meal Allowance</th>
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Deduction</th>
                                        <th className="py-2 px-2 font-medium text-black dark:text-white">Total Salary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                    ) : paginatedData.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                No salary records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((item) => (
                                            <tr key={item.id}>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.nik}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.employee_name}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.gender}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.position_name}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{formatRupiah(item.basic_salary)}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{formatRupiah(item.transport_allowance)}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{formatRupiah(item.meal_allowance)}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{formatRupiah(item.total_deduction)}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-2 text-center dark:border-strokedark">
                                                    <p className="text-black dark:text-white font-semibold">{formatRupiah(item.net_salary)}</p>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                            <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                                Showing {filteredData.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} records
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
                    </div>
                )}
            </motion.div>
        </DefaultLayoutAdmin>
    );
};

export default SalaryData;
