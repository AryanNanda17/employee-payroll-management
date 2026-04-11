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

const formatRupiah = (number) => {
    return `Rs. ${Number(number).toLocaleString('en-IN')}`;
};

const PositionData = () => {
    const [positions, setPositions] = useState([]);
    const [filteredPositions, setFilteredPositions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    const fetchPositions = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/positions');
            setPositions(data);
            setFilteredPositions(data);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch positions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPositions();
    }, [fetchPositions]);

    useEffect(() => {
        const q = searchQuery.toLowerCase();
        const filtered = positions.filter(
            (p) => (p.position_name || '').toLowerCase().includes(q)
        );
        setFilteredPositions(filtered);
        setCurrentPage(1);
    }, [searchQuery, positions]);

    const totalPages = Math.ceil(filteredPositions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredPositions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/positions/${id}`);
            toast.success('Position deleted successfully');
            setDeleteId(null);
            fetchPositions();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to delete position');
        }
    };

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
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName="Position Data" />
            <Link to="/admin/master-data/positions/position-form">
                <ButtonOne>
                    <span>Add Position</span>
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
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Position</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Basic Salary</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Transport Allowance</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Meal Allowance</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Total</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No positions found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((pos) => {
                                    const total = Number(pos.basic_salary || 0) + Number(pos.transport_allowance || 0) + Number(pos.meal_allowance || 0);
                                    return (
                                        <tr key={pos.id}>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{pos.position_name}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{formatRupiah(pos.basic_salary)}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{formatRupiah(pos.transport_allowance)}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{formatRupiah(pos.meal_allowance)}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white font-semibold">{formatRupiah(total)}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <button
                                                        onClick={() => navigate(`/admin/master-data/positions/position-form?id=${pos.id}`)}
                                                        className="hover:text-black"
                                                    >
                                                        <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(pos.id)}
                                                        className="hover:text-black"
                                                    >
                                                        <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                            Showing {filteredPositions.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredPositions.length)} of {filteredPositions.length} positions
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
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this position? This action cannot be undone.</p>
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

export default PositionData;
