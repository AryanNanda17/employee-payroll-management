import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import DefaultLayoutEmployee from '../../../layout/DefaultLayoutEmployee';
import { BreadcrumbEmployee } from '../../../components';
import axios from '../../../api/axios';

const SUMMARY_CARDS = [
    { key: 'present', label: 'Total Present', bg: '#16a34a' },
    { key: 'sick', label: 'Total Sick', bg: '#eab308' },
    { key: 'absent', label: 'Total Absent', bg: '#dc2626' },
];

const AttendanceEmployee = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/my/attendance');
            setAttendance(data);
        } catch {
            console.error('Failed to fetch attendance data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    const years = [...new Set(attendance.map((a) => a.year))].sort((a, b) => b - a);
    if (years.length > 0 && !years.includes(selectedYear)) {
        setSelectedYear(years[0]);
    }

    const filtered = attendance.filter((a) => a.year === selectedYear);

    const totals = filtered.reduce(
        (acc, row) => ({
            present: acc.present + (row.present || 0),
            sick: acc.sick + (row.sick || 0),
            absent: acc.absent + (row.absent || 0),
        }),
        { present: 0, sick: 0, absent: 0 }
    );

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
                <td key={i} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );

    return (
        <DefaultLayoutEmployee>
            <BreadcrumbEmployee pageName="Attendance" />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {SUMMARY_CARDS.map((card, idx) => (
                    <motion.div
                        key={card.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        style={{ backgroundColor: card.bg }}
                        className="rounded-xl p-6 shadow-lg"
                    >
                        <p className="text-sm font-semibold text-white">{card.label}</p>
                        <p className="mt-2 text-3xl font-bold text-white">
                            {loading ? '...' : totals[card.key]}
                        </p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                        Attendance Records
                    </h3>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    >
                        {years.length === 0 ? (
                            <option value={selectedYear}>{selectedYear}</option>
                        ) : (
                            years.map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))
                        )}
                    </select>
                </div>

                <div className="max-w-full overflow-x-auto py-4">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Month</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Year</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Present</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Sick</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Absent</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Total Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No attendance records found for {selectedYear}.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((row, idx) => (
                                    <tr key={row.id || idx}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{row.month}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{row.year}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-green-600 dark:text-green-400 font-medium">{row.present}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-yellow-600 dark:text-yellow-400 font-medium">{row.sick}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-red-600 dark:text-red-400 font-medium">{row.absent}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white font-semibold">{(row.present || 0) + (row.sick || 0) + (row.absent || 0)}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </DefaultLayoutEmployee>
    );
};

export default AttendanceEmployee;
