import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function ViewTest({ exercisesTested,reTest,enrollmentId}) {
  const navigate=useNavigate();

  return (
    <div>
      {exercisesTested ? (
        <div className="rounded-t-sm overflow-hidden mt-2">
          <div className="space-y-2">
              {/* {combinedTests.map((t) => ( */}
                {exercisesTested && <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
                  <div>
                    <div className="text-base">Global Max Weight</div>
                  </div>
                  <div className="text-sm text-slate-400 font-bold">
                     {`${exercisesTested.maxWeight} KG`}
                  </div>
                </div>}

                {exercisesTested && <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
                  <div>
                    <div className="text-base">Global Max Reps</div>
                    
                  </div>
                  <div className="text-sm text-slate-400 font-bold">
                     {`${exercisesTested.maxReps} reps`}
                  </div>
                </div>}

              {/* ))} */}
            </div>
          <button className={`w-fit h-fit text-black font-bold hover:text-yellow-900 py-1 px-2 bg-yellow-400 rounded-sm hover:scale-95 mt-3 ${reTest ?(""):("hidden")} relative`}
          type="button"
          // How i can navigate so that it take restest 
          //We can do like when press on retest then delete this user entry from the table then go to testLanding
          onClick={()=>{
            navigate(`/test/take-test/${enrollmentId}`)
          }}
          >
            Retest
          </button>
        </div>
      ) : (
        <div>No Exerices is tested</div>
      )}
    </div>
  );
}

export default ViewTest;


// {/* <div className="space-y-2">

              
//               {/* {combinedTests.map((t) => ( */}
//                 {weightTest && <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
//                   <div>
//                     <div className="font-semibold">Global Max Weight</div>
//                   </div>
//                   <div className="text-sm text-slate-400 font-bold">
//                      {`${weightTest.maxWeight} KG`}
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       onClick={() => (removeWeightTest())}
//                       className="px-2 py-1 text-red-600 bg-red-100 rounded"
//                     >
//                       Remove
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         // allow editing by pre-filling selection/input
//                         // setSelectedWeightEx({ id: t.exerciseId.toString(), name: t.name });
//                         // formRef.current.maxWeight = t.maxWeight;
//                         setShowWeightInput(true);
//                       }}
//                       className="px-2 py-1 text-white bg-gray-700 rounded"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 </div>}

//                 {repsTest && <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
//                   <div>
//                     <div className="font-semibold">Global Max Reps</div>
                    
//                   </div>
//                   <div className="text-sm text-slate-400 font-bold">
//                      {`${repsTest.maxReps} reps`}
//                   </div>
//                   <div className="flex gap-2">
//                     <button
//                       type="button"
//                       onClick={() => (removeRepsTest())}
//                       className="px-2 py-1 text-red-600 bg-red-100 rounded"
//                     >
//                       Remove
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         // allow editing by pre-filling selection/input
//                           // setSelectedRepsEx({ id: t.exerciseId.toString(), name: t.name });
//                           // formRef.current.maxReps = t.maxReps;
//                           setShowRepsInput(true);
//                       }}
//                       className="px-2 py-1 text-white bg-gray-700 rounded"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 </div>}

//               {/* ))} */}
//             </div> */}