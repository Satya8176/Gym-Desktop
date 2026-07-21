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
                {exercisesTested && <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
                  <div>
                    <div className="text-base">Max Weight</div>
                    <div className="text-sm text-slate-400 font-bold">
                     {`${exercisesTested.weightExercise}`}
                  </div>
                  </div>
                  <div className="text-sm text-slate-400 font-bold">
                     {`${exercisesTested.maxWeight} KG`}
                  </div>
                </div>}

                {exercisesTested && <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
                  <div>
                    <div className="text-base">Max Reps</div>
                    <div className="text-sm text-slate-400 font-bold">
                     {`${exercisesTested.repExercise}`}
                  </div>
                  </div>
                  <div className="text-sm text-slate-400 font-bold">
                     {`${exercisesTested.maxReps} reps`}
                  </div>
                </div>}

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


