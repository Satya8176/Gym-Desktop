import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { generateRoutinePdf, getLatestRoutine } from "../serviceFunctions/userRelatedFunc";
import { motion } from "framer-motion";
import { useSelector,useDispatch } from "react-redux";
import { setAllExercises } from "../redux/slices/dataSlice";

function ViewRoutine({ routine: initialRoutine, enrollmentId ,memberName }) {

  const dispatch=useDispatch();
  const {totalExercies}=useSelector((state)=>state.dataSlice)
  const [exercises, setExercises] = useState(totalExercies);
  const [routine, setRoutine] = useState(initialRoutine || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState([]);

  useEffect(() => {
      if (!exercises || !exercises.length === 0) {
        const run=async()=>{
          const data2=await getAllExercise();
          dispatch(setAllExercises(data2))
          setExercises(data2)
        }
        run();
      }
    }, [totalExercies, dispatch]);

  const toggleWorkout = (id) => {
    setExpandedWorkoutIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  // console.log("Rouinte from gene",routine)
  
  useEffect(() => {
    // If parent passed a routine prop we just use it, otherwise fetch by enrollmentId
    if (!initialRoutine && enrollmentId) {
      const run=async()=>{
        setLoading(true);
        const data=await getLatestRoutine(enrollmentId);
        setRoutine(data || null);
        setLoading(false)
        // console.log("Latest Routine is",data)
      }
      run();
    }
  }, [initialRoutine, enrollmentId]);

  if (loading) return <div className="text-white text-xl text-center">Loading routine...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!routine && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 mx-auto">
     
        <div className="p-6">
          <div className="text-gray-700 dark:text-slate-200 text-3xl text-center font-bold  my-20">No routine available for this Member</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
      <div className={`${initialRoutine?"max-w-6xl":"max-w-6xl"} mx-auto mt-6`}>
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[25px] font-semibold text-gray-800 dark:text-gray-100">{!initialRoutine &&(routine?.name || "Routine")}</h2>
            {/* <div className="text-sm text-gray-500 dark:text-gray-400">{routine.createdAt ? new Date(routine.createdAt).toLocaleString() : ""}</div> */}
          </div>

          {/* Days */}
          <motion.div
            className="my-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
          
            <div className="space-y-4">
              {routine && (routine.day || []).map((day) => (
                <div key={day.id} className="border rounded-md p-3 border-slate-700 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[20px] font-medium text-gray-800 dark:text-gray-100">{day.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Workouts: {day.workouts?.length || 0}</div>
                  </div>

                  <div className="space-y-3">
                    {(day.workouts || []).map((wk) => {
                      const expanded = expandedWorkoutIds.includes(wk.id);
                      return (
                        <div
                          key={wk.id}
                          className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWorkout(wk.id)
                          }}
                          onKeyDown={(e) => { if (e.key === 'Enter') toggleWorkout(wk.id); }}
                          aria-expanded={expanded}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex gap-x-2 items-center">
                              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{wk.exercise?.name || "Exercise"}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{wk.exercise?.muscleGroup || wk.exercise?.bodyPart || "-"}</div>
                            </div>
                            <div className="flex items-center gap-x-3">
                              <div className="text-[15px] text-gray-400 dark:text-gray-300">Sets: {(wk.sets || []).length}</div>
                              <div className={`transform transition-transform text-gray-400 dark:text-gray-300 ${expanded ? 'rotate-90' : ''}`}>▸</div>
                            </div>
                          </div>

                          {expanded && (
                            <div className="mt-2">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-left text-gray-500 dark:text-gray-400 text-xs">
                                    <th className="py-1 dark:text-slate-100 text-[14px]">Set No.</th>
                                    <th className="py-1 dark:text-slate-100 text-[14px]">Weight</th>
                                    <th className="py-1 dark:text-slate-100 text-[14px]">Reps</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(wk.sets || []).map((s) => (
                                    <tr key={s.id} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                                      <td className="py-0 dark:text-slate-200 text-[13px]">{s.setNo}</td>
                                      <td className="py-0 dark:text-slate-200 text-[13px]">{s.weight} KG</td>
                                      <td className="py-0 dark:text-slate-200 text-[13px]">{s.repetitions}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="my-2 flex justify-end">
              <button
              type="button"
                disabled={!routine}
                className=" h-fit text-green-800 hover:font-bold hover:text-green-900 py-2 px-3 bg-green-400 rounded-sm hover:scale-95 mt-2 font-semibold"
                onClick={()=>{
                  const pdfObj = {
                    Membername: memberName,
                    Name: routine.name,
                    WeekRoutine:routine.day,
                    availableExercise:exercises,
                  };
                  generateRoutinePdf(pdfObj)
                }}
              >
                <p>Generate PDF</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ViewRoutine;





// "day": [
//             {
//                 "id": 25,
//                 "name": "Day 1",
//                 "routineId": 5,
//                 "workouts": [
//                     {
//                         "id": 25,
//                         "dayId": 25,
//                         "exerciseId": 3,
//                         "exercise": {
//                             "name": "Pull-Up",
//                             "muscleGroup": "Back"
//                         },
//                         "sets": [
//                             {
//                                 "id": 25,
//                                 "setNo": 1,
//                                 "workoutId": 25,
//                                 "weight": 14,
//                                 "repetitions": 8
//                             }
//                         ]
//                     }
//                 ]
//             },
//           ]