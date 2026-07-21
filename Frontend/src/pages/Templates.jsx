import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Save,
  Calendar,
} from "lucide-react";
import {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getAllBodyParts,
  getAllEquipment,
} from "../serviceFunctions/templateFunctions";
import { getAllExercise } from "../serviceFunctions/userRelatedFunc";
import Navbar from "../components/Navbar";
import AddWorkout from "../components/AddWorkout";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAllExercises } from "../redux/slices/dataSlice";
import { confirmAction } from "../utils/ConfirmAction";

const Templates = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { totalExercies } = useSelector((state) => state.dataSlice);
  const [templates, setTemplates] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [exercises, setExercises] = useState(totalExercies);
  const [loading, setLoading] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [exerciseLoading, setExerciseLoading] = useState(true);
  // const navigate = useNavigate();

  const toggleWorkout = (id) => {
    if (!id) return;
    setExpandedWorkoutIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  const [activeTab, setActiveTab] = useState("view"); // 'view' or 'create'

  // Create/Edit form state
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState({});
  const [weekRoutine, setWeekRoutine] = useState([]);
  const [userEditedDays, setUserEditedDays] = useState({});
  const [editInitialWorkOut, setInitialWorkOut] = useState(true);
  const [isDay7Enabled, setIsDay7Enabled] = useState(false);
  const [day7Workouts, setDay7Workouts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  const daysOfWeek = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"];

  // Load data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      if (!exercises || exercises.length === 0) {
        const exercisesData = await getAllExercise();
        dispatch(setAllExercises(exercisesData));
        setExercises(exercisesData);
      } else {
        setExercises(totalExercies);
      }
    };
    fetchExercises();
  }, [totalExercies, dispatch]);

  const fetchAllData = async () => {
    setLoading(true);
    const [templatesData, bodyPartsData, equipmentData] = await Promise.all([
      getAllTemplates(),
      getAllBodyParts(),
      getAllEquipment(),
    ]);
    setTemplates(templatesData);
    setBodyParts(bodyPartsData);
    setEquipment(equipmentData);
    setLoading(false);
  };

  function markDayEdited(day) {
    setUserEditedDays((prev) => ({ ...prev, [day]: true }));
  }

  function addSingleDayRoutine(obj) {
    // keep the existing array (for any other usage)
    setWeekRoutine((prev) => {
      // replace existing entry for same day if present
      const others = prev.filter((p) => p.day !== obj.day);
      // store a clone to avoid sharing references between days
      const objToStore = {
        ...obj,
        workouts: obj.workouts ? JSON.parse(JSON.stringify(obj.workouts)) : [],
      };
      return [...others, objToStore];
    });

    // also store in selectedDays (used on submit)
    setSelectedDays((prev) => {
      const next = { ...prev };
      next[obj.day] = obj.workouts
        ? JSON.parse(JSON.stringify(obj.workouts))
        : [];

      // duplicate mapping: Monday->Thursday, Tuesday->Friday, Wednesday->Saturday
      const idx = daysOfWeek.indexOf(obj.day);
      if (idx >= 0 && idx < 3) {
        const mappedDay = daysOfWeek[idx + 3];
        // only auto-copy if the mapped day hasn't been edited by the user
        if (!userEditedDays[mappedDay]) {
          next[mappedDay] = obj.workouts
            ? JSON.parse(JSON.stringify(obj.workouts))
            : [];
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

  const handleCreateTemplate = async (e) => {
    e.preventDefault();

    if (!templateName.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (!description.trim()) {
      toast.error("Template description is required");
      return;
    }

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

    for (let day of remainDay) {
      if (day === "Day 4") {
        for (let i of weekRoutine) {
          if (i.day === "Day 1") {
            let obj = {
              day: "Day 4",
              workouts: i.workouts
                ? JSON.parse(JSON.stringify(i.workouts))
                : [],
            };
            weekRoutine.push(obj);
            break;
          }
        }
      }
      if (day === "Day 5") {
        for (let i of weekRoutine) {
          if (i.day === "Day 2") {
            let obj = {
              day: "Day 5",
              workouts: i.workouts
                ? JSON.parse(JSON.stringify(i.workouts))
                : [],
            };
            weekRoutine.push(obj);
            break;
          }
        }
      }
      if (day === "Day 6") {
        for (let i of weekRoutine) {
          if (i.day === "Day 3") {
            let obj = {
              day: "Day 6",
              workouts: i.workouts
                ? JSON.parse(JSON.stringify(i.workouts))
                : [],
            };
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

    const finalWeekRoutine = [...newRoutine];
    if (isDay7Enabled && day7Workouts.length > 0) {
      finalWeekRoutine.push({
        day: "Day 7",
        workouts: day7Workouts,
      });
    }

    if (isDay7Enabled) {
      if (finalWeekRoutine.length !== 7) {
        toast.error("Add workouts for all 7 days");
        return;
      }
    } else {
      if (finalWeekRoutine.length !== 6) {
        toast.error("Add workouts for all 6 days");
        return;
      }
    }

    const finalTemplateData = {
      name: templateName,
      description: description,
      templateDays: finalWeekRoutine,
    };

    setSaving(true);
    try {
      const result = await createTemplate(finalTemplateData);
      if (result) {
        toast.success("Template created successfully!");
        setTemplateName("");
        setDescription("");
        setSelectedDays({});
        setWeekRoutine([]);
        setUserEditedDays({});
        setInitialWorkOut(true);
        setIsDay7Enabled(false);
        setDay7Workouts([]);
        await fetchAllData();
        setActiveTab("view");
      }
    } catch (err) {
      console.error("Error creating template:", err);
      toast.error("Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction(
      "Are you sure about deleting this template?",
    );
    if (confirmed) {
      const success = await deleteTemplate(id);
      if (success) {
        setTemplates(templates.filter((t) => t.id !== id));
        toast.success("Template deleted successfully");
      }
    }
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description &&
        t.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  useEffect(() => {
    const run = async () => {
      try {
        if (!totalExercies || totalExercies.length === 0) {
          const data = await getAllExercise();

          dispatch(setAllExercises(data));
          setExercises(data);
        } else {
          setExercises(totalExercies);
        }
      } finally {
        setExerciseLoading(false);
      }
    };

    run();
  }, [totalExercies, dispatch]);

  useEffect(() => {
    // wait until exercise fetch completes
    if (exerciseLoading) return;
    // wait until loading finishes
    if (loading) return;

    // avoid duplicate toast in React Strict Mode
    if (toastShown) return;

    // check if exercises are empty
    if (!exercises || exercises.length === 0) {
      setToastShown(true);

      toast.error(
        "No exercises available. Please create exercises first to build templates.",
        {
          duration: 3000, // visible for 3 sec
        },
      );

      // small delay so user can read toast
      setTimeout(() => {
        navigate("/create-exercise");
      }, 3000);
    }
  }, [exercises, loading, navigate, toastShown]);

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Template Management</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage workout templates
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <motion.button
            onClick={() => setActiveTab("view")}
            className={`px-6 py-2 font-medium transition-colors ${
              activeTab === "view"
                ? "text-primary border-b-2 border-primary -mb-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Templates
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 font-medium transition-colors ${
              activeTab === "create"
                ? "text-primary border-b-2 border-primary -mb-px"
                : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Template
          </motion.button>
        </div>

        {/* View Templates Tab */}
        {activeTab === "view" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Templates List */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No templates found</p>
                <motion.button
                  onClick={() => setActiveTab("create")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
                >
                  Create Your First Template
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card border border-border rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-card-foreground">
                          {template.name}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                          <span>
                            📅 {template.templateDays?.length || 0} days
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(template.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Expand/Collapse */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setExpandedTemplate(
                          expandedTemplate === template.id ? null : template.id,
                        )
                      }
                      className="flex items-center gap-2 text-primary hover:text-primary/80 mt-4 transition-colors"
                    >
                      {expandedTemplate === template.id ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                      {expandedTemplate === template.id ? "Hide" : "View"}{" "}
                      Details
                    </motion.button>

                    {/* Template Details */}
                    <AnimatePresence>
                      {expandedTemplate === template.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-border space-y-4"
                        >
                          {template.templateDays?.map((day, dayIdx) => (
                            <div key={dayIdx}>
                              <h4 className="font-semibold text-card-foreground mb-3">
                                {day.name}
                              </h4>
                              <div className="space-y-2 ml-4">
                                {day.templateWorkouts?.length > 0 ? (
                                  day.templateWorkouts.map(
                                    (workout, workoutIdx) => {
                                      const expanded =
                                        expandedWorkoutIds.includes(workout.id);
                                      return (
                                        <div
                                          key={workout.id || workoutIdx}
                                          className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-pointer border border-border"
                                          role="button"
                                          tabIndex={0}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWorkout(workout.id);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter")
                                              toggleWorkout(workout.id);
                                          }}
                                          aria-expanded={expanded}
                                        >
                                          <div className="flex items-center justify-between">
                                            <div className="flex gap-x-2 items-center">
                                              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                                {workout.exercise?.name ||
                                                  workout.exerciseName ||
                                                  "Exercise"}
                                              </div>
                                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {workout.exercise
                                                  ?.muscleGroup ||
                                                  workout.exercise?.bodyPart ||
                                                  "-"}
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-x-3">
                                              <div className="text-[15px] text-gray-400 dark:text-gray-300">
                                                Sets:{" "}
                                                {
                                                  (workout.sets &&
                                                  Array.isArray(workout.sets)
                                                    ? workout.sets
                                                    : []
                                                  ).length
                                                }
                                              </div>
                                              <div
                                                className={`transform transition-transform text-gray-400 dark:text-gray-300 ${expanded ? "rotate-90" : ""}`}
                                              >
                                                ▸
                                              </div>
                                            </div>
                                          </div>

                                          {expanded && (
                                            <div className="mt-2">
                                              <table className="w-full text-sm">
                                                <thead>
                                                  <tr className="text-left text-gray-500 dark:text-gray-400 text-xs">
                                                    <th className="py-1 dark:text-slate-100 text-[14px]">
                                                      Set No.
                                                    </th>
                                                    <th className="py-1 dark:text-slate-100 text-[14px]">
                                                      Weight
                                                    </th>
                                                    <th className="py-1 dark:text-slate-100 text-[14px]">
                                                      Reps
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {(workout.sets &&
                                                  Array.isArray(workout.sets)
                                                    ? workout.sets
                                                    : []
                                                  ).map((s, sIdx) => (
                                                    <tr
                                                      key={s.id || sIdx}
                                                      className="odd:bg-gray-50 dark:odd:bg-gray-800"
                                                    >
                                                      <td className="py-0 dark:text-slate-200 text-[13px]">
                                                        {s.setNo || sIdx + 1}
                                                      </td>
                                                      <td className="py-0 dark:text-slate-200 text-[13px]">
                                                        {s.weight} KG
                                                      </td>
                                                      <td className="py-0 dark:text-slate-200 text-[13px]">
                                                        {s.repetitions ||
                                                          s.reps}
                                                      </td>
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    },
                                  )
                                ) : (
                                  <p className="text-muted-foreground text-sm italic">
                                    No workouts scheduled
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Create Template Tab */}
        {activeTab === "create" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-xl shadow-sm border border-border p-8"
          >
            <form onSubmit={handleCreateTemplate} className="space-y-8">
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
                      <strong>Template Name:</strong>{" "}
                      {templateName || "Not set"}
                    </div>
                    <div>
                      <strong>Training Days:</strong>{" "}
                      {isDay7Enabled ? "7" : "6"}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <span className="text-green-500">New</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Schedule */}
              <div>
                <h3 className="text-lg font-medium text-card-foreground mb-6">
                  Weekly Schedule
                </h3>

                {
                  <div className="space-y-6">
                    {daysOfWeek.map((day, index) => {
                      let res =
                        (day === "Day 4" ||
                          day === "Day 5" ||
                          day === "Day 6") &&
                        editInitialWorkOut;
                      return (
                        <div>
                          <AddWorkout
                            key={day}
                            day={day}
                            index={index}
                            addSingleDayRoutine={addSingleDayRoutine}
                            initialWorkouts={selectedDays[day] || []}
                            exercises={exercises}
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
                        exercises={exercises}
                        editInitialWorkOut={false}
                        handleInitialEdit={() => {}}
                      />
                    )}
                  </div>
                }
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5" />
                  <span>{saving ? "Creating..." : "Create Template"}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Templates;
