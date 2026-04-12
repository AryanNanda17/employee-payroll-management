import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from '../../../../api/axios';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutEmployee';
import { BreadcrumbEmployee } from '../../../../components';
import { TfiLock } from 'react-icons/tfi';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ChangePasswordEmployee = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.patch('/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      toast.success(response.data?.msg || 'Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const msg = error.response?.data?.msg || 'Failed to change password';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordFields = [
    { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password', visibilityKey: 'current' },
    { name: 'newPassword', label: 'New Password', placeholder: 'Enter new password', visibilityKey: 'new' },
    { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Re-enter new password', visibilityKey: 'confirm' },
  ];

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbEmployee pageName="Change Password" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-xl"
      >
        <div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                <TfiLock className="text-lg text-primary" />
              </div>
              <h3 className="font-semibold text-black dark:text-white">
                Change Password
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6.5 space-y-5">
              {passwordFields.map((field, idx) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.1, duration: 0.4 }}
                >
                  <label className="mb-2.5 block text-black dark:text-white">
                    {field.label} <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords[field.visibilityKey] ? 'text' : 'password'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 pr-12 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(field.visibilityKey)}
                      className="absolute right-4 top-3.5 text-body dark:text-bodydark hover:text-primary"
                    >
                      {showPasswords[field.visibilityKey] ? (
                        <FiEyeOff className="text-lg" />
                      ) : (
                        <FiEye className="text-lg" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}

              <motion.button
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full cursor-pointer rounded-lg bg-primary p-3 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </DefaultLayoutEmployee>
  );
};

export default ChangePasswordEmployee;
