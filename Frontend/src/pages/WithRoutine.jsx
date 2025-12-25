import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion';
import SingleRouitne from '../components/SingleRouitne';
import { getAllMemHaveRoutine } from '../serviceFunctions/userRelatedFunc';
import { User } from 'lucide-react';


function WithRoutine() {
  const [activeRoutine,setActiveRoutine]=useState([]);
  const [loading,setLoading]=useState(false);
  

  
  useEffect(()=>{
    const run=async()=>{
      setLoading(true);
      const data=await getAllMemHaveRoutine();
      // console.log("data us",data)
      setActiveRoutine(data);
      setLoading(false);
    }
    run();
  },[])


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Members having routine</h1>
        </motion.div>
        {loading && (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 mx-auto">
          <div className="p-6">
            <div className="text-gray-700 dark:text-slate-200 text-3xl text-center font-bold  my-20">Loading...</div>
          </div>
        </div>
        )}
        {!loading && (
          activeRoutine.map((data,index)=>{
            return (
              <div key={index} className=''><SingleRouitne data={data} /></div>
            )
          })
        )

        }
        {activeRoutine.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <User className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No members found</h3>
            </motion.div>
          )}
      </div>
       
    </div>
  )
}

export default WithRoutine