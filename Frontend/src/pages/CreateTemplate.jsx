import React, { useState, useEffect, useRef } from 'react';
import { Plus, Minus, Save, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import AddWorkout from '../components/AddWorkout.jsx';
import { 
  createTemplate, 
  getAllBodyParts, 
  getAllEquipment 
} from '../serviceFunctions/templateFunctions.js';
import { getAllExercise } from '../serviceFunctions/userRelatedFunc.js';
import { useDispatch, useSelector } from 'react-redux';
import { setAllExercises } from '../redux/slices/dataSlice.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreateTemplate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalExercies } = useSelector((state) => state.dataSlice);
  
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [exercises, setExercises] = useState(totalExercies);
  const [selectedDays, setSelectedDays] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [weekRoutine, setWeekRoutine] = useState([]);
  const [userEditedDays, setUserEditedDays] = useState({});
  const [editInitialWorkOut, setInitialWorkOut] = useState(true);
  const [isDay7Enabled, setIsDay7Enabled] = useState(false);
  const [day7Workouts, setDay7Workouts] = useState([]);

  const daysOfWeek = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];

  // Load exercises, body parts and equipment on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch exercises from backend
      if (!totalExercies || totalExercies.length === 0) {
        const exercisesData = await getAllExercise();
        dispatch(setAllExercises(exercisesData));
        setExercises(exercisesData);
      } else {
        setExercises(totalExercies);
      }
      
      // Fetch body parts and equipment
      const [bpData, eqData] = await Promise.all([
        getAllBodyParts(),
        getAllEquipment()
      ]);
      setBodyParts(bpData);
      setEquipment(eqData);
      setLoading(false);
    };
    fetchData();
  }, [totalExercies, dispatch]);

  function markDayEdited(day) {
    setUserEditedDays(prev => ({ ...prev, [day]: true }));
  }

  function addSingleDayRoutine(obj) {
    setWeekRoutine((prev) => {
      const others = prev.filter(p => p.day !== obj.day);
      const objToStore = { ...obj, workouts: obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : [] };
      return [...others, objToStore];
    });

    // Also store in selectedDays
    setSelectedDays((prev) => {
      const next = { ...prev };
      next[obj.day] = obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : [];

      // Auto-copy pattern: Day 1->Day 4, Day 2->Day 5, Day 3->Day 6
      const idx = daysOfWeek.indexOf(obj.day);
      if (idx >= 0 && idx < 3) {
        const mappedDay = daysOfWeek[idx + 3];
        if (!userEditedDays[mappedDay]) {
          next[mappedDay] = obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : [];
        }
      }

      return next;
    });
  }

  function addDay7Routine(obj) {
    setDay7Workouts(obj.workouts || []);
  }

  function handleInitialEdit() {
    setInitialWorkOut(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!templateName.trim()) {
      toast.error('Template name is required');
      return;
    }

    if (!description.trim()) {
      toast.error('Template description is required');
      return;
    }

    // Get days that have been filled
    const inDay = [];
    for (let i of weekRoutine) {
      if (daysOfWeek.includes(i.day)) {
        inDay.push(i.day);
      }
    }

    const remainDay = [];
    for (let i of daysOfWeek) {
      if (!inDay.includes(i)) {
        remainDay.push(i);
      }
    }

    // Auto-fill remaining days with duplicates from first 3 days
    for (let day of remainDay) {
      if (day === 'Day 4') {
        for (let i of weekRoutine) {
          if (i.day === 'Day 1') {
            let obj = {
              day: 'Day 4',
              workouts: i.workouts ? JSON.parse(JSON.stringify(i.workouts)) : []
            };
            weekRoutine.push(obj);
            break;
          }
        }
      }
      if (day === 'Day 5') {
        for (let i of weekRoutine) {
          if (i.day === 'Day 2') {
            let obj = {
              day: 'Day 5',
              workouts: i.workouts ? JSON.parse(JSON.stringify(i.workouts)) : []
            };
            weekRoutine.push(obj);
            break;
          }
        }
      }
      if (day === 'Day 6') {
        for (let i of weekRoutine) {
          if (i.day === 'Day 3') {
            let obj = {
              day: 'Day 6',
              workouts: i.workouts ? JSON.parse(JSON.stringify(i.workouts)) : []
            };
            weekRoutine.push(obj);
            break;
          }
        }
      }
    }

    // Sort by day number
    const newRoutine = weekRoutine.sort((a, b) => {
      const dayA = parseInt(a.day.replace('Day ', ''), 10);
      const dayB = parseInt(b.day.replace('Day ', ''), 10);
      return dayA - dayB;
    });

    // Validate all 6 days have workouts
    if (newRoutine.length < 6) {
      toast.error('Add workouts for all 6 days');
      return;
    }

    // Prepare final template data
    const finalTemplateData = {
      name: templateName,
      description: description,
      templateDays: newRoutine.map((day, idx) => ({
        dayNumber: idx + 1,
        name: day.day,
        templateWorkouts: (day.workouts || []).map(workout => ({
          exerciseName: workout.exerciseName || workout.Exercise || '',
          sets: workout.sets ? Object.keys(workout.sets).length : 0,
          reps: workout.reps || 10,
          bodyPartId: workout.bodyPartId || bodyParts[0]?.id || null,
          equipmentId: workout.equipmentId || equipment[0]?.id || null,
          notes: workout.notes || ''
        }))
      }))
    };

    // Add Day 7 if enabled
    if (isDay7Enabled && day7Workouts.length > 0) {
      finalTemplateData.templateDays.push({
        dayNumber: 7,
        name: 'Day 7',
        templateWorkouts: (day7Workouts || []).map(workout => ({
          exerciseName: workout.exerciseName || workout.Exercise || '',
          sets: workout.sets ? Object.keys(workout.sets).length : 0,
          reps: workout.reps || 10,
          bodyPartId: workout.bodyPartId || bodyParts[0]?.id || null,
          equipmentId: workout.equipmentId || equipment[0]?.id || null,
          notes: workout.notes || ''
        }))
      });
    }

    setSaving(true);
    try {
      const result = await createTemplate(finalTemplateData);
      if (result) {
        toast.success('Template created successfully!');
        setTimeout(() => {
          navigate('/template-manager');
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating template:', err);
      toast.error('Failed to create template');
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Create Workout Template</h1>
          <p className="mt-2 text-muted-foreground">Design a reusable template for your members</p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 5-Day Strength Split"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., A complete 6-day strength training program"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 bg-muted p-4 rounded-lg border border-border">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div>
                    <strong>Template Name:</strong> {templateName || 'Not set'}
                  </div>
                  <div>
                    <strong>Training Days:</strong> {isDay7Enabled ? '7' : '6'}
                  </div>
                  <div>
                    <strong>Status:</strong> <span className="text-green-500">New</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Days and Exercises */}
            <div>
              <h3 className="text-lg font-medium text-card-foreground mb-6">Weekly Schedule</h3>

              <div className="space-y-6">
                {daysOfWeek.map((day, index) => {
                  let res = (day === 'Day 4' || day === 'Day 5' || day === 'Day 6') && editInitialWorkOut;
                  return (
                    <div key={day}>
                      <AddWorkout
                        day={day}
                        index={index}
                        addSingleDayRoutine={addSingleDayRoutine}
                        initialWorkouts={selectedDays[day] || []}
                        selectedMember={null}
                        exercises={exercises}
                        capabilites={null}
                        editInitialWorkOut={res}
                        handleInitialEdit={handleInitialEdit}
                      />
                    </div>
                  );
                })}

                <div className="flex items-end pb-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDay7Enabled}
                      onChange={(e) => setIsDay7Enabled(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-card-foreground">Add 7th Day Workout</span>
                  </label>
                </div>

                {isDay7Enabled && (
                  <AddWorkout
                    key="Day 7"
                    day="Day 7"
                    index={6}
                    addSingleDayRoutine={addDay7Routine}
                    initialWorkouts={day7Workouts}
                    selectedMember={null}
                    exercises={exercises}
                    capabilites={null}
                    editInitialWorkOut={false}
                    handleInitialEdit={() => {}}
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !templateName || !description}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Creating...' : 'Create Template'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplate;
