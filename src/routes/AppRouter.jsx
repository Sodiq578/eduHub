import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import Teachers from '../pages/Teachers';
import Classes from '../pages/Classes';
import Subjects from '../pages/Subjects';
import Attendance from '../pages/Attendance';
import Grades from '../pages/Grades';
import Payments from '../pages/Payments';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/subjects" element={<Subjects />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/grades" element={<Grades />} />
      <Route path="/payments" element={<Payments />} />
      
      {/* Agar kerak bo'lsa 404 qo'shsa bo'ladi */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default AppRouter;