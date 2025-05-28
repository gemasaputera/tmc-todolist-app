import React from 'react';
import { HiArrowPath } from 'react-icons/hi2';

const LoadingPage = () => {
  return (
    <div className='flex justify-center py-8'>
      <HiArrowPath className='w-8 h-8 text-orange-700 animate-spin' />
    </div>
  );
};

export default LoadingPage;
