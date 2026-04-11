import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import NotFound from '../../components/molecules/NotFound';
import FormEmployeeData from '../../components/molecules/Form/FormEmployeeData';
import FormPositionData from '../../components/molecules/Form/FormPositionData';
import FormSalaryDeduction from '../../components/molecules/Form/FormSalaryDeduction';
import {
  LoginAdmin, DashboardAdmin, EmployeeData, PositionData, AttendanceData, SalaryDeductionSettings, SalaryData, SalaryReport,
  AttendanceReport, Payslip, AttendanceAnalytics, ChangePasswordAdmin, PayrollProcessing, LeaveManagement,
  LoginEmployee, DashboardEmployee, SalaryDataEmployee, ChangePasswordEmployee, LeaveEmployee, AttendanceEmployee
} from '../../pages';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route exact path="/" element={<LoginAdmin />} />
      <Route exact path="/admin/login" element={<LoginAdmin />} />
      <Route exact path="/employee/login" element={<LoginEmployee />} />

      {/* Admin Routes */}
      <Route exact path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="admin"><DashboardAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/master-data/employees" element={
        <ProtectedRoute requiredRole="admin"><EmployeeData /></ProtectedRoute>
      } />
      <Route path="/admin/master-data/employees/employee-form" element={
        <ProtectedRoute requiredRole="admin"><FormEmployeeData /></ProtectedRoute>
      } />
      <Route path="/admin/master-data/positions" element={
        <ProtectedRoute requiredRole="admin"><PositionData /></ProtectedRoute>
      } />
      <Route path="/admin/master-data/positions/position-form" element={
        <ProtectedRoute requiredRole="admin"><FormPositionData /></ProtectedRoute>
      } />
      <Route path="/admin/transactions/attendance" element={
        <ProtectedRoute requiredRole="admin"><AttendanceData /></ProtectedRoute>
      } />
      <Route path="/admin/transactions/salary-deductions" element={
        <ProtectedRoute requiredRole="admin"><SalaryDeductionSettings /></ProtectedRoute>
      } />
      <Route path="/admin/transactions/salary-deductions/salary-deduction-form" element={
        <ProtectedRoute requiredRole="admin"><FormSalaryDeduction /></ProtectedRoute>
      } />
      <Route path="/admin/transactions/salary-data" element={
        <ProtectedRoute requiredRole="admin"><SalaryData /></ProtectedRoute>
      } />
      <Route path="/admin/reports/salary-report" element={
        <ProtectedRoute requiredRole="admin"><SalaryReport /></ProtectedRoute>
      } />
      <Route path="/admin/reports/attendance-report" element={
        <ProtectedRoute requiredRole="admin"><AttendanceReport /></ProtectedRoute>
      } />
      <Route path="/admin/reports/payslip" element={
        <ProtectedRoute requiredRole="admin"><Payslip /></ProtectedRoute>
      } />
      <Route path="/admin/reports/attendance-analytics" element={
        <ProtectedRoute requiredRole="admin"><AttendanceAnalytics /></ProtectedRoute>
      } />
      <Route path="/admin/transactions/payroll" element={
        <ProtectedRoute requiredRole="admin"><PayrollProcessing /></ProtectedRoute>
      } />
      <Route path="/admin/leave-management" element={
        <ProtectedRoute requiredRole="admin"><LeaveManagement /></ProtectedRoute>
      } />
      <Route path="/admin/settings/change-password" element={
        <ProtectedRoute requiredRole="admin"><ChangePasswordAdmin /></ProtectedRoute>
      } />

      {/* Employee Routes (accessible by both employee and admin) */}
      <Route exact path="/employee/dashboard" element={
        <ProtectedRoute requiredRole="employee"><DashboardEmployee /></ProtectedRoute>
      } />
      <Route exact path="/employee/salary-data" element={
        <ProtectedRoute requiredRole="employee"><SalaryDataEmployee /></ProtectedRoute>
      } />
      <Route exact path="/employee/attendance" element={
        <ProtectedRoute requiredRole="employee"><AttendanceEmployee /></ProtectedRoute>
      } />
      <Route exact path="/employee/leave" element={
        <ProtectedRoute requiredRole="employee"><LeaveEmployee /></ProtectedRoute>
      } />
      <Route exact path="/employee/settings/change-password" element={
        <ProtectedRoute requiredRole="employee"><ChangePasswordEmployee /></ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
