import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartTwo = ({ statusData }) => {
  const permanent = statusData?.permanent || 0;
  const contract = statusData?.contract || 0;

  const series = [permanent, contract];
  const options = {
    chart: { fontFamily: 'Satoshi, sans-serif', type: 'donut' },
    colors: ['#3C50E0', '#0FADCF'],
    labels: ['Permanent Employee', 'Contract Employee'],
    legend: { show: false, position: 'bottom' },
    plotOptions: {
      pie: { donut: { size: '65%', background: 'transparent' } },
    },
    dataLabels: { enabled: false },
    responsive: [
      { breakpoint: 2600, options: { chart: { width: 380 } } },
      { breakpoint: 640, options: { chart: { width: 200 } } },
    ],
  };

  return (
    <div className='col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5'>
      <div className='mb-3 justify-between gap-4 sm:flex'>
        <div>
          <h5 className='text-xl font-semibold text-black dark:text-white'>Employee Status</h5>
        </div>
      </div>
      <div className='mb-2'>
        <div id='chartTwo' className='mx-auto flex justify-center'>
          <ReactApexChart options={options} series={series} type='donut' />
        </div>
      </div>
      <div className='-mx-8 flex flex-wrap items-center justify-center gap-y-3'>
        <div className='w-full px-8 sm:w-1/2'>
          <div className='flex w-full items-center'>
            <span className='mr-2 block h-3 w-full max-w-3 rounded-full bg-primary'></span>
            <p className='flex w-full justify-between text-sm font-medium text-black dark:text-white'>
              <span>Permanent</span>
              <span>{permanent}</span>
            </p>
          </div>
        </div>
        <div className='w-full px-8 sm:w-1/2'>
          <div className='flex w-full items-center'>
            <span className='mr-2 block h-3 w-full max-w-3 rounded-full bg-[#0FADCF]'></span>
            <p className='flex w-full justify-between text-sm font-medium text-black dark:text-white'>
              <span>Contract</span>
              <span>{contract}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
