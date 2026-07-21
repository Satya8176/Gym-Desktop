import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Save, Calendar, Cross, ArrowDown, ChevronDown, CloudCog } from "lucide-react";
import Navbar from "./Navbar.jsx";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createTestFun, getAllExercise, getMembers } from "../serviceFunctions/userRelatedFunc.js";
import { setAllExercises, setUsers } from "../redux/slices/dataSlice.js";
import toast from "react-hot-toast";

function Taketes({ enrollmentId }) {
  const dispatch = useDispatch();
  const { totalExercies } = useSelector((state) => state.dataSlice);
  const [exercises, setExercises] = useState(totalExercies || []);

  // single selection for weight test and for reps test (separate)
  const [selectedWeightEx, setSelectedWeightEx] = useState(null);
  const [selectedRepsEx, setSelectedRepsEx] = useState(null);

  // stored global capability tests (one for weight, one for reps)
  const [weightTest, setWeightTest] = useState(null); 
  const [repsTest, setRepsTest] = useState(null); 

  // show input panels when a select is chosen
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showRepsInput, setShowRepsInput] = useState(false);

  const formRef = useRef({
    maxWeight: "",
    maxReps: "",
  });

  useEffect(() => {
    if (!totalExercies || totalExercies.length === 0) {
      const run = async () => {
        const data = await getAllExercise();
        dispatch(setAllExercises(data));
        setExercises(data || []);
      };
      run();
    } else {
      setExercises(totalExercies || []);
    }
  }, [totalExercies, dispatch]);

  // save or replace weight test
  function saveWeightTest() {

    if (!selectedWeightEx){
      toast.error("Select an exercise for max weight.");
      return ;
    }
    const val = formRef.current.maxWeight?.toString().trim();
    if (!val) {
      toast.error("Enter max weight value");
      return;
    }
    setWeightTest({
      // exerciseId: parseInt(selectedWeightEx.id),
      weightExercise: selectedWeightEx.name,
      maxWeight: val,
    });
    // hide input and reset selection input value
    setShowWeightInput(false);
    setSelectedWeightEx(null);
    formRef.current.maxWeight = "";
  }

  // save or replace reps test
  function saveRepsTest() {
    if (!selectedRepsEx) {
      toast.error("Select an exercise for max reps.");
      return;
    }
    const val = formRef.current.maxReps?.toString().trim();
    if (!val) {
      toast.error("Enter max reps value");
      return;
    }
    setRepsTest({
      // exerciseId: parseInt(selectedRepsEx.id),
      repExercise: selectedRepsEx.name,
      maxReps: val,
    });
    setShowRepsInput(false);
    setSelectedRepsEx(null);
    formRef.current.maxReps = "";
  }

  function removeWeightTest() {
    setWeightTest(null);
  }
  function removeRepsTest() {
    setRepsTest(null);
  }

  async function createTestHandle() {
    if (!weightTest) {
      toast.error("Please complete Weight test");
      return;
    }
    if (!repsTest) {
      toast.error("Please complete Reps test");
      return ;
    }
    const obj={
      userId:enrollmentId,
      testEntries:{
        "maxWeight":weightTest.maxWeight,
        "maxReps":repsTest.maxReps,
        "weightExercise":weightTest.weightExercise,
        "repExercise":repsTest.repExercise
      }
    }
    await createTestFun(obj);
    const data=await getMembers();
    dispatch(setUsers(data))
  }

  

  return (
    <div>
      <div className="border border-border rounded-lg p-6">
        {/* two-column selector: left = weight, right = reps */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="mb-2 font-medium">Select exercise for Max Weight</div>
              <select
                value={selectedWeightEx?.id || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) {
                    setSelectedWeightEx(null);
                    setShowWeightInput(false);
                    return;
                  }
                  const name = e.target.options[e.target.selectedIndex].text;
                  setSelectedWeightEx({ id, name });
                  setShowWeightInput(true);
                }}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none"
              >
                <option value="">Choose exercise...</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup})
                  </option>
                ))}
              </select>

              {showWeightInput && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter max weight (kg)"
                    
                    onChange={(e) => {
                      formRef.current.maxWeight = e.target.value
                    }}
                    className="w-full px-2 py-1 bg-input rounded"
                  />
                  <button onClick={saveWeightTest} className="px-3 py-1 bg-blue-600 text-white rounded">
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="mb-2 font-medium">Select exercise for Max Reps</div>
              <select
                value={selectedRepsEx?.id || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) {
                    setSelectedRepsEx(null);
                    setShowRepsInput(false);
                    return;
                  }
                  const name = e.target.options[e.target.selectedIndex].text;
                  setSelectedRepsEx({ id, name });
                  setShowRepsInput(true);
                }}
                className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none"
              >
                <option value="">Choose exercise...</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup})
                  </option>
                ))}
              </select>

              {showRepsInput && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter max reps"
                    
                    onChange={(e) => (formRef.current.maxReps = e.target.value)}
                    className="w-full px-2 py-1 bg-input rounded"
                  />
                  <button onClick={saveRepsTest} className="px-3 py-1 bg-indigo-600 text-white rounded">
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* show recorded global tests */}
        <div className="mt-4">
          {weightTest || repsTest ? (
            <div className="space-y-2">

              
              {/* {combinedTests.map((t) => ( */}
                {weightTest && <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
                  <div>
                    <div className="font-semibold">Max Weight</div>
                    <div className="text-sm text-slate-400 font-bold">
                     {`${weightTest.weightExercise}`}
                  </div>
                  </div>
                  <div className="text-sm text-slate-400 font-bold">
                     {`${weightTest.maxWeight} KG`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => (removeWeightTest())}
                      className="px-2 py-1 text-red-600 bg-red-100 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>}

                {repsTest && <div className="flex items-center justify-between bg-muted/30 p-3 rounded">
                  <div>
                    <div className="font-semibold">Max Reps</div>
                    <div className="text-sm text-slate-400 font-bold">
                     {`${repsTest.repExercise}`}
                  </div>
                  </div>
                  <div className="text-sm text-slate-400 font-bold">
                     {`${repsTest.maxReps} reps`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => (removeRepsTest())}
                      className="px-2 py-1 text-red-600 bg-red-100 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>}

              
            </div>
          ) : (
            <div className="p-2 text-slate-700 dark:text-slate-400">No capabilities recorded yet</div>
          )}
        </div>

        <div className="mt-4">
          <button
            className={`w-fit text-black font-bold py-1 px-3 bg-green-400 rounded-sm hover:scale-95`}
            type="button"
            onClick={createTestHandle}
          >
            Save Test
          </button>
        </div>

        {/* keep compatibility with ViewTest component */}
        
      </div>
    </div>
  );
}

export default Taketes;