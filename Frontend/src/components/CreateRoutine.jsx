import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Save } from 'lucide-react';
import AddWorkout from './AddWorkout.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  createRoutineFun,
  fetchUserTests,
  generateRoutinePdf,
  getAllExercise,
  getMembers,
} from '../serviceFunctions/userRelatedFunc.js';
import { setAllExercises, setUsers } from '../redux/slices/dataSlice.js';
import toast from 'react-hot-toast';

const CreateRoutine = ({ selectedMember, setSelectedMember, routineName, setRoutineName }) => {
  const dispatch = useDispatch();
  const { totalMembers } = useSelector((state) => state.dataSlice);
  const { totalExercies } = useSelector((state) => state.dataSlice);

  // FIX: Initialize loading true only when a fetch will actually be needed.
  // Evaluated at creation time — same pattern as HomePage — so first render
  // is always the spinner if data isn't ready, with no page→spinner flash.
  const needsFetch = !totalMembers || totalMembers.length === 0;
  const [loading, setLoading] = useState(needsFetch);

  // FIX: seed state from Redux synchronously at construction time.
  // This means if the parent already fetched the data, these are populated
  // immediately and no sync useEffect is needed (eliminating extra renders).
  const [members, setMembers] = useState(totalMembers || []);

  // FIX: Use a ref to hold availableExercise that is passed to AddWorkout.
  // Previously this was a state value synced from totalExercies via useEffect.
  // Every time that useEffect ran it created a NEW array reference, causing
  // the `exercises` dep in AddWorkout's initialWorkouts effect to fire again
  // for all 6 day instances → 6 extra re-renders on every Redux update.
  // Now we hold the stable array in a ref; state is only used to trigger
  // a single re-render when the value first becomes available.
  const exercisesRef = useRef(totalExercies || []);
  const [availableExercise, setAvailableExercise] = useState(totalExercies || []);

  const [selectedDays, setSelectedDays] = useState({});
  const [saving, setSaving] = useState(false);
  const [showTestTable, setShowTestTable] = useState(null);
  const [duration, setDuration] = useState('1 month');
  const [isDay7Enabled, setIsDay7Enabled] = useState(false);
  const [day7Workouts, setDay7Workouts] = useState([]);
  const [weekRoutine, setWeekRoutine] = useState([]);
  const [userEditedDays, setUserEditedDays] = useState({});

  const daysOfWeek = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
  const DAY_PROPAGATION_MAP = {
    'Day 1': 'Day 4',
    'Day 2': 'Day 5',
    'Day 3': 'Day 6',
  };

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // FIX: Removed the two "sync from Redux" useEffects for members and exercises.
  // Those effects ran whenever totalMembers/totalExercies references changed in Redux,
  // causing extra renders. Instead we seed state synchronously at useState() init above,
  // and the fetch effect below sets state exactly once after the fetch completes.

  // Fetch member test data when member prop changes
  useEffect(() => {
    if (!selectedMember) {
      setShowTestTable(null);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const data = await fetchUserTests(selectedMember);
      if (!cancelled && mountedRef.current) {
        setShowTestTable({ maxWeight: data.maxWeight, maxReps: data.maxReps });
      }
    };
    run();
    return () => { cancelled = true; };
  }, [selectedMember]);

  // Fetch members + exercises if not in Redux yet.
  // FIX: guarded by fetchStartedRef so this runs at most once even in
  // React StrictMode (which mounts/unmounts effects twice in development).
  const fetchStartedRef = useRef(false);
  useEffect(() => {
    if (!needsFetch) return; // data already in Redux — nothing to do
    if (fetchStartedRef.current) return;
    fetchStartedRef.current = true;

    const run = async () => {
      try {
        const data = await getMembers();
        if (!mountedRef.current) return;
        dispatch(setUsers(data));
        setMembers(data);

        const data2 = await getAllExercise();
        if (!mountedRef.current) return;
        dispatch(setAllExercises(data2));
        // Update both the ref and state together in one pass
        exercisesRef.current = data2;
        setAvailableExercise(data2);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — runs exactly once on mount

  function markDayEdited(day) {
    setUserEditedDays((prev) => ({ ...prev, [day]: true }));
  }

  function addSingleDayRoutine(obj) {
    const clonedWorkouts = obj.workouts
      ? JSON.parse(JSON.stringify(obj.workouts))
      : [];

    setWeekRoutine((prev) => {
      const others = prev.filter((p) => p.day !== obj.day);
      return [...others, { day: obj.day, workouts: clonedWorkouts }];
    });

    const targetDay = DAY_PROPAGATION_MAP[obj.day];

    setSelectedDays((prev) => {
      const next = { ...prev };
      next[obj.day] = JSON.parse(JSON.stringify(clonedWorkouts));
      if (targetDay && !userEditedDays[targetDay]) {
        next[targetDay] = JSON.parse(JSON.stringify(clonedWorkouts));
      }
      return next;
    });

    if (targetDay && !userEditedDays[targetDay]) {
      setWeekRoutine((prev) => {
        const others = prev.filter((p) => p.day !== targetDay);
        return [
          ...others,
          { day: targetDay, workouts: JSON.parse(JSON.stringify(clonedWorkouts)) },
        ];
      });
    }
  }

  function addDay7Routine(obj) {
    setDay7Workouts(
      obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : []
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMember || !routineName) {
      toast.error('Routine name required');
      return;
    }

    const inDay = weekRoutine
      .filter((i) => daysOfWeek.includes(i.day))
      .map((i) => i.day);
    const remainDay = daysOfWeek.filter((d) => !inDay.includes(d));

    const weekRoutineCopy = JSON.parse(JSON.stringify(weekRoutine));

    for (let day of remainDay) {
      const sourceDay =
        day === 'Day 4' ? 'Day 1' :
        day === 'Day 5' ? 'Day 2' :
        day === 'Day 6' ? 'Day 3' : null;

      if (sourceDay) {
        const src = weekRoutineCopy.find((i) => i.day === sourceDay);
        if (src) {
          weekRoutineCopy.push({
            day,
            workouts: JSON.parse(JSON.stringify(src.workouts || [])),
          });
        }
      }
    }

    const newRoutine = weekRoutineCopy.sort(
      (a, b) =>
        parseInt(a.day.replace('Day ', ''), 10) -
        parseInt(b.day.replace('Day ', ''), 10)
    );

    if (newRoutine.length !== 6) {
      toast.error('Add Workout for Each days');
      return;
    }

    const memberObj =
      (members || []).find((m) => m.enrollmentId === selectedMember) || null;
    const finalWeekRoutine = [...newRoutine];

    if (isDay7Enabled && day7Workouts.length > 0) {
      finalWeekRoutine.push({
        day: 'Day 7',
        workouts: JSON.parse(JSON.stringify(day7Workouts)),
      });
    }

    const pdfObj = {
      Membername: memberObj ? memberObj.name : selectedMember,
      Name: routineName,
      WeekRoutine: finalWeekRoutine,
      availableExercise: availableExercise,
      duration: duration,
    };

    generateRoutinePdf(pdfObj);
    setSaving(true);

    try {
      await createRoutineFun(selectedMember, routineName, finalWeekRoutine, duration);
      setSelectedMember('');
      setRoutineName('');
      setSelectedDays({});
      setWeekRoutine([]);
    } catch (err) {
      console.error('Error while preparing routine:', err);
      toast.error('Failed to create routine. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading data...</div>
        </div>
      </div>
    );
  }

  if (!selectedMember) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">First select a member</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground translate-y-[-32px]">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-xl shadow-sm border-b border-l border-r border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Duration */}
            <div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option
                        key={i + 1}
                        value={`${i + 1} ${i === 0 ? 'month' : 'months'}`}
                      >
                        {i + 1} {i === 0 ? 'month' : 'months'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Weekly Schedule */}
            <div>
              <h3 className="text-lg font-medium text-card-foreground mb-6">
                Weekly Schedule
              </h3>
              <div className="space-y-6">
                {daysOfWeek.map((day, index) => {
                  const hasPropagatedData =
                    (day === 'Day 4' || day === 'Day 5' || day === 'Day 6') &&
                    (selectedDays[day] || []).length > 0 &&
                    !userEditedDays[day];

                  return (
                    <div key={day}>
                      <AddWorkout
                        key={day}
                        day={day}
                        index={index}
                        addSingleDayRoutine={addSingleDayRoutine}
                        initialWorkouts={selectedDays[day] || []}
                        selectedMember={selectedMember}
                        exercises={availableExercise}
                        capabilites={showTestTable}
                        editInitialWorkOut={hasPropagatedData}
                        handleInitialEdit={() => markDayEdited(day)}
                        onUserEdit={markDayEdited}
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
                    <span className="text-sm font-medium text-card-foreground">
                      Add 7th Day Workout
                    </span>
                  </label>
                </div>

                {isDay7Enabled && (
                  <AddWorkout
                    key="Day 7"
                    day="Day 7"
                    index={6}
                    addSingleDayRoutine={addDay7Routine}
                    initialWorkouts={day7Workouts}
                    selectedMember={selectedMember}
                    exercises={availableExercise}
                    capabilites={showTestTable}
                    editInitialWorkOut={false}
                    handleInitialEdit={() => {}}
                    onUserEdit={() => {}}
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !selectedMember}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
