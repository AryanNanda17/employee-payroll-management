import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { TfiEye } from 'react-icons/tfi';
import axios from '../../../../api/axios';

const ITEMS_PER_PAGE = 10;
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const YEARS = [2024, 2025, 2026];

const AttendanceData = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [displayMonth, setDisplayMonth] = useState('');
    const [displayYear, setDisplayYear] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [positions, setPositions] = useState([]);
    const [formData, setFormData] = useState({
        month: '', year: '', nik: '', employee_name: '', gender: '',
        position_name: '', present: '', sick: '', absent: '',
    });

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [empRes, posRes] = await Promise.all([
                    axios.get('/employees'),
                    axios.get('/positions')
                ]);
                setEmployees(empRes.data);
                setPositions(posRes.data);
            } catch { /* ignore */ }
        };
        fetchMeta();
    }, []);

    const fetchAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/attendance?month=${selectedMonth}&year=${selectedYear}`);
            setAttendanceData(data);
            setFilteredData(data);
            setDisplayMonth(selectedMonth);
            setDisplayYear(selectedYear);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch attendance data');
        } finally {
            setLoading(false);
        }
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = attendanceData.filter(
            (a) =>
                (a.nik || '').toLowerCase().includes(q) ||
                (a.employee_name || '').toLowerCase().includes(q)
        );
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchQuery, attendanceData]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleShowData = (e) => {
        e.preventDefault();
        if (!selectedMonth || !selectedYear) {
            toast.error('Please select month and year');
            return;
        }
        fetchAttendance();
    };

    const openAddModal = () => {
        setEditId(null);
        setFormData({
            month: selectedMonth || '', year: selectedYear || '',
            nik: '', employee_name: '', gender: '',
            position_name: '', present: '', sick: '', absent: ''
        });
        setShowModal(true);
    };

    const openEditModal = (item) => {
        setEditId(item.id);
        setFormData({
            month: item.month || '',
            year: item.year || '',
            nik: item.nik || '',
            employee_name: item.employee_name || '',
            gender: item.gender || '',
            position_name: item.position_name || '',
            present: item.present ?? '',
            sick: item.sick ?? '',
            absent: item.absent ?? '',
        });
        setShowModal(true);
    };

    const handleEmployeeSelect = (nik) => {
        const emp = employees.find(e => e.nik === nik);
        if (emp) {
            const posName = emp.position?.position_name || '';
            setFormData(prev => ({
                ...prev,
                nik: emp.nik,
                employee_name: emp.employee_name,
                gender: emp.gender,
                position_name: posName
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editId) {
                await axios.patch(`/attendance/update/${editId}`, formData);
                toast.success('Attendance updated successfully');
            } else {
                await axios.post('/attendance', formData);
                toast.success('Attendance added successfully');
            }
            setShowModal(false);
            if (displayMonth && displayYear) fetchAttendance();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/attendance/${id}`);
            toast.success('Attendance deleted successfully');
            setDeleteId(null);
            if (displayMonth && displayYear) fetchAttendance();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to delete');
        }
    };

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
                <td key={i} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName="Employee Attendance Data" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 mt-6">
                    <div className="border-b border-stroke py-2 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Filter Employee Attendance Data</h3>
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
                                <ButtonOne onClick={handleShowData}>
                                    <span>Show Data</span>
                                    <span><TfiEye /></span>
                                </ButtonOne>
                            </div>
                            <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
                                <ButtonOne onClick={openAddModal}>
                                    <span>Input Attendance</span>
                                    <span><FaPlus /></span>
                                </ButtonOne>
                            </div>
                        </div>
                    </div>

                    {displayMonth && displayYear && (
                        <div className="bg-gray-2 text-left dark:bg-meta-4 mt-6">
                            <h2 className="px-4 py-2 text-black dark:text-white">
                                Showing employee attendance data for month:
                                <span className="font-medium"> {displayMonth}</span> Year:
                                <span className="font-medium"> {displayYear}</span>
                            </h2>
                        </div>
                    )}
                </div>

                {(displayMonth && displayYear) && (
                    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                        <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                            <div className="relative flex-2 mb-4 md:mb-0">
                                <input
                                    type="text"
                                    placeholder="Type to search.."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                                <span className="absolute left-2 py-3 text-xl"><BiSearch /></span>
                            </div>
                        </div>

                        <div className="max-w-full overflow-x-auto py-4">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Employee ID</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Employee Name</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Gender</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Position</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Present</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Sick</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Absent</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                    ) : paginatedData.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                                No attendance records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedData.map((item) => (
                                            <tr key={item.id}>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.nik}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.employee_name}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.gender}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.position_name}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.present}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.sick}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <p className="text-black dark:text-white">{item.absent}</p>
                                                </td>
                                                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                    <div className="flex items-center space-x-3.5">
                                                        <button onClick={() => openEditModal(item)} className="hover:text-black">
                                                            <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                        </button>
                                                        <button onClick={() => setDeleteId(item.id)} className="hover:text-black">
                                                            <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                                        </button>
                                                    </div>
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

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
                    >
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                            {editId ? 'Edit Attendance' : 'Input Attendance'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-black dark:text-white">Month</label>
                                    <select
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                        required
                                        className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    >
                                        <option value="">Select</option>
                                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-black dark:text-white">Year</label>
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        required
                                        className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    >
                                        <option value="">Select</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-black dark:text-white">Employee</label>
                                <select
                                    value={formData.nik}
                                    onChange={(e) => handleEmployeeSelect(e.target.value)}
                                    required={!editId}
                                    disabled={!!editId}
                                    className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input disabled:opacity-60"
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.nik} value={emp.nik}>
                                            {emp.employee_name} ({emp.nik})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {editId && (
                                <>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-black dark:text-white">Employee Name</label>
                                        <input type="text" value={formData.employee_name} disabled className="w-full rounded border border-stroke bg-transparent py-2 px-4 opacity-60 dark:border-form-strokedark dark:bg-form-input" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-black dark:text-white">Position</label>
                                        <input type="text" value={formData.position_name} disabled className="w-full rounded border border-stroke bg-transparent py-2 px-4 opacity-60 dark:border-form-strokedark dark:bg-form-input" />
                                    </div>
                                </>
                            )}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-black dark:text-white">Present</label>
                                    <input
                                        type="number" min="0" max="31"
                                        value={formData.present}
                                        onChange={(e) => setFormData({ ...formData, present: e.target.value })}
                                        required
                                        className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-black dark:text-white">Sick</label>
                                    <input
                                        type="number" min="0" max="31"
                                        value={formData.sick}
                                        onChange={(e) => setFormData({ ...formData, sick: e.target.value })}
                                        required
                                        className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-black dark:text-white">Absent</label>
                                    <input
                                        type="number" min="0" max="31"
                                        value={formData.absent}
                                        onChange={(e) => setFormData({ ...formData, absent: e.target.value })}
                                        required
                                        className="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded border border-stroke text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-4 py-2 rounded bg-primary text-white hover:bg-opacity-90 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : editId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this attendance record?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded border border-stroke text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="px-4 py-2 rounded bg-danger text-white hover:bg-opacity-90"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayoutAdmin>
    );
};

export default AttendanceData;
