import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

function AddMaxWeightReps() {
  const formRef = useRef({
      setNo: "",
      weight: "",
      reps: "",
    });
  // const [workouts,setWorkouts]=useState([])

  const [sets,setSets]=useState([]);
  const [showSets,setShowSets]=useState(false);
  const [addSets,setAddSets]=useState(false);
  const [isSaved,setIsSaved]=useState(false);

  // Initialize from ex.sets when provided (duplicated days)
  useEffect(() => {
    if (ex && ex.sets && ex.sets.length > 0) {
      setSets(ex.sets);
      setIsSaved(true);
      setShowSets(true);
    }
  }, [ex]);
  // console.log("sets is",sets)
  // console.log("Wrok is",workouts)

  function setShowSetsHandler(value){
    setShowSets(value);
  }
  function setAddSetHandler(){
    setAddSets(!addSets);
  }
  function handleSaveBtn(){
    const workout={"Exercise":ex.id,
      "sets":sets
    }
    setIsSaved(true)
    // console.log("Single workout is",workout)
    // setWorkouts((prev)=> [...prev, workout])
    addWorkOutHandler(workout);
  }
  return (
    <div className="flex flex-col px-6 py-3 text-left text-base text-gray-500 dark:text-gray-200 tracking-wider dark:bg-slate-900 my-2 rounded-lg">
      <div className="flex flex-row justify-between items-center cursor-pointer "
      onClick={()=>{
        setShowSetsHandler(!showSets);
      }}
      >
        <div className="">
          {ex.name}
        </div>
        <div className="flex flex-row gap-3">
          <div className="dark:text-white text-black font-bold">
            <ChevronDown size={20} color="currentColor" />
          </div>
          <button
            className={`hover:text-black hover:font-bold py-[4px] px-2 bg-blue-400 rounded-sm text-base hover:scale-90 text-blue-700
            ${isSaved? ("hidden"):("")}`}
            type="button"
            onClick={() => {
              setAddSetHandler()
            }}
          >
            Add Sets
          </button>
          <button
            className={`hover:text-black hover:font-bold py-[4px] px-2 bg-red-400 rounded-sm text-base hover:scale-90 text-red-900 font-bold ${deleteBtn?(""):("hidden")}`}
            type="button"
            onClick={() => {
              deleteWorkOut(ex.id)
              // console.log("THis is th id",ex.id)
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div>
        {
          sets.length>0? (
            showSets && (
              <div className="rounded-t-sm overflow-hidden mt-2">
              <table
                className=" min-w-full divide-y divide-gray-200 dark:divide-gray-700"
              >
                <thead className="bg-gray-50 dark:bg-gray-700 ">
                  <tr className="rounded-lg">
                    <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                      Set No.
                    </th>
                    <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                      Reps
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sets.map((set, index) => (
                    <motion.tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 "
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                        <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                          {set.setNo}
                        </div>
                      </td>
                      <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                        <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                          {set.weight} KG
                        </div>
                      </td>
                      <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                        <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                          {set.reps}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            ) 
          ):(
            !addSets && (
              <div className="text-[13px] text-yellow-300">No Sets Added</div>
            )
          )
        }
        {addSets && (
        <div className="flex gap-x-3 my-3 py-1 px-2 items-center rounded-lg border-2 dark:border-slate-500 border-slate-400">
          <div className="flex flex-row gap-2 items-center">
            <label className="block text-sm font-medium text-card-foreground ">
              SetNo.
            </label>
            <input
              type="text"
              onChange={(e) => {
                formRef.current.setNo = e.target.value;
              }}
              className="w-[20%] px-1 py-1 bg-input text-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="1"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <label className="block text-sm font-medium text-card-foreground ">
              Weight
            </label>
            <input
              type="text"
              onChange={(e) => {
                formRef.current.weight = e.target.value;
              }}
              className="w-[20%] px-1 py-1 bg-input text-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="kG"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <label className="block text-sm font-medium text-card-foreground ">
              Reps
            </label>
            <input
              type="text"
              onChange={(e) => {
                formRef.current.reps = e.target.value;
              }}
              className="w-[20%] px-1 py-1 bg-input text-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="12"
            />
          </div>
          <button
            type="button"
            className="w-[10%] h-fit text-blue-700 hover:font-bold hover:text-blue-900 py-1 px-2 bg-blue-400 rounded-sm hover:scale-95 "
            onClick={() => {
              // push a shallow copy of the ref object so each entry is independent
              setSets((prev) => [...prev, { ...formRef.current }]);
              // mark that sets should be shown
              setShowSetsHandler(true);
              
            }}
          >
            Add
          </button>
          <button
            type="button"
            className="text-2xl text-red-500 font-bold px-2 hover:cursor-pointer "
            onClick={() => {
              setAddSetHandler();
            }}
          >
            X
          </button>
        </div>
      )}
      </div>
      <button className={`w-fit h-fit text-green-800 hover:font-bold hover:text-green-900 py-1 px-2 bg-green-400 rounded-sm 
      hover:scale-95 mt-2 ml-[94%] ${sets.length===0 || isSaved?("hidden"):("")}`}
      onClick={()=>{handleSaveBtn()}}
      type="button"
      >Save</button>
    </div>
  )
}

export default AddMaxWeightReps;
