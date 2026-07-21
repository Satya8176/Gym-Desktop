import React, { useState, useEffect, useRef } from "react";
import { Plus, Pen, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExercise } from "../serviceFunctions/userRelatedFunc.js";
import { setAllExercises } from "../redux/slices/dataSlice.js";
import AddSets from "./AddSets.jsx";
import toast from "react-hot-toast";

// FIX: module-level flag so all 6 AddWorkout instances share one fetch lock.
// Previously each instance had its own useEffect that called getAllExercise()
// independently — meaning 6 parallel API calls fired on mount, each dispatching
// setAllExercises() when done, causing 6 Redux updates → up to 36 re-renders
// across the 6 instances. A module-level ref ensures only one instance ever
// starts the fetch; the rest rely on Redux state updating via the dispatch.
let exerciseFetchStarted = false;

function AddWorkout({
  day,
  addSingleDayRoutine,
  index,
  exercises,
  capabilites,
  initialWorkouts = [],
  onUserEdit,
}) {
  const dispatch = useDispatch();
  const { totalExercies } = useSelector((state) => state.dataSlice);

  const [workouts, setWorkout] = useState([]);
  const [currDayExercise, setCurrentDayExercise] = useState([]);
  const [addExercise, setAddExercise] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [deleteBtn, setDeleteBtn] = useState(true);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [editInitialWorkOut, setInitialWorkOut] = useState(false);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Show Edit button on Day 4/5/6 when they receive propagated data
  useEffect(() => {
    const shouldEdit =
      (day === "Day 4" || day === "Day 5" || day === "Day 6") &&
      initialWorkouts.length > 0;
    setInitialWorkOut(shouldEdit);
  }, [day, initialWorkouts]);

  // FIX: Only one instance across all 6 days ever starts this fetch.
  // The module-level `exerciseFetchStarted` flag is checked before dispatching.
  // Once Redux is updated by the single fetch, all instances re-render via
  // the `totalExercies` selector — no duplicate API calls, no dispatch storm.
  useEffect(() => {
    if (!totalExercies || totalExercies.length === 0) {
      if (exerciseFetchStarted) return;
      exerciseFetchStarted = true;
      const run = async () => {
        const data = await getAllExercise();
        if (mountedRef.current) {
          dispatch(setAllExercises(data));
        }
      };
      run();
    }
  }, [totalExercies, dispatch]);

  // FIX: `exercises` prop is removed from the dependency array of this effect.
  // Previously, when `availableExercise` state was replaced in CreateRoutine
  // (after the fetch), it produced a new array reference, which triggered this
  // effect on all 6 instances even though `initialWorkouts` hadn't changed.
  // The exercises prop is only needed for name resolution during rebuild, so
  // we read it via a ref at execution time rather than declaring it as a dep.
  const exercisesRef = useRef(exercises);
  useEffect(() => {
    exercisesRef.current = exercises;
  });

  useEffect(() => {
    if (initialWorkouts && initialWorkouts.length > 0 && !hasUserEdited) {
      const clonedWorkouts = JSON.parse(JSON.stringify(initialWorkouts));
      setWorkout(clonedWorkouts);

      // Read the latest exercises from the ref — stable reference, not a dep
      const currentExercises = exercisesRef.current || [];
      const mapped = clonedWorkouts.map((w) => {
        const exId = String(w.exerciseId ?? w.Exercise ?? w.exercise ?? "");
        const exObj = currentExercises.find((e) => String(e.id) === exId);
        return {
          id: exId,
          exerciseId: exId,
          name: exObj ? exObj.name : w.exerciseName || w.Exercise || "",
          sets: JSON.parse(JSON.stringify(w.sets || [])),
        };
      });

      setCurrentDayExercise(mapped);
      setIsSaved(true);
      setDeleteBtn(false);
    }
    // FIX: `exercises` intentionally excluded from deps — read via ref above.
    // Only re-run when initialWorkouts actually changes (new propagation from
    // parent) or when hasUserEdited changes (user unlocked the day for editing).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWorkouts, hasUserEdited]);

  function deleteWorkOut(value) {
    setHasUserEdited(true);
    if (typeof onUserEdit === "function") onUserEdit(day);

    setCurrentDayExercise((prev) =>
      prev.filter(
        (item) => String(item.exerciseId ?? item.id) !== String(value)
      )
    );

    const newWorkouts = workouts.filter((it) => {
      const exId = String(
        it.exerciseId ?? it.Exercise ?? it.exercise ?? it.id ?? ""
      );
      return exId !== String(value);
    });

    setWorkout(newWorkouts);

    if (typeof addSingleDayRoutine === "function") {
      addSingleDayRoutine({
        day,
        workouts: JSON.parse(JSON.stringify(newWorkouts)),
      });
    }

    setIsSaved(false);
    setDeleteBtn(true);
  }

  function handleEditInitialWorkOut() {
    setHasUserEdited(true);
    if (typeof onUserEdit === "function") onUserEdit(day);
    setIsSaved(false);
    setDeleteBtn(true);
    setInitialWorkOut(false);
  }

  function addWorkOutHandler(sglWorlOut) {
    setHasUserEdited(true);
    if (typeof onUserEdit === "function") onUserEdit(day);

    const exId = String(
      sglWorlOut.exerciseId ??
        sglWorlOut.Exercise ??
        sglWorlOut.exercise ??
        sglWorlOut.id ??
        ""
    );

    const existingIndex = workouts.findIndex((it) => {
      const id = String(
        it.exerciseId ?? it.Exercise ?? it.exercise ?? it.id ?? ""
      );
      return id === exId;
    });

    let newWorkouts;
    if (existingIndex !== -1) {
      newWorkouts = workouts.map((it) => {
        const id = String(
          it.exerciseId ?? it.Exercise ?? it.exercise ?? it.id ?? ""
        );
        if (id === exId) {
          return {
            ...it,
            sets: JSON.parse(JSON.stringify(sglWorlOut.sets || [])),
          };
        }
        return it;
      });
    } else {
      newWorkouts = [...workouts, JSON.parse(JSON.stringify(sglWorlOut))];
    }

    setWorkout(newWorkouts);

    setCurrentDayExercise((prev) => {
      const found = prev.some((p) => String(p.exerciseId ?? p.id) === exId);
      if (found) {
        return prev.map((p) =>
          String(p.exerciseId ?? p.id) === exId
            ? { ...p, sets: JSON.parse(JSON.stringify(sglWorlOut.sets || [])) }
            : p
        );
      }
      const exObj = (exercisesRef.current || []).find(
        (e) => String(e.id) === exId
      );
      return [
        ...prev,
        {
          id: exId,
          exerciseId: exId,
          name: exObj
            ? exObj.name
            : sglWorlOut.exerciseName || sglWorlOut.Exercise || "",
          sets: JSON.parse(JSON.stringify(sglWorlOut.sets || [])),
        },
      ];
    });

    if (typeof addSingleDayRoutine === "function") {
      addSingleDayRoutine({
        day,
        workouts: JSON.parse(JSON.stringify(newWorkouts)),
      });
    }
  }

  function handleSaveForDay() {
    const incompletExercise = currDayExercise.some(
      (ex) => !ex.sets || ex.sets.length === 0
    );

    if (incompletExercise) {
      toast.error("Please finish adding exercise first");
      return;
    }
    setInitialWorkOut(false);
    setIsSaved(true);
    setDeleteBtn(false);
    addSingleDayRoutine({ day, workouts: workouts });
  }

  return (
    <div>
      <div className="border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h4 className="text-lg font-medium text-card-foreground">{day}</h4>
          </div>
          <div className="flex gap-x-5">
            {editInitialWorkOut && (
              <button
                className="flex items-center space-x-2 px-3 py-2 text-red-300 hover:text-primary-foreground hover:bg-yellow-400 rounded-md transition-colors duration-200"
                type="button"
                onClick={handleEditInitialWorkOut}
              >
                <Pen className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setAddExercise(true)}
              className="flex items-center space-x-2 px-3 py-2 text-primary hover:text-primary-foreground hover:bg-primary/90 rounded-md transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Exercise</span>
            </button>
          </div>
        </div>

        {addExercise && (
          <div className="flex flex-col gap-y-2">
            <div
              className={`flex items-center space-x-4 p-4 bg-muted/50 rounded-lg ${
                isSaved ? "hidden" : ""
              }`}
            >
              <div className="flex-1">
                <select
                  value={selectedExerciseId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const name =
                      e.target.options[e.target.selectedIndex].text;
                    if (id) {
                      const already = (currDayExercise || []).some(
                        (item) =>
                          String(item.exerciseId ?? item.id) === String(id)
                      );
                      if (already) {
                        toast.error("Exercise already chosen");
                      } else {
                        setCurrentDayExercise((prev) => [
                          ...prev,
                          { id, exerciseId: id, name, sets: [] },
                        ]);
                      }
                    }
                    setSelectedExerciseId("");
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Exercise...</option>
                  {(exercises || []).map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setAddExercise(false)}
                className="text-destructive hover:font-bold hover:text-red-600 py-1 px-2 bg-red-300 rounded-sm hover:scale-90"
              >
                ❌
              </button>
            </div>
          </div>
        )}

        {currDayExercise.length > 0 ? (
          <div>
            {currDayExercise.map((initialExercise) => (
              <div key={initialExercise.exerciseId ?? initialExercise.id}>
                <AddSets
                  key={initialExercise.exerciseId ?? initialExercise.id}
                  ex={initialExercise}
                  deleteWorkOut={deleteWorkOut}
                  addWorkOutHandler={addWorkOutHandler}
                  deleteBtn={deleteBtn}
                  exDetail={capabilites}
                />
              </div>
            ))}
          </div>
        ) : (
          !addExercise && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No Exercise added for {day}</p>
            </div>
          )
        )}

        <button
          className={`w-fit h-fit text-black font-bold hover:text-green-900 py-1 px-2 bg-green-400 rounded-sm hover:scale-95 mt-1 ${
            workouts.length === 0 || isSaved ? "hidden" : ""
          }`}
          onClick={handleSaveForDay}
          type="button"
        >
          Save for the {day}
        </button>
      </div>
    </div>
  );
}

export default AddWorkout;
