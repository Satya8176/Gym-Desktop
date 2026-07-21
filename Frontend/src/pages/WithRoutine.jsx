import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion';
import SingleRouitne from '../components/SingleRouitne';
import ViewRoutine from '../components/ViewRoutine';
import { getAllMemHaveRoutine, getMembers } from '../serviceFunctions/userRelatedFunc';
import { User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAllActiveRoutinesCount } from '../redux/slices/dataSlice';


function WithRoutine() {
  const [activeRoutine, setActiveRoutine] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const memberInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const data = await getAllMemHaveRoutine();
      if(data){
        dispatch(setAllActiveRoutinesCount(data.length));
      }
      setActiveRoutine(data || []);
      setLoading(false);
    };
    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      const data = await getMembers();
      setMembers(data || []);
    };
    run();
  }, []);

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

  const routines = activeRoutine || [];
  const latestRoutines = [...routines]
    .sort((a, b) => {
      const aDate = new Date(a?.createdAt || a?.updatedAt || 0).getTime();
      const bDate = new Date(b?.createdAt || b?.updatedAt || 0).getTime();
      return bDate - aDate;
    })
    .slice(0, 10);

  const filteredMembers = (members || []).filter((m) => {
    const q = (memberSearch || "").toLowerCase().trim();
    if (!q) return true;
    return (
      (m?.name || "").toLowerCase().includes(q) ||
      String(m?.enrollmentId || "").toLowerCase().includes(q)
    );
  });

  const showMemberRoutine = Boolean(selectedMember);

  const displayRoutines = showMemberRoutine
    ? routines.filter((routine) =>
        String(routine?.member?.enrollmentId) === String(selectedMember)
      )
    : latestRoutines;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading data...</div>
        </div>
      </div>
    );
  }

  if (!routines.length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className='dark:text-slate-100 text-slate-700 text-2xl text-center my-10 font-bold'>No member has a routine yet</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Members having Workout</h1>

          <div className="mt-6 w-[50%] dark:text-slate-100" ref={memberInputRef}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => {
                    const v = e.target.value;
                    setMemberSearch(v);
                    setShowMemberDropdown(true);
                    if (v === "") {
                      setSelectedMember("");
                    }
                  }}
                  onFocus={() => setShowMemberDropdown(true)}
                  placeholder="Search or choose a member..."
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="Search members"
                  required
                />

                {showMemberDropdown && (
                  <ul className="absolute z-20 mt-1 max-h-44 w-full overflow-auto rounded-md bg-card border border-border shadow-lg dark:bg-slate-900">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((member) => (
                        <li
                          key={member.enrollmentId}
                          onMouseDown={(e) => {
                            e.preventDefault();
                              setSelectedMember(String(member.enrollmentId));
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
                      ))
                    ) : (
                      <li className="px-3 py-2 text-sm text-muted-foreground">No members</li>
                    )}
                  </ul>
                )}
              </div>
              {showMemberRoutine && (
                <button
                  className="text-sm text-primary hover:underline whitespace-nowrap"
                  onClick={() => {
                    setSelectedMember("");
                    setMemberSearch("");
                  }}
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {showMemberRoutine && (
            <div className="mt-6 max-w-6xl mx-auto">
              <div className="bg-white mx-auto dark:bg-gray-800 shadow-sm rounded-md p-4 w-[96%] translate-y-[50px]">
                <div>
                  <div className="text-xl font-semibold text-gray-900 dark:text-white">{memberSearch || "Member"}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Enrollment No. {selectedMember}</div>
                </div>
              </div>

              <div className="mt-4">
                <ViewRoutine enrollmentId={selectedMember} memberName={memberSearch} />
              </div>
            </div>
          )}
        </motion.div>

        {!showMemberRoutine && (
          <div className="space-y-4">
            {displayRoutines.map((data, index) => (
              <div key={index} className=''><SingleRouitne data={data} /></div>
            ))}
          </div>
        )}

      </div>
       
    </div>
  )
}

export default WithRoutine