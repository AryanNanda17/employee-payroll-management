import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import axios from '../../../../api/axios';

const ITEMS_PER_PAGE = 10;

const EmployeeData = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/employees');
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = employees.filter(
            (e) =>
                (e.nik || '').toLowerCase().includes(q) ||
                (e.employee_name || '').toLowerCase().includes(q) ||
                (e.gender || '').toLowerCase().includes(q)
        );
        setFilteredEmployees(filtered);
        setCurrentPage(1);
    }, [searchQuery, employees]);

    const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/employees/${id}`);
            toast.success('Employee deleted successfully');
            setDeleteId(null);
            fetchEmployees();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to delete employee');
        }
    };

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {Array.from({ length: 9 }).map((_, i) => (
                <td key={i} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName="Employee Data" />
            <Link to="/admin/master-data/employees/employee-form">
                <ButtonOne>
                    <span>Add Employee</span>
                    <span><FaPlus /></span>
                </ButtonOne>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6"
            >
                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="relative flex-2 mb-4 md:mb-0">
                        <input
                            type="text"
                            placeholder="Type to search.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                        <span className="absolute left-2 py-3 text-xl">
                            <BiSearch />
                        </span>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto py-4">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Photo</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Employee ID</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Employee Name</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Position</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Gender</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Join Date</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Access Rights</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((emp) => (
                                    <tr key={emp.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                            <div className="h-12 w-12 rounded-full overflow-hidden">
                                                <img
                                                    src={emp.url}
                                                    alt={emp.employee_name}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                                />
                                            </div>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{emp.nik}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{emp.employee_name}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{emp.position?.position_name || '-'}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{emp.gender}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{emp.join_date}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{emp.status}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{emp.role}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <button
                                                    onClick={() => navigate(`/admin/master-data/employees/employee-form?id=${emp.id}`)}
                                                    className="hover:text-black"
                                                >
                                                    <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(emp.id)}
                                                    className="hover:text-black"
                                                >
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
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                            Showing {filteredEmployees.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredEmployees.length)} of {filteredEmployees.length} employees
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

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this employee? This action cannot be undone.</p>
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

export default EmployeeData;
