import React from "react";
import AddWorkout from "./AddWorkout.jsx";

function CreateManually({
  daysOfWeek,
  addSingleDayRoutine,
  selectedDays,        // object keyed by day name e.g. { 'Day 1': [...], 'Day 4': [...] }
  selectedMember,
  exercises,
  capabilites,
  isDay7Enabled,
  setIsDay7Enabled,    // must be passed from parent — used by the Day 7 checkbox
  addDay7Routine,      // must be passed from parent — saves Day 7 workouts
  day7Workouts,        // must be passed from parent — current Day 7 workouts
  onUserEdit,          // must be passed from parent — signals when a target day is edited
  userEditedDays,      // must be passed from parent — tracks which days user has manually edited
}) {
  return (
    <div>
      <div>
        <h3 className="text-lg font-medium text-card-foreground mb-6">
          Weekly Schedule
        </h3>

        <div className="space-y-6">
          {daysOfWeek.map((day, index) => {
            // Show Edit button on Day 4/5/6 only when they have propagated
            // data and the user hasn't already unlocked them for editing.
            const hasPropagatedData =
              (day === "Day 4" || day === "Day 5" || day === "Day 6") &&
              (selectedDays[day] || []).length > 0 &&
              !(userEditedDays || {})[day];

            return (
              <div key={day}>
                <AddWorkout
                  key={day}
                  day={day}
                  index={index}
                  addSingleDayRoutine={addSingleDayRoutine}
                  initialWorkouts={selectedDays[day] || []}
                  selectedMember={selectedMember}
                  exercises={exercises}
                  capabilites={capabilites}
                  editInitialWorkOut={hasPropagatedData}
                  handleInitialEdit={() =>
                    typeof onUserEdit === "function" && onUserEdit(day)
                  }
                  onUserEdit={onUserEdit}
                />
              </div>
            );
          })}

          {/* Day 7 toggle */}
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
              exercises={exercises}
              capabilites={capabilites}
              editInitialWorkOut={false}
              handleInitialEdit={() => {}}
              onUserEdit={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateManually;
