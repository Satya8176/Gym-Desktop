import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard as Edit, Calendar, Phone, Mail, User } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import MemberEditModal from '../components/MemberEditModal.jsx';
import { membersApi } from '../mocks/mockApi.js';
import { useDispatch, useSelector } from 'react-redux';
import { getMembers, updateUserDetail } from '../serviceFunctions/userRelatedFunc.js';
import { setUsers } from '../redux/slices/dataSlice.js';
import { useNavigate } from 'react-router-dom';

const Members = () => {
  const dispatch = useDispatch();
  const {totalMembers}=useSelector((state)=>state.dataSlice)
  const [members, setMembers] = useState(totalMembers);
  const [filteredMembers, setFilteredMembers] = useState(totalMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  useEffect(() => {
  if (!totalMembers || totalMembers.length === 0) {
    const run=async()=>{
      const data=await getMembers();
      dispatch(setUsers(data))
      setMembers(data)
    }
    run();
  }
}, [totalMembers, dispatch]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.whatsAppNumber.includes(searchTerm)
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers(members);
    }
  }, [searchTerm, members]);

  // console.log("Members is",members)

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const handleSaveMember = async (memberId, updatedData) => {
    try {
      // console.log("Member Id is",memberId,"Updated Data",updatedData);
      const res= await updateUserDetail(memberId , updatedData)
      setIsEditModalOpen(false);
      setSelectedMember(null);
      if(res){
        const data=await getMembers();
        dispatch(setUsers(data))
        setMembers(data)
      }
      
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Monthly':
        return 'bg-blue-100 text-blue-800';
      case 'Quarterly':
        return 'bg-green-100 text-green-800';
      case 'Yearly':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gym Members</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and view all gym members</p>
        </motion.div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    S.No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Guardian Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Purpose
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Joined
                  </th> */}
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.map((member,index) => (
                  <motion.tr 
                    key={member.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {index+1}
                          </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-2 mr-3">
                          <User className="h-5 w-5 text-primary-600 dark:text-slate-300" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ID: {member.enrollmentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2" />
                          {member.whatsAppNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {member.guardianName}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(member.plan)}`}>
                        {member.plan}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {member.purpose}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(member.date)}
                      </div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <motion.button
                        onClick={() => handleEditMember(member)}
                        className="flex items-center space-x-1 px-3 py-1 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className='flex flex-row gap-2'>
                          {member.testDone?(<div>
                            <button className="text-destructive hover:font-bold hover:text-green-600 py-1 px-2 bg-green-300 rounded-sm hover:scale-90"
                            type='button'
                            onClick={()=>{
                              navigate(`/test/view-test/${member.enrollmentId}`)
                            }}
                            >View Test</button>

                          </div>):(<div>
                            <button className="text-destructive hover:font-bold hover:text-red-600 py-1 px-2 bg-red-300 rounded-sm hover:scale-90"
                            type='button'
                            onClick={()=>{
                              navigate(`/test/take-test/${member.enrollmentId}`)
                            }}
                            >Take Test</button>
                          </div>)}
                          <div className='flex flex-row items-center gap-x-1'>
                            <Edit className="h-4 w-4 text-blue-400 font-bold" />
                            <span className='text-blue-400 font-bold'>Edit</span>
                          </div>
                        </div>
                          
                        
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <User className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No members found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding some members.'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <MemberEditModal
        member={selectedMember}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMember(null);
        }}
        onSave={handleSaveMember}
      />
    </div>
  );
};

export default Members;