import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import axios from '../../../api/axios';

const ITEMS_PER_PAGE = 10;
const STATUS_FILTERS = ['all', 'pending', 'approved', 'rejected'];

const STATUS_STYLES = {
    pending: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger',
};

const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const LeaveManagement = () => {
    const [requests, setRequests] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [confirmAction, setConfirmAction] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [expandedReason, setExpandedReason] = useState(null);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const params = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
            const { data } = await axios.get(`/leave/requests${params}`);
            setRequests(data);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    }, [activeFilter]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]);

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleReview = async () => {
        if (!confirmAction) return;
        setSubmitting(true);
        try {
            await axios.patch(`/leave/review/${confirmAction.id}`, { action: confirmAction.action });
            toast.success(`Leave request ${confirmAction.action} successfully`);
            setConfirmAction(null);
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Operation failed');
        } finally {
            setSubmitting(false);
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
            <BreadcrumbAdmin pageName="Leave Management" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6"
            >
                <div className="flex flex-wrap gap-2 mb-6">
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition-colors ${
                                activeFilter === filter
                                    ? 'bg-primary text-white'
                                    : 'border border-stroke bg-transparent text-black hover:bg-primary hover:text-white dark:border-strokedark dark:text-white dark:hover:bg-primary'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <div className="max-w-full overflow-x-auto py-4">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Employee Name</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Leave Type</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">End Date</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Days</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Reason</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No leave requests found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((req) => (
                                    <tr key={req.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{req.employee_name}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white capitalize">{req.leave_type}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{formatDate(req.start_date)}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{formatDate(req.end_date)}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{req.days}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center gap-1.5">
                                                {expandedReason === req.id ? (
                                                    <p className="text-black dark:text-white text-sm">{req.reason}</p>
                                                ) : (
                                                    <p className="text-black dark:text-white text-sm">
                                                        {req.reason?.length > 25 ? req.reason.slice(0, 25) + '...' : req.reason}
                                                    </p>
                                                )}
                                                {req.reason?.length > 25 && (
                                                    <button
                                                        onClick={() => setExpandedReason(expandedReason === req.id ? null : req.id)}
                                                        className="flex-shrink-0 w-6 h-6 rounded-full text-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
                                                        title={expandedReason === req.id ? 'Collapse' : 'View full reason'}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            {expandedReason === req.id ? (
                                                                <polyline points="18 15 12 9 6 15" />
                                                            ) : (
                                                                <>
                                                                    <circle cx="12" cy="12" r="10" />
                                                                    <line x1="12" y1="16" x2="12" y2="12" />
                                                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                                                </>
                                                            )}
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${STATUS_STYLES[req.status] || ''}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            {req.status === 'pending' ? (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => setConfirmAction({ id: req.id, action: 'approved', name: req.employee_name })}
                                                        className="rounded bg-success px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmAction({ id: req.id, action: 'rejected', name: req.employee_name })}
                                                        className="rounded bg-danger px-3 py-1 text-sm font-medium text-white hover:bg-opacity-90"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                        Showing {requests.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, requests.length)} of {requests.length} requests
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
            </motion.div>

            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-boxdark rounded-lg p-6 w-full max-w-sm shadow-xl"
                    >
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                            Confirm {confirmAction.action === 'approved' ? 'Approval' : 'Rejection'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to {confirmAction.action === 'approved' ? 'approve' : 'reject'} the
                            leave request from <span className="font-medium">{confirmAction.name}</span>?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmAction(null)}
                                disabled={submitting}
                                className="px-4 py-2 rounded border border-stroke text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReview}
                                disabled={submitting}
                                className={`px-4 py-2 rounded text-white hover:bg-opacity-90 disabled:opacity-50 ${
                                    confirmAction.action === 'approved' ? 'bg-success' : 'bg-danger'
                                }`}
                            >
                                {submitting ? 'Processing...' : confirmAction.action === 'approved' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </DefaultLayoutAdmin>
    );
};

export default LeaveManagement;
