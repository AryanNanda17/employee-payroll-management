import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ReactApexChart from 'react-apexcharts';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { FaUserCheck, FaUserTimes, FaThermometerHalf, FaTrophy } from 'react-icons/fa';
import axios from '../../../../api/axios';

const AttendanceAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async (year) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/attendance/analytics?year=${year}`);
            setAnalytics(data);
            if (data.availableYears?.length > 0) {
                setAvailableYears(data.availableYears);
            }
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics(selectedYear);
    }, [selectedYear]);

    const monthlyBarOptions = {
        chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: analytics?.monthlyTotals
                ?.filter(m => m.employeeCount > 0)
                .map(m => m.month.slice(0, 3)) || [],
            labels: { style: { colors: '#64748b' } }
        },
        yaxis: { labels: { style: { colors: '#64748b' } } },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val) => `${val} days` } },
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        legend: { position: 'top', labels: { colors: '#64748b' } },
        grid: { borderColor: '#334155', strokeDashArray: 4 },
    };

    const monthlyBarSeries = analytics ? [
        { name: 'Present', data: analytics.monthlyTotals.filter(m => m.employeeCount > 0).map(m => m.totalPresent) },
        { name: 'Sick', data: analytics.monthlyTotals.filter(m => m.employeeCount > 0).map(m => m.totalSick) },
        { name: 'Absent', data: analytics.monthlyTotals.filter(m => m.employeeCount > 0).map(m => m.totalAbsent) },
    ] : [];

    const donutOptions = {
        chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
        labels: ['Present', 'Sick', 'Absent'],
        colors: ['#10B981', '#F59E0B', '#EF4444'],
        legend: { position: 'bottom', labels: { colors: '#64748b' } },
        dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Days',
                            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                        }
                    }
                }
            }
        },
        responsive: [{ breakpoint: 480, options: { chart: { width: 280 }, legend: { position: 'bottom' } } }]
    };

    const donutSeries = analytics ? [
        analytics.totals.totalPresent,
        analytics.totals.totalSick,
        analytics.totals.totalAbsent,
    ] : [];

    const trendLineOptions = {
        chart: { type: 'area', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        xaxis: {
            categories: analytics?.monthlyTotals
                ?.filter(m => m.employeeCount > 0)
                .map(m => m.month.slice(0, 3)) || [],
            labels: { style: { colors: '#64748b' } }
        },
        yaxis: { labels: { style: { colors: '#64748b' } } },
        colors: ['#3B82F6'],
        fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
        tooltip: { y: { formatter: (val) => `${val.toFixed(1)}%` } },
        grid: { borderColor: '#334155', strokeDashArray: 4 },
    };

    const trendLineSeries = analytics ? [{
        name: 'Attendance Rate (%)',
        data: analytics.monthlyTotals
            .filter(m => m.employeeCount > 0)
            .map(m => {
                const total = m.totalPresent + m.totalSick + m.totalAbsent;
                return total > 0 ? parseFloat(((m.totalPresent / total) * 100).toFixed(1)) : 0;
            })
    }] : [];

    const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
        >
            <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-opacity-10 ${color}`}>
                <Icon className={`text-xl ${color.replace('bg-', 'text-')}`} />
            </div>
            <div className="mt-4 flex items-end justify-between">
                <div>
                    <h4 className="text-2xl font-bold text-black dark:text-white">{value}</h4>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
            </div>
        </motion.div>
    );

    const totalDays = analytics ? analytics.totals.totalPresent + analytics.totals.totalSick + analytics.totals.totalAbsent : 0;
    const attendanceRate = totalDays > 0 ? ((analytics.totals.totalPresent / totalDays) * 100).toFixed(1) : '0.0';

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName="Attendance Analytics" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Year Filter */}
                <div className="mb-6 flex items-center gap-4">
                    <label className="text-black dark:text-white font-medium">Year:</label>
                    <div className="relative">
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="appearance-none rounded border border-stroke bg-transparent py-2 px-6 pr-10 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                        >
                            {(availableYears.length > 0 ? availableYears : [2024, 2025, 2026]).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <MdOutlineKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 text-xl pointer-events-none" />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark animate-pulse">
                                <div className="h-11 w-11 rounded-full bg-gray-200 dark:bg-gray-700" />
                                <div className="mt-4">
                                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : analytics && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatCard
                                title="Total Present Days"
                                value={analytics.totals.totalPresent.toLocaleString()}
                                icon={FaUserCheck}
                                color="bg-meta-3"
                                subtitle={`${attendanceRate}% attendance rate`}
                            />
                            <StatCard
                                title="Total Sick Days"
                                value={analytics.totals.totalSick.toLocaleString()}
                                icon={FaThermometerHalf}
                                color="bg-warning"
                                subtitle={`${totalDays > 0 ? ((analytics.totals.totalSick / totalDays) * 100).toFixed(1) : 0}% of total`}
                            />
                            <StatCard
                                title="Total Absent Days"
                                value={analytics.totals.totalAbsent.toLocaleString()}
                                icon={FaUserTimes}
                                color="bg-danger"
                                subtitle={`${totalDays > 0 ? ((analytics.totals.totalAbsent / totalDays) * 100).toFixed(1) : 0}% of total`}
                            />
                            <StatCard
                                title="Perfect Attendance"
                                value={analytics.perfectAttendance.length}
                                icon={FaTrophy}
                                color="bg-primary"
                                subtitle="Employees with 0 absences"
                            />
                        </div>

                        {/* Charts Row 1 */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="col-span-2 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                                <h5 className="text-xl font-semibold text-black dark:text-white mb-4">
                                    Monthly Attendance Breakdown — {selectedYear}
                                </h5>
                                {monthlyBarSeries[0]?.data?.length > 0 ? (
                                    <ReactApexChart options={monthlyBarOptions} series={monthlyBarSeries} type="bar" height={350} />
                                ) : (
                                    <p className="text-center text-gray-500 py-20">No attendance data available for {selectedYear}</p>
                                )}
                            </div>

                            <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                                <h5 className="text-xl font-semibold text-black dark:text-white mb-4">
                                    Overall Distribution
                                </h5>
                                {donutSeries.some(v => v > 0) ? (
                                    <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={350} />
                                ) : (
                                    <p className="text-center text-gray-500 py-20">No data</p>
                                )}
                            </div>
                        </div>

                        {/* Charts Row 2 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                                <h5 className="text-xl font-semibold text-black dark:text-white mb-4">
                                    Attendance Rate Trend
                                </h5>
                                {trendLineSeries[0]?.data?.length > 0 ? (
                                    <ReactApexChart options={trendLineOptions} series={trendLineSeries} type="area" height={300} />
                                ) : (
                                    <p className="text-center text-gray-500 py-20">No data</p>
                                )}
                            </div>

                            {/* Top Absentees */}
                            <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark">
                                <h5 className="text-xl font-semibold text-black dark:text-white mb-4">
                                    Top 5 Employees by Absences
                                </h5>
                                {analytics.topAbsentees.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full table-auto">
                                            <thead>
                                                <tr className="bg-gray-2 dark:bg-meta-4">
                                                    <th className="py-3 px-4 text-left font-medium text-black dark:text-white">#</th>
                                                    <th className="py-3 px-4 text-left font-medium text-black dark:text-white">Employee</th>
                                                    <th className="py-3 px-4 text-center font-medium text-black dark:text-white">Absent</th>
                                                    <th className="py-3 px-4 text-center font-medium text-black dark:text-white">Sick</th>
                                                    <th className="py-3 px-4 text-center font-medium text-black dark:text-white">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {analytics.topAbsentees.map((emp, idx) => (
                                                    <tr key={emp.nik} className="border-b border-stroke dark:border-strokedark">
                                                        <td className="py-3 px-4 text-black dark:text-white">{idx + 1}</td>
                                                        <td className="py-3 px-4">
                                                            <p className="text-black dark:text-white font-medium">{emp.employee_name}</p>
                                                            <p className="text-xs text-gray-500">ID: {emp.nik}</p>
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <span className="inline-block rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                                                                {emp.totalAbsent}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <span className="inline-block rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                                                                {emp.totalSick}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-center font-bold text-black dark:text-white">
                                                            {emp.totalAbsent + emp.totalSick}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-20">No absentees recorded</p>
                                )}
                            </div>
                        </div>

                        {/* Perfect Attendance List */}
                        {analytics.perfectAttendance.length > 0 && (
                            <div className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
                                <h5 className="text-xl font-semibold text-black dark:text-white mb-4">
                                    Perfect Attendance Employees
                                </h5>
                                <div className="flex flex-wrap gap-3">
                                    {analytics.perfectAttendance.map(emp => (
                                        <motion.div
                                            key={emp.nik}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-2 rounded-full bg-meta-3 bg-opacity-10 py-2 px-4"
                                        >
                                            <FaTrophy className="text-meta-3" />
                                            <span className="text-sm font-medium text-meta-3">{emp.employee_name}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </DefaultLayoutAdmin>
    );
};

export default AttendanceAnalytics;
