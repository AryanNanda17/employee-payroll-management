import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ReactApexChart from 'react-apexcharts';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { MdOutlineKeyboardArrowDown, MdInfoOutline } from 'react-icons/md';
import { TfiPrinter, TfiEye } from 'react-icons/tfi';
import { FaUserCheck, FaUserTimes, FaThermometerHalf } from 'react-icons/fa';
import axios from '../../../../api/axios';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = [2024, 2025, 2026];

const AttendanceReport = () => {
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [employees, setEmployees] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
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

    const filterDescription = useMemo(() => {
        if (selectedMonth && selectedYear && selectedEmployee) {
            const emp = employees.find(e => e.nik === selectedEmployee);
            return `Report for ${emp?.employee_name || selectedEmployee} | ${selectedMonth} ${selectedYear}`;
        }
        if (selectedMonth && selectedYear) return `Report for all employees | ${selectedMonth} ${selectedYear}`;
        if (selectedYear && selectedEmployee) {
            const emp = employees.find(e => e.nik === selectedEmployee);
            return `Report for ${emp?.employee_name || selectedEmployee} | All months of ${selectedYear}`;
        }
        if (selectedMonth && selectedEmployee) {
            const emp = employees.find(e => e.nik === selectedEmployee);
            return `Report for ${emp?.employee_name || selectedEmployee} | ${selectedMonth} across all years`;
        }
        if (selectedYear) return `Report for all employees | All months of ${selectedYear}`;
        if (selectedMonth) return `Report for all employees | ${selectedMonth} across all years`;
        if (selectedEmployee) {
            const emp = employees.find(e => e.nik === selectedEmployee);
            return `Report for ${emp?.employee_name || selectedEmployee} | All months, all years`;
        }
        return 'Report for all employees | All months, all years';
    }, [selectedMonth, selectedYear, selectedEmployee, employees]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedMonth) params.append('month', selectedMonth);
            if (selectedYear) params.append('year', selectedYear);
            if (selectedEmployee) params.append('nik', selectedEmployee);

            const { data } = await axios.get(`/attendance?${params.toString()}`);
            setAttendanceData(data);
            setFetched(true);
            if (data.length === 0) toast('No records found for the selected filters', { icon: 'ℹ️' });
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch attendance report');
        } finally {
            setLoading(false);
        }
    };

    const monthlyChartData = useMemo(() => {
        if (!attendanceData.length) return null;

        const grouped = {};
        attendanceData.forEach(item => {
            const key = `${item.month} ${item.year}`;
            if (!grouped[key]) grouped[key] = { month: item.month, year: item.year, present: 0, sick: 0, absent: 0, count: 0 };
            grouped[key].present += item.present || 0;
            grouped[key].sick += item.sick || 0;
            grouped[key].absent += item.absent || 0;
            grouped[key].count += 1;
        });

        const sorted = Object.values(grouped).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month);
        });

        return {
            categories: sorted.map(s => selectedYear ? s.month.slice(0, 3) : `${s.month.slice(0, 3)} ${s.year}`),
            present: sorted.map(s => s.present),
            sick: sorted.map(s => s.sick),
            absent: sorted.map(s => s.absent),
        };
    }, [attendanceData, selectedYear]);

    const employeeChartData = useMemo(() => {
        if (!attendanceData.length) return null;

        const grouped = {};
        attendanceData.forEach(item => {
            if (!grouped[item.nik]) grouped[item.nik] = { name: item.employee_name, present: 0, sick: 0, absent: 0 };
            grouped[item.nik].present += item.present || 0;
            grouped[item.nik].sick += item.sick || 0;
            grouped[item.nik].absent += item.absent || 0;
        });

        const arr = Object.values(grouped).sort((a, b) => b.present - a.present);
        return {
            categories: arr.map(e => e.name.split(' ')[0]),
            present: arr.map(e => e.present),
            sick: arr.map(e => e.sick),
            absent: arr.map(e => e.absent),
        };
    }, [attendanceData]);

    const totals = useMemo(() => {
        const t = { present: 0, sick: 0, absent: 0 };
        attendanceData.forEach(item => {
            t.present += item.present || 0;
            t.sick += item.sick || 0;
            t.absent += item.absent || 0;
        });
        return t;
    }, [attendanceData]);

    const totalDays = totals.present + totals.sick + totals.absent;
    const lineChartOptions = {
        chart: { type: 'area', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2.5 },
        xaxis: {
            categories: monthlyChartData?.categories || [],
            labels: { style: { colors: '#64748b', fontSize: '11px' }, rotate: -45 }
        },
        yaxis: { labels: { style: { colors: '#64748b' } } },
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 } },
        tooltip: { y: { formatter: (val) => `${val} days` } },
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        legend: { position: 'top', labels: { colors: '#64748b' } },
        grid: { borderColor: '#334155', strokeDashArray: 4 },
        markers: { size: 4, strokeWidth: 0, hover: { size: 6 } },
    };

    const empLineOptions = {
        chart: { type: 'line', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2.5 },
        xaxis: {
            categories: employeeChartData?.categories || [],
            labels: { style: { colors: '#64748b', fontSize: '11px' } }
        },
        yaxis: { labels: { style: { colors: '#64748b' } } },
        tooltip: { y: { formatter: (val) => `${val} days` } },
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        legend: { position: 'top', labels: { colors: '#64748b' } },
        grid: { borderColor: '#334155', strokeDashArray: 4 },
        markers: { size: 4, strokeWidth: 0, hover: { size: 6 } },
    };

    const donutOptions = {
        chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
        labels: ['Present', 'Sick', 'Absent'],
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        legend: { position: 'bottom', labels: { colors: '#64748b' } },
        dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                    labels: {
                        show: true,
                        total: { show: true, label: 'Total Days', formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) }
                    }
                }
            }
        },
    };

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
                <BreadcrumbAdmin pageName="Employee Attendance Report" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                {/* Filter Card */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark print:hidden">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Filter Attendance Report</h3>
                    </div>
                    <div className="p-6.5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {/* Year */}
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">Year</label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    >
                                        <option value="">All Years</option>
                                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl pointer-events-none" />
                                </div>
                            </div>

                            {/* Month */}
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">Month</label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    >
                                        <option value="">All Months</option>
                                        {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl pointer-events-none" />
                                </div>
                            </div>

                            {/* Employee */}
                            <div>
                                <label className="mb-2.5 block text-black dark:text-white">Employee</label>
                                <div className="relative z-20 bg-transparent dark:bg-form-input">
                                    <select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    >
                                        <option value="">All Employees</option>
                                        {employees.map((emp) => (
                                            <option key={emp.nik} value={emp.nik}>
                                                {emp.employee_name} ({emp.nik})
                                            </option>
                                        ))}
                                    </select>
                                    <MdOutlineKeyboardArrowDown className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Help tooltip */}
                        <div className="flex items-center gap-2 mb-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400">All filters are optional</p>
                            <div className="relative group">
                                <MdInfoOutline className="text-primary text-lg cursor-pointer hover:text-opacity-80 transition-colors" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 rounded-lg bg-white dark:bg-boxdark border border-stroke dark:border-strokedark shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                                        <li className="flex gap-1.5"><span className="text-primary">•</span>No filters → all employees, all months, all years</li>
                                        <li className="flex gap-1.5"><span className="text-primary">•</span>Only Month → compare across all years</li>
                                        <li className="flex gap-1.5"><span className="text-primary">•</span>Only Year → all 12 months of that year</li>
                                        <li className="flex gap-1.5"><span className="text-primary">•</span>Only Employee → full history of that person</li>
                                    </ul>
                                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-white dark:bg-boxdark border-r border-b border-stroke dark:border-strokedark rotate-45"></div>
                                </div>
                            </div>
                        </div>

                        {/* Filter description */}
                        <div className="mb-4 px-4 py-2 rounded bg-gray-2 dark:bg-meta-4">
                            <p className="text-sm text-black dark:text-white">{filterDescription}</p>
                        </div>

                        <div className="flex flex-col md:flex-row w-full gap-3 text-center">
                            <ButtonOne onClick={fetchReport}>
                                <span>Generate Report</span>
                                <span><TfiEye /></span>
                            </ButtonOne>
                            {fetched && attendanceData.length > 0 && (
                                <ButtonOne onClick={() => window.print()}>
                                    <span>Print Report</span>
                                    <span><TfiPrinter /></span>
                                </ButtonOne>
                            )}
                        </div>
                    </div>
                </div>

                {/* Report Content */}
                {fetched && attendanceData.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        {/* Report Header */}
                        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-6 print:shadow-none print:mt-0 print:border-none">
                            <div className="bg-primary px-8 py-6 rounded-t-sm print:bg-blue-700">
                                <h2 className="text-2xl font-bold text-white">Attendance Report</h2>
                                <p className="text-sm text-blue-100 mt-1">
                                    Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="px-8 py-5">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Scope</span>
                                        <p className="font-bold text-black dark:text-white mt-1">
                                            {selectedEmployee ? employees.find(e => e.nik === selectedEmployee)?.employee_name || selectedEmployee : 'All Employees'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Period</span>
                                        <p className="font-bold text-black dark:text-white mt-1">
                                            {selectedMonth || 'All Months'}{selectedYear ? `, ${selectedYear}` : ', All Years'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Total Records</span>
                                        <p className="font-bold text-black dark:text-white mt-1">{attendanceData.length}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">Attendance Rate</span>
                                        <p className="font-bold text-xl text-meta-3 mt-1">{totalDays > 0 ? ((totals.present / totalDays) * 100).toFixed(1) : 0}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 print:grid-cols-3">
                            <div className="rounded-sm border-l-4 border-meta-3 bg-white py-5 px-6 shadow-default dark:bg-boxdark">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-meta-3 bg-opacity-20">
                                        <FaUserCheck className="text-meta-3 text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-meta-3">{totals.present.toLocaleString()}</h4>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Present Days ({totalDays > 0 ? ((totals.present / totalDays) * 100).toFixed(1) : 0}%)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-sm border-l-4 border-warning bg-white py-5 px-6 shadow-default dark:bg-boxdark">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning bg-opacity-20">
                                        <FaThermometerHalf className="text-warning text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-warning">{totals.sick.toLocaleString()}</h4>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sick Days ({totalDays > 0 ? ((totals.sick / totalDays) * 100).toFixed(1) : 0}%)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-sm border-l-4 border-danger bg-white py-5 px-6 shadow-default dark:bg-boxdark">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger bg-opacity-20">
                                        <FaUserTimes className="text-danger text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-danger">{totals.absent.toLocaleString()}</h4>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Absent Days ({totalDays > 0 ? ((totals.absent / totalDays) * 100).toFixed(1) : 0}%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <div className="col-span-2 rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark print:break-inside-avoid">
                                <h5 className="text-lg font-semibold text-black dark:text-white mb-4">
                                    {selectedEmployee ? 'Monthly Attendance' : 'Monthly Attendance (All Employees)'}
                                </h5>
                                {monthlyChartData && monthlyChartData.categories.length > 0 ? (
                                    <ReactApexChart
                                        options={lineChartOptions}
                                        series={[
                                            { name: 'Present', data: monthlyChartData.present },
                                            { name: 'Sick', data: monthlyChartData.sick },
                                            { name: 'Absent', data: monthlyChartData.absent },
                                        ]}
                                        type="area"
                                        height={350}
                                    />
                                ) : (
                                    <p className="text-center text-gray-500 py-16">No chart data</p>
                                )}
                            </div>

                            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark print:break-inside-avoid">
                                <h5 className="text-lg font-semibold text-black dark:text-white mb-4">Distribution</h5>
                                {totalDays > 0 ? (
                                    <ReactApexChart
                                        options={donutOptions}
                                        series={[totals.present, totals.sick, totals.absent]}
                                        type="donut"
                                        height={320}
                                    />
                                ) : (
                                    <p className="text-center text-gray-500 py-16">No data</p>
                                )}
                            </div>
                        </div>

                        {/* Employee Comparison */}
                        {!selectedEmployee && employeeChartData && employeeChartData.categories.length > 1 && (
                            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark mt-6 print:break-inside-avoid">
                                <h5 className="text-lg font-semibold text-black dark:text-white mb-4">
                                    Employee Comparison
                                </h5>
                                <ReactApexChart
                                    options={empLineOptions}
                                    series={[
                                        { name: 'Present', data: employeeChartData.present },
                                        { name: 'Sick', data: employeeChartData.sick },
                                        { name: 'Absent', data: employeeChartData.absent },
                                    ]}
                                    type="line"
                                    height={350}
                                />
                            </div>
                        )}

                        {/* Data Table */}
                        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6 print:shadow-none print:break-inside-avoid">
                            <h5 className="text-lg font-bold text-black dark:text-white mb-4">
                                Detailed Records ({attendanceData.length} records)
                            </h5>
                            <div className="max-w-full overflow-x-auto py-4">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-black dark:bg-black">
                                            <th className="py-3 px-3 font-bold text-white text-left">Employee ID</th>
                                            <th className="py-3 px-3 font-bold text-white text-left">Name</th>
                                            <th className="py-3 px-3 font-bold text-white text-left">Gender</th>
                                            <th className="py-3 px-3 font-bold text-white text-left">Position</th>
                                            <th className="py-3 px-3 font-bold text-white text-left">Month</th>
                                            <th className="py-3 px-3 font-bold text-white text-center">Year</th>
                                            <th className="py-3 px-3 font-bold text-white text-center">Present</th>
                                            <th className="py-3 px-3 font-bold text-white text-center">Sick</th>
                                            <th className="py-3 px-3 font-bold text-white text-center">Absent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                        ) : (
                                            attendanceData.map((item, idx) => (
                                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white dark:bg-boxdark' : 'bg-gray-50 dark:bg-gray-800'}>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 font-semibold text-black dark:text-white">{item.nik}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 font-semibold text-black dark:text-white">{item.employee_name}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 text-black dark:text-white">{item.gender}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 text-black dark:text-white">{item.position_name}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 font-medium text-black dark:text-white">{item.month}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 text-center font-medium text-black dark:text-white">{item.year}</td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 text-center">
                                                        <span className="inline-block min-w-[2rem] rounded bg-green-100 dark:bg-green-900 py-0.5 px-2 text-green-700 dark:text-green-300 font-bold">{item.present}</span>
                                                    </td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 text-center">
                                                        <span className="inline-block min-w-[2rem] rounded bg-amber-100 dark:bg-amber-900 py-0.5 px-2 text-amber-700 dark:text-amber-300 font-bold">{item.sick}</span>
                                                    </td>
                                                    <td className="border-b border-gray-200 dark:border-strokedark py-3 px-3 text-center">
                                                        <span className="inline-block min-w-[2rem] rounded bg-red-100 dark:bg-red-900 py-0.5 px-2 text-red-700 dark:text-red-300 font-bold">{item.absent}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {fetched && attendanceData.length === 0 && (
                    <div className="rounded-sm border border-stroke bg-white px-5 py-16 shadow-default dark:border-strokedark dark:bg-boxdark mt-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No attendance records found for the selected filters.</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting or removing some filters.</p>
                    </div>
                )}
            </motion.div>
        </DefaultLayoutAdmin>
    );
};

export default AttendanceReport;
