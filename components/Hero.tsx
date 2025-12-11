import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-emerald-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-30"
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
          alt="Land landscape"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-emerald-800 mix-blend-multiply" />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Buy land with <span className="text-emerald-400">vision</span>.
        </h1>
        <p className="mt-6 text-xl text-emerald-100 max-w-3xl">
          The first no-broker marketplace that helps you see what's possible. 
          Use AI to visualize construction, estimate costs, and uncover risks before you buy.
        </p>
      </div>
    </div>
  );
};

export default Hero;