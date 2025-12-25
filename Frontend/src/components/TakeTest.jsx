import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Save, Calendar, Cross, ArrowDown, ChevronDown, CloudCog } from "lucide-react";
import Navbar from "./Navbar.jsx";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { createTestFun, getAllExercise } from "../serviceFunctions/userRelatedFunc.js";
import { setAllExercises } from "../redux/slices/dataSlice.js";
import ViewTest from "./ViewTest.jsx";

function TakeTest({ enrollmentId }) {
  const dispatch = useDispatch();
  const { totalExercies } = useSelector((state) => state.dataSlice);
  const [exercises, setExercises] = useState(totalExercies || []);

  // single selection for weight test and for reps test (separate)
  const [selectedWeightEx, setSelectedWeightEx] = useState(null);
  const [selectedRepsEx, setSelectedRepsEx] = useState(null);

  // stored global capability tests (one for weight, one for reps)
  const [weightTest, setWeightTest] = useState(null); // { exerciseId, name, maxWeight }
  const [repsTest, setRepsTest] = useState(null); // { exerciseId, name, maxReps }

  // show input panels when a select is chosen
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [showRepsInput, setShowRepsInput] = useState(false);

  const formRef = useRef({
    maxWeight: "",
    maxReps: "",
  });
  console.log("Form ref:", formRef.current);

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
    if (!selectedWeightEx) return alert("Select an exercise for max weight.");
    const val = formRef.current.maxWeight?.toString().trim();
    if (!val) return alert("Enter max weight.");
    setWeightTest({
      exerciseId: parseInt(selectedWeightEx.id),
      name: selectedWeightEx.name,
      maxWeight: val,
    });
    // hide input and reset selection input value
    setShowWeightInput(false);
    setSelectedWeightEx(null);
    formRef.current.maxWeight = "";
  }

  // save or replace reps test
  function saveRepsTest() {
    if (!selectedRepsEx) return alert("Select an exercise for max reps.");
    const val = formRef.current.maxReps?.toString().trim();
    if (!val) return alert("Enter max reps.");
    setRepsTest({
      exerciseId: parseInt(selectedRepsEx.id),
      name: selectedRepsEx.name,
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
    const entries = [];
    if (weightTest) entries.push({ testType: "weight", exerciseId: weightTest.exerciseId, name: weightTest.name, maxWeight: weightTest.maxWeight });
    if (repsTest) entries.push({ testType: "reps", exerciseId: repsTest.exerciseId, name: repsTest.name, maxReps: repsTest.maxReps });

    if (entries.length === 0) return alert("No tests to save.");

    const obj = {
      userId: enrollmentId,
      testEntries: entries,
    };
    await createTestFun(obj);
  }

  const combinedTests = [
    ...(weightTest ? [{ testType: "weight", ...weightTest }] : []),
    ...(repsTest ? [{ testType: "reps", ...repsTest }] : []),
  ];

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

              {showWeightInput && selectedWeightEx && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter max weight (kg)"
                    // value={formRef.current.maxWeight}
                    onChange={(e) => {
                      console.log("Setting max weight", e.target.value);
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

              {showRepsInput && selectedRepsEx && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter max reps"
                    // value={formRef.current.maxReps}
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
          {combinedTests.length > 0 ? (
            <div className="space-y-2">
              {combinedTests.map((t) => (
                <div key={t.testType} className="flex items-center justify-between bg-muted/30 p-3 rounded">
                  <div>
                    <div className="font-semibold">{t.testType === "weight" ? "Global Max Weight" : "Global Max Reps"}</div>
                    <div className="text-sm text-slate-600">
                      {t.name} — {t.testType === "weight" ? `${t.maxWeight} kg` : `${t.maxReps} reps`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => (t.testType === "weight" ? removeWeightTest() : removeRepsTest())}
                      className="px-2 py-1 text-red-600 bg-red-100 rounded"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // allow editing by pre-filling selection/input
                        if (t.testType === "weight") {
                          setSelectedWeightEx({ id: t.exerciseId.toString(), name: t.name });
                          formRef.current.maxWeight = t.maxWeight;
                          setShowWeightInput(true);
                        } else {
                          setSelectedRepsEx({ id: t.exerciseId.toString(), name: t.name });
                          formRef.current.maxReps = t.maxReps;
                          setShowRepsInput(true);
                        }
                      }}
                      className="px-2 py-1 text-white bg-gray-700 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 text-slate-700 dark:text-slate-400">No capabilities recorded yet</div>
          )}
        </div>

        <div className="mt-4">
          <button
            className={`w-fit text-black font-bold py-1 px-3 bg-green-400 rounded-sm hover:scale-95 ${combinedTests.length === 0 ? 'opacity-60 pointer-events-none' : ''}`}
            type="button"
            onClick={createTestHandle}
            disabled={combinedTests.length === 0}
          >
            Save Test
          </button>
        </div>

        {/* keep compatibility with ViewTest component */}
        {/* <div className="mt-4">
          <ViewTest exercisesTested={combinedTests} reTest={false} />
        </div> */}
      </div>
    </div>
  );
}

export default TakeTest;