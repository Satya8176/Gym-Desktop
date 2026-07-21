import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

function AddSets({
  ex,
  deleteWorkOut,
  addWorkOutHandler,
  deleteBtn,
  exDetail,
}) {
  // Stable exerciseId derived from the exercise object.
  // This never changes for a given mounted instance because AddWorkout
  // uses exerciseId as the React key, so a different exercise = new mount.
  const exerciseId = ex.exerciseId ?? ex.id;

  const [form, setForm] = useState({ reps: "", weight: "", setNo: 1 });


  // Fallback base values when no exDetail is provided
  const fallback = { maxWeight: "50kg", maxRepetion: "20" };

  // Initialise sets from ex.sets via lazy initialiser so the very first
  // render already has the correct data (no flash of empty state).
  const [sets, setSets] = useState(() =>
    ex && Array.isArray(ex.sets) && ex.sets.length > 0
      ? JSON.parse(JSON.stringify(ex.sets))
      : []
  );
  const [showSets, setShowSets] = useState(
    !!(ex && Array.isArray(ex.sets) && ex.sets.length > 0)
  );
  const [isSaved, setIsSaved] = useState(
    !!(ex && Array.isArray(ex.sets) && ex.sets.length > 0)
  );
  const [addSets, setAddSets] = useState(false);
  const [addSetVisiblity, setAddSetVisibility] = useState(false);
  const [percentWeight, setPercentWeight] = useState("");
  const [percentReps, setPercentReps] = useState("");

  // Re-sync ONLY when the exerciseId actually changes (i.e. a genuinely
  // different exercise object is passed in). This prevents sibling-state
  // bleed when another exercise is deleted and React re-renders siblings.
  const prevExIdRef = useRef(null);
  useEffect(() => {
    const incomingId = ex?.exerciseId ?? ex?.id;
    if (incomingId !== prevExIdRef.current) {
      prevExIdRef.current = incomingId;
      if (ex && Array.isArray(ex.sets) && ex.sets.length > 0) {
        setSets(JSON.parse(JSON.stringify(ex.sets)));
        setIsSaved(true);
        setShowSets(true);
      }
    }
  }, [ex]);

  // ── Helpers ──────────────────────────────────────────────────────────────

  function parseNumber(val) {
    if (val === undefined || val === null) return NaN;
    if (typeof val === "number") return val;
    const n = parseFloat(String(val).replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(n) ? n : NaN;
  }

  function getBaseWeight() {
    const candidate = exDetail?.maxWeight ?? fallback.maxWeight;
    const n = parseNumber(candidate);
    return Number.isFinite(n) ? n : 100;
  }

  function getBaseReps() {
    const candidate = exDetail?.maxReps ?? fallback.maxRepetion;
    const n = parseNumber(candidate);
    return Number.isFinite(n) ? n : 20;
  }

  function computeFromPercent(base, percent) {
    return Math.round(base * (percent / 100));
  }

  // ── Handlers ─────────────────────────────────────────────────────────────

  function setAddSetHandler() {
    setAddSetVisibility(true);
    setAddSets((prev) => !prev);
  }

  function handleSaveBtn() {
    const workout = {
      exerciseId: exerciseId,
      exerciseName: ex.name,
      Exercise: ex.name,
      // Deep-clone so the parent cannot mutate our local copy
      sets: JSON.parse(JSON.stringify(sets)),
    };
    setIsSaved(true);
    setAddSetVisibility(false);
    addWorkOutHandler(workout);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col px-6 py-3 text-left text-base text-gray-500 dark:text-gray-200 bg-slate-200 tracking-wider dark:bg-slate-900 my-2 rounded-lg">

      {/* Header row */}
      <div
        className="flex flex-row justify-between items-center cursor-pointer"
        onClick={() => setShowSets((prev) => !prev)}
      >
        <div>{ex.name}</div>
        <div className="flex flex-row gap-3">
          <div className="dark:text-white text-black font-bold">
            <ChevronDown size={20} color="currentColor" />
          </div>

          {/* Add Sets button — hidden once saved */}
          <button
            className={`hover:text-black hover:font-bold py-[4px] px-2 bg-blue-400 rounded-sm text-base hover:scale-90 text-blue-700 ${
              isSaved ? "hidden" : ""
            }`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAddSetHandler();
            }}
          >
            Add Sets
          </button>

          {/* Delete button — hidden when deleteBtn is false */}
          <button
            className={`hover:text-black hover:font-bold py-[4px] px-2 bg-red-400 rounded-sm text-base hover:scale-90 text-red-900 font-bold ${
              deleteBtn ? "" : "hidden"
            }`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              deleteWorkOut(exerciseId);
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Sets table / empty notice */}
      <div>
        {sets.length > 0 ? (
          showSets && (
            <div className="rounded-t-sm overflow-hidden mt-2">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-300 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                      Set No.
                    </th>
                    <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-1.5 w-[25%] text-left text-[14px] text-gray-500 dark:text-gray-200 tracking-wider">
                      Reps
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-100 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sets.map((set, index) => (
                    <motion.tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                        <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                          {set.setNo}
                        </div>
                      </td>
                      <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                        <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                          {set.weight} KG
                        </div>
                      </td>
                      <td className="px-6 py-1.5 w-[25%] whitespace-nowrap">
                        <div className="text-[14px] font-medium text-gray-900 dark:text-white">
                          {set.reps}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          !addSets && (
            <div className="text-[13px] dark:text-yellow-300 text-red-400">
              No Sets Added
            </div>
          )
        )}

        {/* Add set input row */}
        {addSets && addSetVisiblity && (
          <div className="flex gap-x-3 my-3 py-1 px-2 items-center rounded-lg border-2 dark:border-slate-500 border-slate-400">

            {/* Set number label */}
            <div className="flex flex-row gap-2 items-center w-[20%]">
              <div className="block text-sm font-medium text-card-foreground">
                SetNo.
              </div>
            </div>

            {/* Weight input */}
            <div className="flex flex-row gap-2 items-center">
              <label className="block text-sm font-medium text-card-foreground">
                Weight
              </label>
              <div className="flex items-center gap-2">
                {exDetail && (
                  <select
                    value={percentWeight}
                    onChange={(e) => {
                      const p = e.target.value;
                      setPercentWeight(p);
                      if (!p) return;
                      const computed = computeFromPercent(getBaseWeight(), Number(p));
                      setForm((prev) => ({ ...prev, weight: String(computed) }));
                    }}
                    className="px-2 py-1 bg-input border border-border rounded-sm"
                  >
                    <option value="">%</option>
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
                      <option key={v} value={v}>{v}%</option>
                    ))}
                  </select>
                )}
                <input
                  type="number"
                  min="0"
                  value={form.weight}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) {
                      setForm((prev) => ({ ...prev, weight: val }));
                      if (percentWeight) setPercentWeight("");
                    }
                  }}
                  className="w-[30%] px-2 py-1 bg-input text-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0 KG"
                />
              </div>
            </div>

            {/* Reps input */}
            <div className="flex flex-row gap-2 items-center">
              <label className="block text-sm font-medium text-card-foreground">
                Reps
              </label>
              <div className="flex items-center gap-2">
                {exDetail && (
                  <select
                    value={percentReps}
                    onChange={(e) => {
                      const p = e.target.value;
                      setPercentReps(p);
                      if (!p) return;
                      const computed = computeFromPercent(getBaseReps(), Number(p));
                      setForm((prev) => ({ ...prev, reps: String(computed) }));
                    }}
                    className="px-2 py-1 bg-input border border-border rounded-sm"
                  >
                    <option value="">%</option>
                    {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((v) => (
                      <option key={v} value={v}>{v}%</option>
                    ))}
                  </select>
                )}
                <input
                  type="number"
                  min="0"
                  value={form.reps}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) {
                      setForm((prev) => ({ ...prev, reps: val }));
                      if (percentReps) setPercentReps("");
                    }
                  }}
                  className="w-[20%] px-1 py-1 bg-input text-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Add button */}
            <button
              type="button"
              className="w-[10%] h-fit text-blue-700 hover:font-bold hover:text-blue-900 py-1 px-2 bg-blue-400 rounded-sm hover:scale-95"
              onClick={() => {
                const hasWeight = form.weight.length > 0;
                const hasReps = form.reps.length > 0;
                if (!hasWeight && !hasReps) {
                  toast.error("Enter weight or reps first");
                  return;
                }
                setSets((prev) => [
                  ...prev,
                  {
                    setNo: form.setNo,
                    weight: form.weight === "" ? "" : parseInt(form.weight, 10),
                    reps: form.reps === "" ? "" : parseInt(form.reps, 10),
                  },
                ]);
                setShowSets(true);
                setForm((prev) => ({
                  reps: "",
                  weight: "",
                  setNo: prev.setNo + 1,
                }));
                setPercentWeight("");
                setPercentReps("");
              }}
            >
              Add
            </button>

            {/* Close input row */}
            <button
              type="button"
              className="text-2xl text-red-500 font-bold px-2 hover:cursor-pointer"
              onClick={setAddSetHandler}
            >
              X
            </button>
          </div>
        )}
      </div>

      {/* Save sets button — hidden when no sets or already saved */}
      <button
        className={`w-fit h-fit text-green-800 hover:font-bold hover:text-green-900 py-1 px-2 bg-green-400 rounded-sm hover:scale-95 mt-2 ml-[94%] ${
          sets.length === 0 || isSaved ? "hidden" : ""
        }`}
        onClick={handleSaveBtn}
        type="button"
      >
        Save
      </button>
    </div>
  );
}

export default AddSets;
