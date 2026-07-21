import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTests,
  getAllExercise,
  getMembers,
} from "../serviceFunctions/userRelatedFunc.js";
import { setAllExercises, setUsers } from "../redux/slices/dataSlice.js";
import toast from "react-hot-toast";
import CreateRoutine from "../components/CreateRoutine.jsx";
import CreateRoutineFromTemplate from "../components/CreateRoutineFromTemplate.jsx";

const CreateRoutineHomePage = () => {
  const dispatch = useDispatch();
  const { totalMembers } = useSelector((state) => state.dataSlice);
  const { totalExercies } = useSelector((state) => state.dataSlice);

  // FIX: Initialize loading to true ONLY when we know we will need to fetch.
  // This is evaluated once at component creation (not inside useEffect) so the
  // very first render already shows the spinner — eliminating the flash of the
  // page UI before the spinner appears.
  const needsFetch = !totalMembers || totalMembers.length === 0;
  const [loading, setLoading] = useState(needsFetch);

  const [members, setMembers] = useState(totalMembers || []);
  const [memberSearch, setMemberSearch] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [routineName, setRoutineName] = useState("");
  const [showTestTable, setShowTestTable] = useState(null);
  const [routineMethod, setRoutineMethod] = useState(null);

  const memberInputRef = useRef(null);
  // FIX: track mounted state to avoid setState after unmount (StrictMode / fast nav)
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // Sync members from Redux when it loads after mount.
  // FIX: also clear loading here when Redux already had data (needsFetch was false
  // but totalMembers reference changed — harmless, but keeps members in sync).
  useEffect(() => {
    if (totalMembers && totalMembers.length > 0) {
      setMembers(totalMembers);
    }
  }, [totalMembers]);

  // Close member dropdown on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e) {
      if (memberInputRef.current && !memberInputRef.current.contains(e.target)) {
        setShowMemberDropdown(false);
      }
    }
    function handleKey(e) {
      if (e.key === "Escape") setShowMemberDropdown(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Fetch member test data when member changes
  useEffect(() => {
    if (!selectedMember) {
      setShowTestTable(null);
      return;
    }
    let cancelled = false;
    const run = async () => {
      const data = await fetchUserTests(selectedMember);
      // FIX: ignore result if component unmounted or member changed again
      if (!cancelled && mountedRef.current) {
        setShowTestTable({ maxWeight: data.maxWeight, maxReps: data.maxReps });
      }
    };
    run();
    return () => { cancelled = true; };
  }, [selectedMember]);

  // Keep the search input text in sync when selectedMember is set
  useEffect(() => {
    if (selectedMember) {
      const m = (members || []).find((x) => x.enrollmentId === selectedMember);
      if (m) setMemberSearch(m.name);
    }
  }, [selectedMember, members]);

  // Fetch members + exercises if not already in Redux.
  // FIX: guard with a ref so this never runs twice (React StrictMode mounts
  // effects twice in dev; without the guard that causes two parallel fetches,
  // two dispatch calls, and two setLoading(false) calls out of order).
  const fetchStartedRef = useRef(false);
  useEffect(() => {
    if (!totalMembers || totalMembers.length === 0) {
      if (fetchStartedRef.current) return; // already fetching — do not start again
      fetchStartedRef.current = true;
      const run = async () => {
        // loading was already set true at useState init, no need to set again
        try {
          const data = await getMembers();
          if (!mountedRef.current) return;
          dispatch(setUsers(data));
          setMembers(data);
          const data2 = await getAllExercise();
          if (!mountedRef.current) return;
          dispatch(setAllExercises(data2));
        } finally {
          if (mountedRef.current) setLoading(false);
        }
      };
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — we only want this to run once on mount

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
          <h1 className="text-3xl font-bold">Create Workout</h1>
          <p className="mt-2 text-muted-foreground">
            Design workout for your members
          </p>
        </div>

        {/* Member picker + Routine name */}
        <div className="bg-card rounded-xl shadow-sm border-t border-l border-r border-border p-8">
          <div className="space-y-8">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Member search */}
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
                        if (v === "") setSelectedMember("");
                      }}
                      onFocus={() => setShowMemberDropdown(true)}
                      placeholder="Search or choose a member..."
                      className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />

                    {showMemberDropdown && (
                      <ul className="absolute z-20 mt-1 max-h-32 w-full overflow-auto rounded-md bg-card border border-border shadow-lg">
                        {(members || [])
                          .filter((m) => {
                            const q = (memberSearch || "").toLowerCase();
                            return (
                              !q ||
                              m.name.toLowerCase().includes(q) ||
                              (m.enrollmentId &&
                                String(m.enrollmentId).toLowerCase().includes(q))
                            );
                          })
                          .map((member) => (
                            <li
                              key={member.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setSelectedMember(member.enrollmentId);
                                setMemberSearch(member.name);
                                setShowMemberDropdown(false);
                                setRoutineMethod(null);
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
                          <li className="px-3 py-2 text-sm text-muted-foreground">
                            No members found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Routine name */}
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Strength Training - Week 1"
                  />
                </div>
              </div>

              {/* Selected member detail card */}
              {selectedMember && (
                <div className="mt-4 bg-muted p-4 rounded-lg border border-border text-xl pt-3">
                  {(() => {
                    const selected = (members || []).find(
                      (m) => m.enrollmentId === selectedMember
                    );
                    if (!selected) return null;
                    return (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
                          <p>
                            <strong>Height:</strong>{" "}
                            {selected.height ? `${selected.height} cm` : "N/A"}
                          </p>
                          <p>
                            <strong>Weight:</strong>{" "}
                            {selected.weight ? `${selected.weight} kg` : "N/A"}
                          </p>
                          <p>
                            <strong>Purpose:</strong>{" "}
                            {selected.purpose || "N/A"}
                          </p>
                          <p>
                            <strong>Age:</strong> {selected.age || "N/A"}
                          </p>
                          <p>
                            <strong>Gender:</strong> {selected.gender || "N/A"}
                          </p>
                        </div>

                        {showTestTable && (
                          <div className="mt-3 w-[56%]">
                            <div className="flex text-sm justify-between text-muted-foreground">
                              <div className="flex gap-x-2">
                                <div className="font-bold">Maximum Weight:</div>
                                <div>{`${showTestTable.maxWeight} KG`}</div>
                              </div>
                              <div className="flex gap-x-2">
                                <div className="font-bold">Maximum Reps:</div>
                                <div>{`${showTestTable.maxReps} Reps`}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Back button */}
              {routineMethod && (
                <button
                  type="button"
                  className="text-black hover:font-bold mt-5 px-2 py-1 bg-blue-400 rounded-sm text-[20px] hover:scale-90 font-semibold"
                  onClick={() => setRoutineMethod(null)}
                >
                  <div className="flex flex-row items-center justify-between">
                    <ChevronLeft className="text-[22px]" />
                    <p>Back</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Method chooser */}
        {!routineMethod && (
          <div className="flex flex-row justify-between w-[99%] mt-5 mx-auto">
            <button
              type="button"
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 w-52"
              onClick={() => {
                if (!selectedMember) {
                  toast.error("Please select a member first");
                  return;
                }
                if(!showTestTable){
                  toast.error("No test found for this member");
                  return;
                }
                if (!routineName.trim()) {
                  toast.error("Please enter a workout name first");
                  return;
                }
                setRoutineMethod("manually");
              }}
            >
              Add Manually
            </button>
            <button
              type="button"
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 w-52"
              onClick={() => {
                if (!selectedMember) {
                  toast.error("Please select a member first");
                  return;
                }
                if (!showTestTable) {
                  toast.error("There is no test for this member");
                  return;
                }
                if (!routineName.trim()) {
                  toast.error("Please enter a workout name first");
                  return;
                }
                
                setRoutineMethod("template");
              }}
            >
              Add From Template
            </button>
          </div>
        )}

        {routineMethod === "template" && (
          <CreateRoutineFromTemplate
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            routineName={routineName}
            setRoutineName={setRoutineName}
          />
        )}

        {routineMethod === "manually" && (
          <CreateRoutine
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            routineName={routineName}
            setRoutineName={setRoutineName}
          />
        )}
      </div>
    </div>
  );
};

export default CreateRoutineHomePage;
