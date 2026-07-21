import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  createRoutineFun,
  generateRoutinePdf,
} from "../serviceFunctions/userRelatedFunc.js";
import toast from "react-hot-toast";
import { getAllTemplates } from "../serviceFunctions/templateFunctions.js";
import ViewTemplate from "./ViewTemplate.jsx";

const CreateRoutineFromTemplate = ({
  selectedMember,
  setSelectedMember,
  routineName,
  setRoutineName,
}) => {
  const { totalMembers } = useSelector((state) => state.dataSlice);
  const { totalExercies } = useSelector((state) => state.dataSlice);

  const [members, setMembers] = useState(totalMembers || []);
  const [availableExercise, setAvailableExercise] = useState(totalExercies || []);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [duration, setDuration] = useState("1 month");
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [viewTemplates, setViewTemplates] = useState(true);

  // Sync members when Redux populates after mount
  useEffect(() => {
    if (totalMembers && totalMembers.length > 0) {
      setMembers(totalMembers);
    }
  }, [totalMembers]);

  // Sync exercises when Redux populates after mount
  useEffect(() => {
    if (totalExercies && totalExercies.length > 0) {
      setAvailableExercise(totalExercies);
    }
  }, [totalExercies]);

  const filteredTemplates = (templates || []).filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description &&
        t.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Transforms a template into the same shape that the manual flow produces,
  // with each workout's sets deep-cloned for full isolation.
  const transformTemplateExact = (template) => {
    if (!template || !Array.isArray(template.templateDays)) return [];

    return template.templateDays.map((day) => ({
      day: day.name || "",
      workouts: (day.templateWorkouts || []).map((workout) => ({
        exerciseId: String(workout.exerciseId ?? ""),
        exerciseName:
          workout.exercise?.name || workout.exerciseName || "",
        Exercise:
          workout.exercise?.name || workout.exerciseName || "",
        // Deep-clone each set so exercises never share array references
        sets: (workout.sets || []).map((s, idx) => ({
          setNo: s.setNo ?? idx + 1,
          weight: String(s.weight ?? ""),
          reps: String(s.repetitions ?? s.reps ?? ""),
        })),
      })),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMember || !routineName) {
      toast.error("Routine name is required");
      return;
    }

    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    const finalWeekRoutine = transformTemplateExact(selectedTemplate);

    if (!finalWeekRoutine || finalWeekRoutine.length === 0) {
      toast.error("Selected template has no days configured");
      return;
    }

    const memberObj =
      (members || []).find((m) => m.enrollmentId === selectedMember) || null;

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
      await createRoutineFun(
        selectedMember,
        routineName,
        finalWeekRoutine,
        duration
      );
      setSelectedMember("");
      setRoutineName("");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error while preparing routine:", err);
      toast.error("Failed to create routine. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const templatesData = await getAllTemplates();
      setTemplates(templatesData || []);
      setLoading(false);
    };
    fetchAllData();
  }, []);

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
        <div className="bg-card rounded-xl shadow-sm border-b border-l border-r border-border p-8 min-h-[450px]">
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
                        value={`${i + 1} ${i === 0 ? "month" : "months"}`}
                      >
                        {i + 1} {i === 0 ? "month" : "months"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Template search + dropdown */}
            <div className="mb-6 relative">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setViewTemplates(true);
                }}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {viewTemplates &&
                (filteredTemplates.length === 0 ? (
                  <div className="absolute z-20 mt-2 w-full bg-card border border-border rounded-lg p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      No templates found
                    </p>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
                    >
                      Create Your First Template
                    </motion.button>
                  </div>
                ) : (
                  <div className="absolute z-20 mt-2 w-full bg-card border border-border rounded-lg overflow-hidden">
                    <div className="max-h-[210px] overflow-y-auto">
                      {filteredTemplates.map((template) => (
                        <motion.div
                          key={template.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-card border-b border-border p-6 last:border-none cursor-pointer"
                          onClick={() => {
                            const selected = templates.find(
                              (t) => t.id === template.id
                            );
                            setSelectedTemplate(selected);
                            setViewTemplates(false);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-card-foreground">
                                {template.name}
                              </h3>
                              <p className="text-muted-foreground mt-1">
                                {template.description}
                              </p>
                            </div>
                            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                              <span>
                                📅 {template.templateDays?.length || 0} days
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Show selected template preview */}
            {!viewTemplates && selectedTemplate && (
              <ViewTemplate template={selectedTemplate} />
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !selectedTemplate || !duration}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? "Creating..." : "Create Routine"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutineFromTemplate;
