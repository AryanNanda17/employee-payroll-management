import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartOne = ({ genderData }) => {
  const maleCount = genderData?.male || 0;
  const femaleCount = genderData?.female || 0;

  const series = [
    { name: 'Male', data: [maleCount] },
    { name: 'Female', data: [femaleCount] },
  ];

  const options = {
    legend: { show: true, position: 'top', horizontalAlign: 'left' },
    colors: ['#3C50E0', '#80CAEE'],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 335,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%', borderRadius: 6 },
    },
    dataLabels: { enabled: true },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: ['Employees'] },
    yaxis: { title: { text: 'Count' } },
    fill: { opacity: 1 },
    tooltip: {
      y: { formatter: (val) => val + ' employees' },
    },
  };

  return (
    <div className='col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8'>
      <div className='flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap'>
        <div className='flex w-full flex-wrap gap-3 sm:gap-5'>
          <div className='flex min-w-47.5'>
            <span className='mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary'>
              <span className='block h-2.5 w-full max-w-2.5 rounded-full bg-primary'></span>
            </span>
            <div className='w-full'>
              <p className='font-semibold text-primary'>Male Employees</p>
              <p className='text-sm font-medium'>{maleCount} total</p>
            </div>
          </div>
          <div className='flex min-w-47.5'>
            <span className='mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary'>
              <span className='block h-2.5 w-full max-w-2.5 rounded-full bg-secondary'></span>
            </span>
            <div className='w-full'>
              <p className='font-semibold text-secondary'>Female Employees</p>
              <p className='text-sm font-medium'>{femaleCount} total</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id='chartOne' className='-ml-5'>
          <ReactApexChart options={options} series={series} type='bar' height={350} />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
