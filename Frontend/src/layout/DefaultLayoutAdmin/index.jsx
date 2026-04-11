import React, { useState } from 'react';
import { SidebarAdmin, HeaderAdmin, Footer } from '../../components';

const DefaultLayoutAdmin = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='dark:bg-boxdark-2 dark:text-bodydark'>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className='flex h-screen overflow-hidden print:block print:h-auto print:overflow-visible'>
        {/* <!-- ===== Sidebar Start ===== --> */}
        <div className="print:hidden">
          <SidebarAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden print:overflow-visible'>
          {/* <!-- ===== Header Start ===== --> */}
          <div className="print:hidden">
            <HeaderAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10'>
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
          <Footer />
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  )
}

export default DefaultLayoutAdmin;
