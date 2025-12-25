import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../redux/slices/dataSlice.js";
import {
  getMembers,
  updateUserDetail,
} from "../serviceFunctions/userRelatedFunc.js";
import ViewRoutine from "../components/ViewRoutine";

function LatestRoutine() {
  const dispatch = useDispatch();
  const { totalMembers } = useSelector((state) => state.dataSlice);
  const [members, setMembers] = useState(totalMembers);
  const [memberSearch, setMemberSearch] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [loading, setLoading] = useState(false);
  const memberInputRef = useRef(null);

 

  useEffect(() => {
    if (!totalMembers || totalMembers.length === 0) {
      const run = async () => {
        const data = await getMembers();
        dispatch(setUsers(data));
        setMembers(data);
      };
      run();
    }
  }, [totalMembers, dispatch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        memberInputRef.current &&
        !memberInputRef.current.contains(e.target)
      ) {
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

  useEffect(() => {
    if (selectedMember) {
      const m = (members || []).find((x) => x.enrollmentId === selectedMember);
      if (m) setMemberSearch(m.name);

    }
  }, [selectedMember, members]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div>
        {/* This is header part  */}
        <div>
          <motion.div
            className="my-2 pl-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex mx-20 gap-x-10 items-center w-[70%]">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-200">
                Latest Routine
              </h1>
              <div className="w-[50%] dark:text-slate-100">
                <div className="relative" ref={memberInputRef}>
                  <input
                    type="text"
                    value={memberSearch}
                    onChange={(e) => {
                      const v = e.target.value;
                      setMemberSearch(v);
                      setShowMemberDropdown(true);
                      if (v === "") {
                        // clear selected when user empties the input
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
                          No members
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          ></motion.div>
        </div>

        {/* Now body part to show the routine start  */}
        <div>
          {(selectedMember && memberSearch )&& (
            <ViewRoutine enrollmentId={selectedMember} memberName={memberSearch}/>
          )}
        </div>
      </div>
    </div>
  );
}

export default LatestRoutine;
