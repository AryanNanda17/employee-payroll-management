import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../../../api/axios';
import DefaultLayoutEmployee from '../../../layout/DefaultLayoutEmployee';
import { BreadcrumbEmployee } from '../../../components';
import {
  HiOutlineUser,
  HiOutlineIdentification,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineStatusOnline,
} from 'react-icons/hi';

const InfoRow = ({ icon: Icon, label, value, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
    className="flex items-center gap-4 py-3 border-b border-stroke dark:border-strokedark last:border-0"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
      <Icon className="text-lg text-primary" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-body dark:text-bodydark">{label}</p>
      <p className="font-medium text-black dark:text-white">{value || '-'}</p>
    </div>
  </motion.div>
);

const DashboardEmployee = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/my/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const profileFields = profile
    ? [
        { icon: HiOutlineUser, label: 'Full Name', value: profile.employee_name },
        { icon: HiOutlineIdentification, label: 'Employee ID', value: profile.nik },
        { icon: HiOutlineBriefcase, label: 'Position', value: profile.position?.position_name || '-' },
        { icon: HiOutlineStatusOnline, label: 'Status', value: profile.status },
        { icon: HiOutlineUser, label: 'Gender', value: profile.gender },
        { icon: HiOutlineCalendar, label: 'Join Date', value: profile.join_date },
      ]
    : [];

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbEmployee pageName="Dashboard" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-stroke bg-gradient-to-r from-primary to-primary/80 p-6 shadow-default dark:border-strokedark"
          >
            <h2 className="text-2xl font-bold text-white">
              Welcome back, {profile?.employee_name || 'Employee'}!
            </h2>
            <p className="mt-2 text-white/80">
              You are logged in as an employee. Here is your profile information.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
              Profile Details
            </h3>
            <div className="space-y-1">
              {profileFields.map((field, idx) => (
                <InfoRow key={field.label} index={idx} {...field} />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </DefaultLayoutEmployee>
  );
};

export default DashboardEmployee;
