import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Save, Calendar, Cross, ArrowDown, ChevronDown, Pen } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAllExercise } from "../serviceFunctions/userRelatedFunc.js";
import { setAllExercises } from "../redux/slices/dataSlice.js";
import AddSets from "./AddSets.jsx";
import toast from 'react-hot-toast';

function AddWorkout({ day, addSingleDayRoutine, index,exercises,capabilites, initialWorkouts = [], onUserEdit }) {
  const dispatch = useDispatch();
  const { totalExercies } = useSelector((state) => state.dataSlice);
  const [loading, setLoading] = useState(true);
  const [workouts, setWorkout] = useState([]);
  const [currDayExercise, setCurrentDayExercise] = useState([]);
  const [addExercise, setAddExercise] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [isSaved,setIsSaved]=useState(false);
  const [deleteBtn,setDeleteBtn]=useState(true);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [editInitialWorkOut, setInitialWorkOut] = useState(false);

  useEffect(() => {
    const shouldEdit =(day === 'Day 4' || day === 'Day 5' || day === 'Day 6') && initialWorkouts.length > 0;
    setInitialWorkOut(shouldEdit);
  }, [day,initialWorkouts]);



  useEffect(() => {
    if (!totalExercies || totalExercies.length === 0) {
      const run = async () => {
        const data = await getAllExercise();
        dispatch(setAllExercises(data));
      };
      run();
    }
  }, [totalExercies, dispatch]);

  // When parent passes initialWorkouts (e.g., duplicated from another day),
  // populate the UI state so the child shows them.
  useEffect(() => {
    // initialize from parent-provided initialWorkouts only if user hasn't started editing
    if (initialWorkouts && initialWorkouts.length > 0 && !hasUserEdited) {
      // set the raw workouts array (shape produced by AddSets) - clone to avoid shared refs
      setWorkout(JSON.parse(JSON.stringify(initialWorkouts)));

      // map to currDayExercise {id, name} so AddSets can render
      const mapped = initialWorkouts.map((w) => {
        const exId = w.Exercise || w.exerciseId || w.exercise;
        const exObj = (exercises || []).find((e) => String(e.id) === String(exId));
        return { id: exId, name: exObj ? exObj.name : '', sets: w.sets || [] };
      });
      setCurrentDayExercise(mapped);
      setIsSaved(true);
      setDeleteBtn(false);
    }
  }, [initialWorkouts, exercises, hasUserEdited]);

  function deleteWorkOut(value){
    // mark that user edited so we won't reinitialize from props
    setHasUserEdited(true);
    if (typeof onUserEdit === 'function') onUserEdit(day);
    console.log('deleteWorkOut called for', value);

    // remove from display list (currDayExercise) comparing against possible id fields
    setCurrentDayExercise(prev => prev.filter((item) => String(item.id) !== String(value)));

    // compute new workouts by filtering previous workouts
    const newWorkouts = workouts.filter((it) => {
      const exId = it.Exercise ?? it.exerciseId ?? it.exercise ?? it.id ?? (it.exercise && it.exercise.id);
      return String(exId) !== String(value);
    });

    // update internal state and persist to parent so deletion is saved
    setWorkout(newWorkouts);
    if (typeof addSingleDayRoutine === 'function') {
      addSingleDayRoutine({ day, workouts: JSON.parse(JSON.stringify(newWorkouts)) });
    }

    // show that content is being edited
    setIsSaved(false);
    setDeleteBtn(true);
  }
  function handleEditInitialWorkOut(){
    setIsSaved(false);
    setDeleteBtn(true);
    setInitialWorkOut(false);
  }
  function addWorkOutHandler(sglWorlOut){
    // when user saves a workout, update existing entry (if any) or add new — do NOT create duplicates
    setHasUserEdited(true);
    if (typeof onUserEdit === 'function') onUserEdit(day);

    const exId = sglWorlOut.exerciseId ?? sglWorlOut.Exercise ?? sglWorlOut.exercise ?? sglWorlOut.id;

    // compute newWorkouts by updating if exists or appending
    const existingIndex = workouts.findIndex((it) => {
      const id = it.Exercise ?? it.exerciseId ?? it.exercise ?? it.id ?? (it.exercise && it.exercise.id);
      return String(id) === String(exId);
    });

    let newWorkouts;
    if (existingIndex !== -1) {
      newWorkouts = workouts.map((it) => {
        const id = it.Exercise ?? it.exerciseId ?? it.exercise ?? it.id ?? (it.exercise && it.exercise.id);
        if (String(id) === String(exId)) {
          // replace sets (preserve other fields)
          return { ...it, sets: sglWorlOut.sets || [] };
        }
        return it;
      });
    } else {
      newWorkouts = [...workouts, sglWorlOut];
    }

    setWorkout(newWorkouts);

    // update currDayExercise entry if exists, else add it
    setCurrentDayExercise(prev => {
      const found = prev.some(p => String(p.id) === String(exId));
      if (found) {
        return prev.map(p => String(p.id) === String(exId) ? { ...p, sets: sglWorlOut.sets || [] } : p);
      }
      const exObj = (exercises || []).find(e => String(e.id) === String(exId));
      const newEntry = { id: exId, name: exObj ? exObj.name : '', sets: sglWorlOut.sets || [] };
      return [...prev, newEntry];
    });

    // persist to parent immediately so Day copies won't reintroduce deleted items
    if (typeof addSingleDayRoutine === 'function') {
      addSingleDayRoutine({ day, workouts: JSON.parse(JSON.stringify(newWorkouts)) });
    }
  }
  function handleSaveForDay(){
    setInitialWorkOut(false);
    // setFirstInitial(false);
    setIsSaved(true);
    setDeleteBtn(false);
    const forSingleDay={
      "day":day,
      "workouts":workouts
    }
    addSingleDayRoutine(forSingleDay)
  }
  
  // function setAddSetHandler(){
  //   setAddSets(!addSets);
  // }
  return (
    <div>
      <div key={day} className="border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h4 className="text-lg font-medium text-card-foreground">{day}</h4>
          </div>
          <div className="flex gap-x-5">
           {editInitialWorkOut &&
            <button className="flex items-center space-x-2 px-3 py-2  text-red-300  hover:text-primary-foreground hover:bg-yellow-400 rounded-md transition-colors duration-200"
            type="button"
            onClick={handleEditInitialWorkOut}
            >
              <Pen className="h-4 w-4"></Pen>
              <span> Edit </span>
            </button>}
            <button
              type="button"
              onClick={() => setAddExercise(true)}
              className="flex items-center space-x-2 px-3 py-2 text-primary hover:text-primary-foreground hover:bg-primary/90 rounded-md transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Workout</span>
            </button>
          </div>
          
        </div>
        {addExercise && (
          <div className="flex flex-col gap-y-2">
            <div className={`flex items-center space-x-4 p-4 bg-muted/50 rounded-lg ${isSaved ?("hidden"):("")}`}>
              <div className="flex-1">
                <select
                  value={selectedExerciseId}
                  onChange={(e) => {
                    const id = e.target.value;
                    const name = e.target.options[e.target.selectedIndex].text;
                    // add the selected exercise to the day's list (prevent duplicates)
                    if (id) {
                      const already = (currDayExercise || []).some(item => String(item.id) === String(id));
                      if (already) {
                        toast.error('Exercise already chosen');
                      } else {
                        setCurrentDayExercise((prev) => [...prev, { id, name }]);
                      }
                      // reset the select so it shows the placeholder instead of the previous selection
                      setSelectedExerciseId('');
                    } else {
                      setSelectedExerciseId('');
                    }
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Exercise...</option>
                  {exercises.map((ex) => (
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
          <div className="">
            {currDayExercise.map((initialExercise,index)=>{
              return (
                <div key={index}>
                   <AddSets key={index} ex={initialExercise} deleteWorkOut={deleteWorkOut} addWorkOutHandler={addWorkOutHandler} deleteBtn={deleteBtn} exDetail={capabilites} />
                </div>
                )
            })}
          </div>

        ) : (
          !addExercise && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No Workout added for {day}</p>
            </div>
          )
        )}
      <button className={`w-fit h-fit text-black font-bold hover:text-green-900 py-1 px-2 bg-green-400 rounded-sm 
      hover:scale-95 mt-1 ${workouts.length===0 || isSaved?("hidden"):("")}`}
      onClick={()=>{handleSaveForDay()}}
      type="button"
      >Save for the {day}</button>
      </div>
    </div>
  );
}

export default AddWorkout;

