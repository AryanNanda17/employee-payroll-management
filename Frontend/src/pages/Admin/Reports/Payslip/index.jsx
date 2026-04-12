import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TfiPrinter } from 'react-icons/tfi';
import { TfiEye } from 'react-icons/tfi';
import axios from '../../../../api/axios';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = [2024, 2025, 2026];

const formatRupiah = (number) => {
    return `Rs. ${Number(number).toLocaleString('en-IN')}`;
};

const Payslip = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [slipData, setSlipData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const { data } = await axios.get('/employees');
                setEmployees(data);
            } catch (err) {
                toast.error(err.response?.data?.msg || 'Failed to fetch employees');
            } finally {
                setLoadingEmployees(false);
            }
        };
        fetchEmployees();
    }, []);

    const fetchSlip = async () => {
        if (!selectedMonth || !selectedYear || !selectedEmployee) {
            toast.error('Please select month, year, and employee');
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.get(`/salary/slip/${selectedEmployee}?month=${selectedMonth}&year=${selectedYear}`);
            setSlipData(data);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch payslip');
            setSlipData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName="Employee Payslip" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="sm:grid-cols-2">
                    <div className="flex flex-col gap-9">
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">Filter Employee Payslip</h3>
                            </div>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <div className="w-full mb-4">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Month <span className="text-meta-1">*</span>
                                        </label>
                                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                                            <select
                                                value={selectedMonth}
                                                onChange={(e) => setSelectedMonth(e.target.value)}
                                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            >
                                                <option value="">Select Month</option>
                                                {MONTHS.map((m) => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl">
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full mb-4">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Year <span className="text-meta-1">*</span>
                                        </label>
                                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                                            <select
                                                value={selectedYear}
                                                onChange={(e) => setSelectedYear(e.target.value)}
                                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                            >
                                                <option value="">Select Year</option>
                                                {YEARS.map((y) => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl">
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="w-full mb-4">
                                        <label className="mb-2.5 block text-black dark:text-white">
                                            Employee Name <span className="text-meta-1">*</span>
                                        </label>
                                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                                            <select
                                                value={selectedEmployee}
                                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                                disabled={loadingEmployees}
                                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:opacity-50"
                                            >
                                                <option value="">
                                                    {loadingEmployees ? 'Loading employees...' : 'Select Employee'}
                                                </option>
                                                {employees.map((emp) => (
                                                    <option key={emp.id} value={emp.id}>{emp.employee_name}</option>
                                                ))}
                                            </select>
                                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-2xl">
                                                <MdOutlineKeyboardArrowDown />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row w-full gap-3 text-center">
                                    <ButtonOne onClick={fetchSlip}>
                                        <span>Show Payslip</span>
                                        <span><TfiEye /></span>
                                    </ButtonOne>
                                    <ButtonOne onClick={() => window.print()}>
                                        <span>Print Payslip</span>
                                        <span><TfiPrinter /></span>
                                    </ButtonOne>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="mt-6 rounded-sm border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                )}

                {slipData && !loading && (
                    <div className="mt-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark print:shadow-none print:border-black">
                        <div className="border-b-2 border-primary p-6">
                            <h2 className="text-2xl font-bold text-primary text-center">PAYSLIP</h2>
                            <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
                                Period: {selectedMonth} {selectedYear}
                            </p>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-stroke dark:border-strokedark">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Employee Name</p>
                                <p className="font-semibold text-black dark:text-white">{slipData.employee?.employee_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Employee ID</p>
                                <p className="font-semibold text-black dark:text-white">{slipData.employee?.nik}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Position</p>
                                <p className="font-semibold text-black dark:text-white">{slipData.employee?.position_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                                <p className="font-semibold text-black dark:text-white">{slipData.employee?.gender}</p>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-black dark:text-white mb-3 text-lg border-b border-stroke dark:border-strokedark pb-2">Earnings</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Basic Salary</span>
                                        <span className="font-medium text-black dark:text-white">{formatRupiah(slipData.earnings?.basic_salary)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Transport Allowance</span>
                                        <span className="font-medium text-black dark:text-white">{formatRupiah(slipData.earnings?.transport_allowance)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Meal Allowance</span>
                                        <span className="font-medium text-black dark:text-white">{formatRupiah(slipData.earnings?.meal_allowance)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-stroke dark:border-strokedark pt-2 mt-2">
                                        <span className="font-semibold text-black dark:text-white">Total Earnings</span>
                                        <span className="font-bold text-black dark:text-white">
                                            {formatRupiah(slipData.earnings?.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-black dark:text-white mb-3 text-lg border-b border-stroke dark:border-strokedark pb-2">Deductions</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">Total Deduction</span>
                                        <span className="font-medium text-danger">{formatRupiah(slipData.deductions?.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary bg-opacity-10 p-6 mx-6 mb-6 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-black dark:text-white">Net Salary</span>
                                <span className="text-2xl font-bold text-primary">{formatRupiah(slipData.net_salary)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </DefaultLayoutAdmin>
    );
};

export default Payslip;
