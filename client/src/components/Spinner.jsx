import React from 'react';

export const Spinner = ({ fullPage }) => {
  const wrapperClass = fullPage 
    ? "flex items-center justify-center h-screen w-screen" 
    : "flex items-center justify-center";

  return (
    <div className={wrapperClass}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 theme-color"></div>
    </div>
  );
};