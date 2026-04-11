import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from '../../../api/axios';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ChartOne, ChartTwo } from '../../../components';
import {
  HiOutlineUsers,
  HiOutlineUserGroup,
  HiOutlineBriefcase,
  HiOutlineClipboardList,
} from 'react-icons/hi';

const useCountUp = (end, duration = 1500) => {
  const [count, setCount] = useState(0);
  const prevEnd = useRef(0);

  useEffect(() => {
    if (end === prevEnd.current) return;
    prevEnd.current = end;

    let startTime = null;
    const startVal = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startVal + (end - startVal) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

const StatCard = ({ icon: Icon, label, value, color, index }) => {
  const animatedValue = useCountUp(value);

  const colorMap = {
    blue: { bg: 'bg-primary/10 dark:bg-primary/20', text: 'text-primary', border: 'border-primary/20' },
    green: { bg: 'bg-meta-3/10 dark:bg-meta-3/20', text: 'text-meta-3', border: 'border-meta-3/20' },
    purple: { bg: 'bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/20' },
    orange: { bg: 'bg-meta-5/10 dark:bg-meta-5/20', text: 'text-meta-5', border: 'border-meta-5/20' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className={`rounded-xl border ${c.border} bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark`}
    >
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${c.bg}`}>
          <Icon className={`text-2xl ${c.text}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-body dark:text-bodydark">{label}</p>
          <h4 className="mt-1 text-2xl font-bold text-black dark:text-white">
            {animatedValue}
          </h4>
        </div>
      </div>
    </motion.div>
  );
};

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: HiOutlineUsers, label: 'Total Employees', value: stats?.totalEmployees || 0, color: 'blue' },
    { icon: HiOutlineUserGroup, label: 'Total Admins', value: stats?.totalAdmins || 0, color: 'green' },
    { icon: HiOutlineBriefcase, label: 'Total Positions', value: stats?.totalPositions || 0, color: 'purple' },
    { icon: HiOutlineClipboardList, label: 'Total Attendance', value: stats?.totalAttendance || 0, color: 'orange' },
  ];

  return (
    <DefaultLayoutAdmin>
      <BreadcrumbAdmin pageName="Dashboard" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
            {cards.map((card, idx) => (
              <StatCard key={card.label} index={idx} {...card} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 grid grid-cols-12 gap-6 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"
          >
            <div className="col-span-12 sm:col-span-7">
              <ChartOne genderData={stats?.genderDistribution} />
            </div>
            <div className="col-span-12 sm:col-span-5">
              <ChartTwo statusData={stats?.statusDistribution} />
            </div>
          </motion.div>
        </>
      )}
    </DefaultLayoutAdmin>
  );
};

export default DashboardAdmin;
