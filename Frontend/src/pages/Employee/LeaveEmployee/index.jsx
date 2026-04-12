import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DefaultLayoutEmployee from '../../../layout/DefaultLayoutEmployee';
import { BreadcrumbEmployee } from '../../../components';
import axios from '../../../api/axios';

const TABS = ['Apply for Leave', 'My Leave Requests'];

const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400',
};

const LeaveEmployee = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [balances, setBalances] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState({ types: true, balances: true, requests: true });
    const [submitting, setSubmitting] = useState(false);
    const [expandedReason, setExpandedReason] = useState(null);
    const [form, setForm] = useState({
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const fetchLeaveTypes = useCallback(async () => {
        try {
            const { data } = await axios.get('/leave/types');
            setLeaveTypes(data);
        } catch {
            toast.error('Failed to load leave types');
        } finally {
            setLoading((prev) => ({ ...prev, types: false }));
        }
    }, []);

    const fetchBalances = useCallback(async () => {
        try {
            const { data } = await axios.get('/leave/my-balance');
            setBalances(data);
        } catch {
            toast.error('Failed to load leave balances');
        } finally {
            setLoading((prev) => ({ ...prev, balances: false }));
        }
    }, []);

    const fetchRequests = useCallback(async () => {
        try {
            const { data } = await axios.get('/leave/my-requests');
            setRequests(data);
        } catch {
            toast.error('Failed to load leave requests');
        } finally {
            setLoading((prev) => ({ ...prev, requests: false }));
        }
    }, []);

    useEffect(() => {
        fetchLeaveTypes();
        fetchBalances();
        fetchRequests();
    }, [fetchLeaveTypes, fetchBalances, fetchRequests]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.leave_type || !form.start_date || !form.end_date || !form.reason.trim()) {
            toast.error('Please fill in all fields');
            return;
        }
        setSubmitting(true);
        try {
            const { data } = await axios.post('/leave/apply', form);
            toast.success(data.msg || 'Leave request submitted successfully');
            setForm({ leave_type: '', start_date: '', end_date: '', reason: '' });
            fetchBalances();
            fetchRequests();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to submit leave request');
        } finally {
            setSubmitting(false);
        }
    };

    const SkeletonRow = () => (
        <tr className="animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
                <td key={i} className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );

    return (
        <DefaultLayoutEmployee>
            <BreadcrumbEmployee pageName="Leave Management" />

            <div className="mt-4 flex gap-2">
                {TABS.map((tab, idx) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(idx)}
                        className={`rounded-lg px-5 py-2.5 font-medium text-sm transition-colors ${
                            activeTab === idx
                                ? 'bg-primary text-white'
                                : 'border border-stroke bg-white text-black hover:bg-gray-100 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 0 && (
                <div className="mt-6 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
                    >
                        <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                            Leave Balance
                        </h3>
                        {loading.balances ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="animate-pulse rounded-lg border border-stroke p-4 dark:border-strokedark">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                    </div>
                                ))}
                            </div>
                        ) : balances.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No leave balance data available.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {balances.map((b, idx) => (
                                    <motion.div
                                        key={b.leave_type || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.08, duration: 0.3 }}
                                        className="rounded-lg border border-stroke p-4 dark:border-strokedark"
                                    >
                                        <p className="text-sm font-medium text-body dark:text-bodydark">
                                            {b.leave_type}
                                        </p>
                                        <div className="mt-2 flex items-end gap-3">
                                            <span className="text-2xl font-bold text-primary">
                                                {b.remaining ?? '-'}
                                            </span>
                                            <span className="mb-0.5 text-sm text-body dark:text-bodydark">
                                                remaining
                                            </span>
                                        </div>
                                        <div className="mt-2 flex gap-4 text-xs text-body dark:text-bodydark">
                                            <span>Total: {b.total ?? '-'}</span>
                                            <span>Used: {b.used ?? '-'}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
                    >
                        <h3 className="mb-6 text-lg font-semibold text-black dark:text-white">
                            Apply for Leave
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                    Leave Type
                                </label>
                                <select
                                    name="leave_type"
                                    value={form.leave_type}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                                >
                                    <option value="">Select leave type</option>
                                    {leaveTypes.map((type) => (
                                        <option key={type.id} value={type.name}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={form.start_date}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={form.end_date}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                    Reason
                                </label>
                                <textarea
                                    name="reason"
                                    value={form.reason}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Provide a reason for your leave..."
                                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Leave Request'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            {activeTab === 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6"
                >
                    <div className="max-w-full overflow-x-auto py-4">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Leave Type</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Start Date</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">End Date</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Days</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Reason</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Reviewed By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading.requests ? (
                                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                            No leave requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((req) => (
                                        <tr key={req.id}>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{req.leave_type}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{req.start_date}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{req.end_date}</p>
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
                                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColor[req.status] || ''}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{req.reviewed_by || '-'}</p>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </DefaultLayoutEmployee>
    );
};

export default LeaveEmployee;
