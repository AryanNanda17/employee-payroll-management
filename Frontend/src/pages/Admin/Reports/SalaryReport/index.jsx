import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ReactApexChart from 'react-apexcharts';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TfiPrinter, TfiEye } from 'react-icons/tfi';
import { FaMoneyBillWave, FaMinusCircle, FaWallet } from 'react-icons/fa';
import axios from '../../../../api/axios';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = [2024, 2025, 2026];

const formatRupiah = (number) => {
    if (isNaN(number) || number === null || number === undefined) return 'Rs. 0';
    return `Rs. ${Number(number).toLocaleString('en-IN')}`;
};

const SalaryReport = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [employees, setEmployees] = useState([]);
    const [salaryData, setSalaryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const { data } = await axios.get('/employees');
                setEmployees(data);
            } catch { /* ignore */ }
        };
        fetchEmployees();
    }, []);

    const displayData = useMemo(() => {
        if (!selectedEmployee) return salaryData;
        return salaryData.filter(s => s.nik === selectedEmployee);
    }, [salaryData, selectedEmployee]);

    const totals = useMemo(() => {
        const t = { grossSalary: 0, totalDeduction: 0, netSalary: 0 };
        displayData.forEach(item => {
            t.grossSalary += item.gross_salary || 0;
            t.totalDeduction += item.total_deduction || 0;
            t.netSalary += item.net_salary || 0;
        });
        return t;
    }, [displayData]);

    const fetchReport = async () => {
        if (!selectedMonth || !selectedYear) {
            toast.error('Please select month and year');
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.get(`/salary/report?month=${selectedMonth}&year=${selectedYear}`);
            setSalaryData(data);
            setFetched(true);
            if (data.length === 0) toast('No salary records found', { icon: 'ℹ️' });
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch salary report');
        } finally {
            setLoading(false);
        }
    };

    const barChartOptions = {
        chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: displayData.map(d => d.employee_name.split(' ')[0]),
            labels: { style: { colors: '#64748b', fontSize: '11px' } }
        },
        yaxis: { labels: { style: { colors: '#64748b' }, formatter: (val) => `${(val / 1000).toFixed(0)}k` } },
        tooltip: { y: { formatter: (val) => formatRupiah(val) } },
        colors: ['#3B82F6', '#EF4444', '#10B981'],
        legend: { position: 'top', labels: { colors: '#64748b' } },
        grid: { borderColor: '#334155', strokeDashArray: 4 },
    };

    const donutOptions = {
        chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
        labels: ['Basic Salary', 'Transport', 'Meal Allowance', 'Deductions'],
        colors: ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'],
        legend: { position: 'bottom', labels: { colors: '#64748b' } },
        dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
        plotOptions: { pie: { donut: { size: '60%', labels: { show: true, total: { show: true, label: 'Total Gross', formatter: (w) => formatRupiah(w.globals.seriesTotals.reduce((a, b) => a + b, 0)) } } } } },
    };

    const donutSeries = useMemo(() => {
        const t = { basic: 0, transport: 0, meal: 0, deduction: 0 };
        displayData.forEach(item => {
            t.basic += item.basic_salary || 0;
            t.transport += item.transport_allowance || 0;
            t.meal += item.meal_allowance || 0;
            t.deduction += item.total_deduction || 0;
        });
        return [t.basic, t.transport, t.meal, t.deduction];
    }, [displayData]);

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
            <div className="print:hidden">
                <BreadcrumbAdmin pageName="Employee Salary Report" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Filter Card */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark print:hidden">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Filter Employee Salary Report</h3>
                    </div>
                    <div className="p-6.5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Month <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option value="">Select Month</option>
                                        {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Year <span className="text-meta-1">*</span>
                                </label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option value="">Select Year</option>
                                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">Employee</label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input">
                                        <option value="">All Employees</option>
                                        {employees.map((emp) => (
                                            <option key={emp.nik} value={emp.nik}>{emp.employee_name} ({emp.nik})</option>
                                        ))}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row w-full gap-3 text-center">
                            <ButtonOne onClick={fetchReport}>
                                <span>Generate Report</span>
                                <span><TfiEye /></span>
                            </ButtonOne>
                            {fetched && displayData.length > 0 && (
                                <ButtonOne onClick={() => window.print()}>
                                    <span>Print Report</span>
                                    <span><TfiPrinter /></span>
                                </ButtonOne>
                            )}
                        </div>
                    </div>
                </div>

                {/* Report */}
                {fetched && displayData.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        {/* Report Header */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6 print:shadow-none print:mt-0 print:border-none">
                            <div className="bg-primary px-8 py-6 rounded-t-sm">
                                <h2 className="text-2xl font-bold text-white">Salary Report</h2>
                                <p className="text-sm text-blue-100 mt-1">
                                    {selectedMonth} {selectedYear} | Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="px-8 py-5">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">Scope</span>
                                        <p className="font-bold text-black dark:text-white mt-1">
                                            {selectedEmployee ? employees.find(e => e.nik === selectedEmployee)?.employee_name || selectedEmployee : 'All Employees'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">Period</span>
                                        <p className="font-bold text-black dark:text-white mt-1">{selectedMonth}, {selectedYear}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">Employees</span>
                                        <p className="font-bold text-black dark:text-white mt-1">{displayData.length}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">Total Payroll</span>
                                        <p className="font-bold text-xl text-meta-3 mt-1">{formatRupiah(totals.netSalary)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 print:grid-cols-3">
                            <div className="rounded-sm border-l-4 border-primary bg-white py-5 px-6 shadow-default dark:bg-boxdark">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary bg-opacity-20">
                                        <FaMoneyBillWave className="text-primary text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-primary">{formatRupiah(totals.grossSalary)}</h4>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gross Salary</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-sm border-l-4 border-danger bg-white py-5 px-6 shadow-default dark:bg-boxdark">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger bg-opacity-20">
                                        <FaMinusCircle className="text-danger text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-danger">{formatRupiah(totals.totalDeduction)}</h4>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deductions</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-sm border-l-4 border-meta-3 bg-white py-5 px-6 shadow-default dark:bg-boxdark">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-3 bg-opacity-20">
                                        <FaWallet className="text-meta-3 text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-meta-3">{formatRupiah(totals.netSalary)}</h4>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Net Salary</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <div className="col-span-2 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark print:break-inside-avoid">
                                <h5 className="text-lg font-bold text-black dark:text-white mb-4">Salary Breakdown by Employee</h5>
                                <ReactApexChart
                                    options={barChartOptions}
                                    series={[
                                        { name: 'Gross Salary', data: displayData.map(d => d.gross_salary || 0) },
                                        { name: 'Deduction', data: displayData.map(d => d.total_deduction || 0) },
                                        { name: 'Net Salary', data: displayData.map(d => d.net_salary || 0) },
                                    ]}
                                    type="bar"
                                    height={350}
                                />
                            </div>
                            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark print:break-inside-avoid">
                                <h5 className="text-lg font-bold text-black dark:text-white mb-4">Compensation Split</h5>
                                {donutSeries.some(v => v > 0) ? (
                                    <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={320} />
                                ) : (
                                    <p className="text-center text-gray-500 py-16">No data</p>
                                )}
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6 print:shadow-none print:break-inside-avoid">
                            <h5 className="text-lg font-bold text-black dark:text-white mb-4">
                                Detailed Salary Records ({displayData.length} employees)
                            </h5>
                            <div className="max-w-full overflow-x-auto py-4">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-black dark:bg-black">
                                            <th className="py-3 px-2 font-bold text-white text-left">Employee ID</th>
                                            <th className="py-3 px-2 font-bold text-white text-left">Name</th>
                                            <th className="py-3 px-2 font-bold text-white text-left">Position</th>
                                            <th className="py-3 px-2 font-bold text-white text-center">Basic</th>
                                            <th className="py-3 px-2 font-bold text-white text-center">Transport</th>
                                            <th className="py-3 px-2 font-bold text-white text-center">Meal</th>
                                            <th className="py-3 px-2 font-bold text-white text-center">Gross</th>
                                            <th className="py-3 px-2 font-bold text-white text-center">Deduction</th>
                                            <th className="py-3 px-2 font-bold text-white text-center">Net Salary</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                        ) : (
                                            displayData.map((item, idx) => (
                                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white dark:bg-boxdark' : 'bg-gray-50 dark:bg-gray-800'}>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 font-semibold text-black dark:text-white">{item.nik}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 font-semibold text-black dark:text-white">{item.employee_name}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 text-black dark:text-white">{item.position_name}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 text-center text-black dark:text-white">{formatRupiah(item.basic_salary)}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 text-center text-black dark:text-white">{formatRupiah(item.transport_allowance)}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 text-center text-black dark:text-white">{formatRupiah(item.meal_allowance)}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 text-center">
                                                        <span className="inline-block rounded bg-blue-100 dark:bg-blue-900 py-0.5 px-2 text-blue-700 dark:text-blue-300 font-bold">{formatRupiah(item.gross_salary)}</span>
                                                    </td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 text-center">
                                                        <span className="inline-block rounded bg-red-100 dark:bg-red-900 py-0.5 px-2 text-red-700 dark:text-red-300 font-bold">{formatRupiah(item.total_deduction)}</span>
                                                    </td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-2 text-center">
                                                        <span className="inline-block rounded bg-green-100 dark:bg-green-900 py-0.5 px-2 text-green-700 dark:text-green-300 font-bold">{formatRupiah(item.net_salary)}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        {displayData.length > 1 && (
                                            <tr className="bg-gray-100 dark:bg-gray-700 font-bold">
                                                <td colSpan={6} className="py-3 px-2 text-right text-black dark:text-white">TOTAL</td>
                                                <td className="py-3 px-2 text-center text-primary font-bold">{formatRupiah(totals.grossSalary)}</td>
                                                <td className="py-3 px-2 text-center text-danger font-bold">{formatRupiah(totals.totalDeduction)}</td>
                                                <td className="py-3 px-2 text-center text-meta-3 font-bold">{formatRupiah(totals.netSalary)}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {fetched && displayData.length === 0 && (
                    <div className="rounded-sm border border-stroke bg-white px-5 py-16 shadow-default dark:border-strokedark dark:bg-boxdark mt-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No salary records found.</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Make sure attendance data exists for {selectedMonth} {selectedYear}.</p>
                    </div>
                )}
            </motion.div>
        </DefaultLayoutAdmin>
    );
};

export default SalaryReport;
