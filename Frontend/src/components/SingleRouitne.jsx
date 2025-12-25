import React, { useState } from 'react'
import { motion } from 'framer-motion';
import ViewRoutine from './ViewRoutine';

function SingleRouitne({data}) {
  const [showRoutine,setShowRoutine]=useState(false);

  function changeShowRoutine(){
      setShowRoutine(!showRoutine);
    }

  return (
    <div className="my-3 bg-gray-50 dark:bg-gray-900 transition-colors 
    duration-300 hover:cursor-pointer">
      <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 w-full "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >

          {/* Members Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-lg dark:border-gray-700 "
          onClick={()=>{changeShowRoutine()}}
          >
              <div className="bg-gray-50 dark:bg-gray-800 flex justify-between">
                  <div className='flex justify-between w-[30%]'>
                    <div className="px-6 py-3 text-lg font-bold text-gray-700 dark:text-gray-200 tracking-wider">
                    {data.member.name}
                    </div>
                    <div className="px-6 py-3  text-sm text-gray-700 dark:text-gray-400 tracking-wider">
                     {data.member.enrollmentId}
                    </div>
                  </div>
                  <div className="px-6 py-3  text-lg font-bold text-gray-700 dark:text-gray-200 tracking-wider">
                    {data.name}
                  </div>
                  {/* <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th> */}
              </div>
              {showRoutine && (
                <ViewRoutine routine={data} memberName={data?.member?.name}/>
              )}
          </div>

          
        </motion.div>
    </div>
  )
}

export default SingleRouitne