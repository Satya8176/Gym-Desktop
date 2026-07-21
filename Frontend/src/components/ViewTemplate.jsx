import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ViewTemplate({ template }) {
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState([]);


  const toggleWorkout = (id) => {
    setExpandedWorkoutIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  if (!template) {
    return (
      <p className="text-muted-foreground text-center mt-4">
        No template selected
      </p>
    );
  }

  return (
    <div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-border space-y-4"
        >
          {template.templateDays?.map((day) => (
            <div key={day.id}>
              <h4 className="font-semibold text-card-foreground mb-3">
                {day.name}
              </h4>

              <div className="space-y-2 ml-4">
                {day.templateWorkouts?.length > 0 ? (
                  day.templateWorkouts.map((workout) => {
                    const expanded = expandedWorkoutIds.includes(workout.id);

                    return (
                      <div
                        key={workout.id}
                        className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-pointer border border-border"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWorkout(workout.id);
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-x-2 items-center">
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                              {workout.exercise?.name ||
                                workout.exerciseName ||
                                "Exercise"}
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {workout.exercise?.muscleGroup ||
                                workout.exercise?.bodyPart ||
                                "-"}
                            </div>
                          </div>

                          <div className="flex items-center gap-x-3">
                            <div className="text-[15px] text-gray-400 dark:text-gray-300">
                              Sets:{" "}
                              {(workout.sets && Array.isArray(workout.sets)
                                ? workout.sets
                                : []
                              ).length}
                            </div>

                            <div
                              className={`transform transition-transform text-gray-400 dark:text-gray-300 ${
                                expanded ? "rotate-90" : ""
                              }`}
                            >
                              ▸
                            </div>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {expanded && (
                          <div className="mt-2">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-gray-500 dark:text-gray-400 text-xs">
                                  <th className="py-1 text-[14px]">
                                    Set No.
                                  </th>
                                  <th className="py-1 text-[14px]">
                                    Weight
                                  </th>
                                  <th className="py-1 text-[14px]">
                                    Reps
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {(workout.sets && Array.isArray(workout.sets)
                                  ? workout.sets
                                  : []
                                ).map((s, idx) => (
                                  <tr
                                    key={s.id || idx}
                                    className="odd:bg-gray-50 dark:odd:bg-gray-800"
                                  >
                                    <td className="py-0 text-[13px]">
                                      {s.setNo || idx + 1}
                                    </td>
                                    <td className="py-0 text-[13px]">
                                      {s.weight} KG
                                    </td>
                                    <td className="py-0 text-[13px]">
                                      {s.repetitions || s.reps}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    No workouts scheduled
                  </p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ViewTemplate;