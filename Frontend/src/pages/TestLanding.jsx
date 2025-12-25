import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import TakeTest from '../components/TakeTest'
import Taketes from '../components/Taketes'
import ViewTest from '../components/ViewTest'
import { motion } from "framer-motion";
import { useLocation } from 'react-router-dom';
import { fetchUserTests, flattenExerciseList, getSingleUser } from '../serviceFunctions/userRelatedFunc';

function TestLanding() {

  const location=useLocation();
  const enrollmentId=location.pathname.split('/').at(-1);
  const whichPage=location.pathname.split('/').at(-2);
  // console.log(enrollmentId);
  const [user,setUser]=useState();
  const [loading,setLoading]=useState(true);
  const [testEntries,setTestEntries]=useState();

  useEffect(()=>{
    const run=async()=>{
      const res=await getSingleUser(enrollmentId);
      setUser(res);
      if (whichPage !== 'take-test') {
        const userTests = await fetchUserTests(enrollmentId);
        console.log("Test Landing ",userTests);
        const obj={
          "maxWeight":userTests.maxWeight,
          "maxReps":userTests.maxReps
        }
        // const newTests = flattenExerciseList(userTests);
        setTestEntries(obj);
      }
      setLoading(false);
    }
    run();
  },[enrollmentId])

  const obj={
    name:"Raghu",
    enrollmentId:"98734jh",
    testResult:[],
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading data...</div>
        </div>
      </div>
    );
  }
  return (
    <div className='text-slate-600 dark:text-slate-300 '>
      <Navbar></Navbar>
      <div className='w-[70%] mx-auto my-5'>
        <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl px-5 py-4 text-primary-foreground shadow-lg">
              <h1 className="text-xl font-semibold mb-1 text-">
                Member Name : {user && user?.name}
              </h1>
              <p className="text-lg opacity-90">
                Enrollement Id: {user && user?.enrollmentId}
              </p>
            </div>
          </motion.div>
          {
            whichPage==="take-test"?(<Taketes enrollmentId={enrollmentId}></Taketes>):(<ViewTest exercisesTested={testEntries} reTest={true} enrollmentId={enrollmentId}></ViewTest>)
          }
          {/* {
            user && user?.testDone ?(<ViewTest exercisesTested={testEntries} reTest={true}></ViewTest>):(<TakeTest enrollmentId={enrollmentId}></TakeTest>)
          } */}
      </div>
        
    </div>
  )
}

export default TestLanding