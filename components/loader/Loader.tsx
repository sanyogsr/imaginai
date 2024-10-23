import React from "react";
import "./loader.css";
const AnimatedDevice = () => {
  return (
    <div className="grid place-items-center    transition-colors duration-300">
      <div className="relative w-32 h-32">
        {/* Main device body (device__a) */}
        <div
          className="absolute top-0 w-32 h-20 bg-neutral-300 dark:bg-neutral-700 shadow-[inset_0_0_0_0.25em] shadow-current rounded-md z-10 
          animate-[device-a_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        >
          {/* device__a-1 */}
          <div
            className="absolute top-[2.25em] left-[1.5em] w-4 h-1 bg-neutral-900 dark:bg-neutral-100 rounded-sm invisible
            animate-[device-a-1_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
          ></div>

          {/* device__a-2 */}
          <div
            className="absolute top-[0.625em] right-0 w-1 h-3 bg-neutral-900 dark:bg-neutral-100 rounded-sm invisible
            animate-[device-a-2_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
          ></div>
        </div>

        {/* device__b */}
        <div
          className="absolute top-[2.25em] left-[1.875em] w-1 h-4 bg-neutral-900 dark:bg-neutral-100 rounded-sm
          animate-[device-b_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        ></div>

        {/* device__c */}
        <div
          className="absolute top-12 left-4 w-8 h-1 bg-neutral-900 dark:bg-neutral-100 rounded-sm
          animate-[device-c_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        ></div>

        {/* device__d */}
        <div
          className="absolute top-3 left-5 w-6 h-3.5 bg-neutral-300 dark:bg-neutral-700 shadow-[inset_0_0_0_0.25em] shadow-current rounded-t-md invisible
          animate-[device-d_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        ></div>

        {/* device__e */}
        <div
          className="absolute top-[1.625em] left-5 w-6 h-3.5 bg-neutral-300 dark:bg-neutral-700 shadow-[inset_0_0_0_0.25em] shadow-current rounded-b-md invisible
          animate-[device-e_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        ></div>

        {/* device__f */}
        <div
          className="absolute bottom-0 left-4 w-8 h-1 bg-neutral-900 dark:bg-neutral-100 rounded-sm opacity-50 blur-[0.375em]
          animate-[device-f_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        ></div>

        {/* device__g */}
        <div
          className="absolute bottom-0 left-0 w-32 h-1 bg-neutral-900 dark:bg-neutral-100 rounded-sm opacity-0 blur-[0.375em]
          animate-[device-g_3s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        ></div>
      </div>
    </div>
  );
};

export default AnimatedDevice;
