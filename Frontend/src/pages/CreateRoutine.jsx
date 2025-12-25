import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Save, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { membersApi, exercisesApi, routinesApi } from '../mocks/mockApi.js';
import AddWorkout from '../components/AddWorkout.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { createRoutineFun, fetchUserTests, generateRoutinePdf, getAllExercise, getMembers } from '../serviceFunctions/userRelatedFunc.js';
import { setAllExercises, setUsers } from '../redux/slices/dataSlice.js';
import ViewTest from '../components/ViewTest.jsx';
import toast from 'react-hot-toast';

const CreateRoutine = () => {
  const dispatch = useDispatch();
  const {totalMembers}=useSelector((state)=>state.dataSlice)
  const {totalExercies}=useSelector((state)=>state.dataSlice)
  const [members, setMembers] = useState(totalMembers);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [exercises, setExercises] = useState(totalExercies);
  const [selectedMember, setSelectedMember] = useState('');
  const [routineName, setRoutineName] = useState('');
  const [selectedDays, setSelectedDays] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const memberInputRef = useRef(null);
  const [availableExercise,setAvailableExercise]=useState(exercises);
  const [editInitialWorkOut,setInitialWorkOut]=useState(true);

  const [showTestTable,setShowTestTable]=useState();
  
//  console.log(selectedMember)
  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (memberInputRef.current && !memberInputRef.current.contains(e.target)) {
        setShowMemberDropdown(false);
      }
    }

    function handleKey(e) {
      if (e.key === 'Escape') setShowMemberDropdown(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  useEffect(()=>{
    const run=async()=>{
      const data=await fetchUserTests(selectedMember);
      // const newData=flattenExerciseList(data);
      // const exer=UserAvailableExercises(data);
      const obj={
        "maxWeight":data.maxWeight,
        "maxReps":data.maxReps
      }
      setShowTestTable(obj);
      setAvailableExercise(exercises);
    }
    if(selectedMember){
      console.log("seleted mem",selectedMember)
      run();
    }
  },[selectedMember])

  // Keep the input text in sync when selectedMember is set programmatically
  useEffect(() => {
    if (selectedMember) {
      const m = (members || []).find(x => x.enrollmentId === selectedMember);
      if (m) setMemberSearch(m.name);
    }
  }, [selectedMember, members]);
  

  const daysOfWeek = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];

  // This is for the total memeber and total exercise
  useEffect(() => {
    if (!totalMembers || totalMembers.length === 0) {
      const run=async()=>{
        const data=await getMembers();
        dispatch(setUsers(data))
        setMembers(data)
        const data2=await getAllExercise();
        dispatch(setAllExercises(data2))
        setExercises(data2)
      }
      run();
    }
  }, [totalMembers, dispatch]);




  const [weekRoutine,setWeekRoutine]=useState([]);
  const [userEditedDays, setUserEditedDays] = useState({});

  function markDayEdited(day){
    setUserEditedDays(prev => ({ ...prev, [day]: true }));
  }

  function addSingleDayRoutine(obj){
    // obj -> { day: 'Monday', workouts: [...] }
    // keep the existing array (for any other usage)
    setWeekRoutine((prev) => {
      // replace existing entry for same day if present
      const others = prev.filter(p => p.day !== obj.day);
      // store a clone to avoid sharing references between days
      const objToStore = { ...obj, workouts: obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : [] };
      return [...others, objToStore];
    });

    // also store in selectedDays (used on submit)
    setSelectedDays((prev) => {
      const next = { ...prev };
      next[obj.day] = obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : [];

      // duplicate mapping: Monday->Thursday, Tuesday->Friday, Wednesday->Saturday
      const idx = daysOfWeek.indexOf(obj.day);
      if (idx >= 0 && idx < 3) {
        const mappedDay = daysOfWeek[idx + 3];
        // only auto-copy if the mapped day hasn't been edited by the user
        if (!userEditedDays[mappedDay]) {
          next[mappedDay] = obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : [];
        }
      }

      return next;
    });
  }

  function handleInitialEdit() {
    setInitialWorkOut(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMember || !routineName){ 
      toast.error("Choose member and Routine name");
      return;
    }

    
    // console.log("Week Routine is",weekRoutine);
    const inDay=[];
    for(let i of weekRoutine){
      if(daysOfWeek.includes(i.day)){
        inDay.push(i.day);
      }
    }
    const remainDay=[];
    for(let i of daysOfWeek){
      if(!inDay.includes(i)){
        remainDay.push(i);
      }
    }
    
    for(let day of remainDay){
      if(day === 'Day 4'){
        for(let i of weekRoutine){
          if(i.day === 'Day 1'){
            let obj={
              day:'Day 4',
              // clone to prevent shared references between day1 and day4
              workouts: i.workouts ? JSON.parse(JSON.stringify(i.workouts)) : []
            }
            weekRoutine.push(obj);
            break;
          }
        }
      }
      if(day === 'Day 5'){
        for(let i of weekRoutine){
          if(i.day === 'Day 2'){
            let obj={
              day:'Day 5',
              workouts: i.workouts ? JSON.parse(JSON.stringify(i.workouts)) : []
            }
            weekRoutine.push(obj);
            break;
          }
        }
      }
      if(day === 'Day 6'){
        for(let i of weekRoutine){
          if(i.day === 'Day 3'){
            let obj={
              day:'Day 6',
              workouts: i.workouts ? JSON.parse(JSON.stringify(i.workouts)) : []
            }
            weekRoutine.push(obj);
            break;
          }
        }
      }
    }
    const newRoutine = weekRoutine.sort((a, b) => {
      const dayA = parseInt(a.day.replace("Day ", ""), 10);
      const dayB = parseInt(b.day.replace("Day ", ""), 10);
      return dayA - dayB;
    });


    if(weekRoutine.length !== 6){
      toast.error("Add Workout for Each days")
      return ;
    }
    // console.log("Week Routine is",newRoutine); 

    let memberId=selectedMember;
    const memberObj = (members || []).find(m => m.enrollmentId === memberId) || null;
    const pdfObj = {
      Membername: memberObj ? memberObj.name : memberId,
      Name: routineName,
      WeekRoutine:newRoutine,
      availableExercise:availableExercise,
    };
    generateRoutinePdf(pdfObj);
    setSaving(true);
    console.log("New Routine is",newRoutine)
    try {
      // NOTE: backend call intentionally omitted. Caller will send `payload` to backend later.

      // Update local state to the normalized week routine so UI reflects what was "saved"
      // setWeekRoutine(newWeekRoutine.length > 0 ? newWeekRoutine : weekRoutine);
      await createRoutineFun(selectedMember,routineName,newRoutine);

      // Reset form fields

      setSelectedMember('');
      setRoutineName('');
      setSelectedDays({});
      setTimeout(() => {
        window.location.reload();
      }, 1500);


      // Generate printable routine based on normalized week routine
      
    } catch (err) {
      console.error('Error while preparing routine:', err);
    } finally {
      setSaving(false);
    }
  };

  // Generate a printable HTML for the weekly routine and open print dialog.
  // We intentionally avoid adding a new PDF library and use the browser print flow
  // so users can save or share the PDF from their browser.



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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Routine</h1>
          <p className="mt-2 text-muted-foreground">Design workout routines for your members</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Select Member
                  </label>
                  <div className="relative" ref={memberInputRef}>
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => {
                        const v = e.target.value;
                        setMemberSearch(v);
                        setShowMemberDropdown(true);
                        if (v === '') {
                          // clear selected when user empties the input
                          setSelectedMember('');
                        }
                      }}
                      onFocus={() => setShowMemberDropdown(true)}
                      placeholder="Search or choose a member..."
                      className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      aria-label="Search members"
                      required
                    />

                    {showMemberDropdown && (
                      <ul className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-card border border-border shadow-lg">
                        {(members || []).filter(m => {
                          const q = (memberSearch || '').toLowerCase();
                          return (
                            !q ||
                            m.name.toLowerCase().includes(q) ||
                            (m.enrollmentId && String(m.enrollmentId).toLowerCase().includes(q))
                          );
                        }).map(member => (
                          <li
                            key={member.id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSelectedMember(member.enrollmentId);
                              setMemberSearch(member.name);
                              setShowMemberDropdown(false);
                            }}
                            className="cursor-pointer px-3 py-2 hover:bg-muted-foreground/10"
                          >
                            <div className="flex justify-between">
                              <span>{member.name}</span>
                              <span>Enrollment No. {member.enrollmentId}</span>
                            </div>
                          </li>
                        ))}
                        {(members || []).length === 0 && (
                          <li className="px-3 py-2 text-sm text-muted-foreground">No members</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Routine Name
                  </label>
                  <input
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Strength Training - Week 1"
                    required
                  />
                </div>
              </div>
              <div className='text-xl pt-3'>
                {selectedMember && (
                  <div className="mt-4 bg-muted p-4 rounded-lg border border-border">
                    {(() => {
                      const selected = members.find(
                        (m) => m.enrollmentId === selectedMember
                      );
                      if (!selected) return null;
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <p>
                            <strong>Height:</strong>{" "}
                            {selected.height ? `${selected.height} cm` : "N/A"}
                          </p>
                          <p>
                            <strong>Weight:</strong>{" "}
                            {selected.weight ? `${selected.weight} kg` : "N/A"}
                          </p>
                          {/* <p>
                            <strong>BMI:</strong> {(selected.weight / ((selected.height / 100) ** 2)).toFixed(2)}
                          </p> */}
                          <p>
                            <strong>Age:</strong> {selected.age || "N/A"}
                          </p>
                          <p>
                            <strong>Gender:</strong> {selected.gender || "N/A"}
                          </p>
                        </div>
                      );
                    })()}
                    {selectedMember && showTestTable && 
                    <div className='bg-muted  mt-3'>
                      {/* <div className='text-base text-slate-300 font-bold '>Capabilities</div> */}
                      <div className='flex text-sm justify-between text-muted-foreground '>
                        <div className='flex w-[50%] gap-x-2'>
                          <div className='font-semibold'>Global Maximum Weight : </div>
                          <div>{`${showTestTable.maxWeight} KG`}</div>
                        </div>
                        <div className='flex w-[50%] gap-x-2'>
                          <div className='font-semibold'>Global Maximum Reps: </div>
                          <div>{`${showTestTable.maxReps} Reps`}</div>
                        </div>
                      </div>
                    </div>}
                    

                  </div>
                )}
                
              </div>
            </div>
              

            {/* Days and Exercises */}
            <div>
              <h3 className="text-lg font-medium text-card-foreground mb-6">Weekly Schedule</h3>
              
              { 
                <div className="space-y-6">
                {daysOfWeek.map((day,index) => {
                  let res=(day === 'Day 4' || day === 'Day 5' || day === 'Day 6') && editInitialWorkOut;
                  return (<AddWorkout
                    key={day}
                    day={day}
                    index={index}
                    addSingleDayRoutine={addSingleDayRoutine}
                    initialWorkouts={selectedDays[day] || []}
                    selectedMember={selectedMember}
                    exercises={availableExercise}
                    capabilites={showTestTable}
                    editInitialWorkOut={res}
                    handleInitialEdit={handleInitialEdit}
                  />)
                })}
              </div>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !selectedMember || !routineName }
                className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium py-3 px-6 rounded-lg hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Creating...' : 'Create Routine'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;





