import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, Check, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import { 
  getAllTemplates, 
  getTemplateById,
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  getAllBodyParts,
  getAllEquipment
} from '../serviceFunctions/templateFunctions';
import Navbar from '../components/Navbar';
import { confirmAction } from '../utils/ConfirmAction';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { setAllExercises } from '../redux/slices/dataSlice';
import { getAllExercise } from '../serviceFunctions/userRelatedFunc';

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [expandedWorkoutIds, setExpandedWorkoutIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { totalExercies } = useSelector((state) => state.dataSlice);
  const dispatch = useDispatch();

  const toggleWorkout = (id) => {
    if (!id) return;
    setExpandedWorkoutIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'Intermediate',
    templateDays: []
  });


  // Load data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    const [templatesData, bodyPartsData, equipmentData] = await Promise.all([
      getAllTemplates(),
      getAllBodyParts(),
      getAllEquipment()
    ]);
    setTemplates(templatesData);
    setBodyParts(bodyPartsData);
    setEquipment(equipmentData);
    setLoading(false);
  };

  const handleOpenModal = async (template = null) => {
    if (template) {
      setEditingId(template.id);
      const fullTemplate = await getTemplateById(template.id);
      if (fullTemplate) {
        setFormData({
          name: fullTemplate.name,
          description: fullTemplate.description || '',
          difficulty: fullTemplate.difficulty,
          templateDays: fullTemplate.templateDays || []
        });
      }
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        difficulty: 'Intermediate',
        templateDays: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      difficulty: 'Intermediate',
      templateDays: []
    });
  };

  const handleAddDay = () => {
    const dayNumber = formData.templateDays.length + 1;
    setFormData({
      ...formData,
      templateDays: [
        ...formData.templateDays,
        {
          dayNumber,
          name: `Day ${dayNumber}`,
          templateWorkouts: []
        }
      ]
    });
  };

  const handleRemoveDay = (dayIndex) => {
    setFormData({
      ...formData,
      templateDays: formData.templateDays.filter((_, i) => i !== dayIndex)
    });
  };

  const handleAddWorkout = (dayIndex) => {
    const updatedDays = [...formData.templateDays];
    if (!updatedDays[dayIndex].templateWorkouts) {
      updatedDays[dayIndex].templateWorkouts = [];
    }
    updatedDays[dayIndex].templateWorkouts.push({
      exerciseName: '',
      sets: 3,
      reps: 10,
      bodyPartId: bodyParts[0]?.id || null,
      equipmentId: equipment[0]?.id || null,
      notes: ''
    });
    setFormData({ ...formData, templateDays: updatedDays });
  };

  const handleRemoveWorkout = (dayIndex, workoutIndex) => {
    const updatedDays = [...formData.templateDays];
    updatedDays[dayIndex].templateWorkouts.splice(workoutIndex, 1);
    setFormData({ ...formData, templateDays: updatedDays });
  };

  const handleWorkoutChange = (dayIndex, workoutIndex, field, value) => {
    const updatedDays = [...formData.templateDays];
    updatedDays[dayIndex].templateWorkouts[workoutIndex][field] = value;
    setFormData({ ...formData, templateDays: updatedDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Template name is required');
      return;
    }

    if (formData.templateDays.length === 0) {
      alert('Template must have at least one day');
      return;
    }

    // Validate all workouts have required fields
    for (let day of formData.templateDays) {
      for (let workout of day.templateWorkouts) {
        if (!workout.exerciseName.trim()) {
          alert('All workouts must have an exercise name');
          return;
        }
        if (!workout.bodyPartId || !workout.equipmentId) {
          alert('All workouts must have body part and equipment selected');
          return;
        }
      }
    }

    if (editingId) {
      const result = await updateTemplate(editingId, formData);
      if (result) {
        setTemplates(templates.map(t => t.id === editingId ? result : t));
        handleCloseModal();
      }
    } else {
      const result = await createTemplate(formData);
      if (result) {
        setTemplates([...templates, result]);
        handleCloseModal();
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction("Are you sure about deleting this template?");
    if(confirmed){
      const success = await deleteTemplate(id);
      if (success) {
        setTemplates(templates.filter(t => t.id !== id));
        toast.success('Template deleted successfully');
      }
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'all' || t.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  // Ensure no error happens before deleting this comments lines 

  // useEffect(() => {
  //       if (!totalExercies || totalExercies.length === 0) {
  //         const run=async()=>{
  //           const data=await getAllExercise();
  //           dispatch(setAllExercises(data))
  //           setExercises(data)
  //         }
  //         run();
  //       }
  //     }, [totalExercies, dispatch]);

  // useEffect(() => {


  //   if (!totalExercies || totalExercies.length === 0) {
  //     toast.error(
  //       "No exercises available. Please create exercises first.",
  //     );

  //     navigate("/create-exercise");
  //   }
  // }, [totalExercies, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Template Manager
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>{
                handleOpenModal()}}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Create Template
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex gap-4 flex-col sm:flex-row"
        >
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </motion.div>

        {/* Templates List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-white dark:bg-gray-700 rounded-lg"
            >
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchTerm || difficultyFilter !== 'all' ? 'No templates found' : 'No templates yet. Create one to get started!'}
              </p>
            </motion.div>
          ) : (
            filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </h3>
                      <div className="flex gap-3 mt-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          template.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                          template.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                        }`}>
                          {template.difficulty}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {template.templateDays?.length || 0} days
                        </span>
                      </div>
                      {template.description && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                          {template.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleOpenModal(template)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 rounded"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(template.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-600 rounded"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExpandedTemplate(expandedTemplate === template.id ? null : template.id)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 mt-2"
                  >
                    {expandedTemplate === template.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    {expandedTemplate === template.id ? 'Hide' : 'View'} Template Details
                  </motion.button>

                  {/* Template Details */}
                  <AnimatePresence>
                    {expandedTemplate === template.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                      >
                        {template.templateDays && template.templateDays.map((day, dayIdx) => (
                          <div key={dayIdx} className="mb-4 last:mb-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {day.name}
                            </h4>
                            <div className="space-y-2 ml-4">
                              {day.templateWorkouts && day.templateWorkouts.length > 0 ? (
                                day.templateWorkouts.map((workout, workoutIdx) => {
                                  const expanded = expandedWorkoutIds.includes(workout.id);
                                  return (
                                  <div
                                    key={workout.id || workoutIdx}
                                    className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-pointer border border-gray-200 dark:border-gray-600"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleWorkout(workout.id);
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') toggleWorkout(workout.id); }}
                                    aria-expanded={expanded}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex gap-x-2 items-center">
                                        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{workout.exercise?.name || workout.exerciseName || "Exercise"}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{workout.exercise?.muscleGroup || workout.exercise?.bodyPart || "-"}</div>
                                      </div>
                                      <div className="flex items-center gap-x-3">
                                        <div className="text-[15px] text-gray-400 dark:text-gray-300">Sets: {(workout.sets && Array.isArray(workout.sets) ? workout.sets : []).length}</div>
                                        <div className={`transform transition-transform text-gray-400 dark:text-gray-300 ${expanded ? 'rotate-90' : ''}`}>▸</div>
                                      </div>
                                    </div>

                                    {expanded && (
                                      <div className="mt-2">
                                        <table className="w-full text-sm">
                                          <thead>
                                            <tr className="text-left text-gray-500 dark:text-gray-400 text-xs">
                                              <th className="py-1 dark:text-slate-100 text-[14px]">Set No.</th>
                                              <th className="py-1 dark:text-slate-100 text-[14px]">Weight</th>
                                              <th className="py-1 dark:text-slate-100 text-[14px]">Reps</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(workout.sets && Array.isArray(workout.sets) ? workout.sets : []).map((s, sIdx) => (
                                              <tr key={s.id || sIdx} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                                                <td className="py-0 dark:text-slate-200 text-[13px]">{s.setNo || sIdx + 1}</td>
                                                <td className="py-0 dark:text-slate-200 text-[13px]">{s.weight} KG</td>
                                                <td className="py-0 dark:text-slate-200 text-[13px]">{s.repetitions || s.reps}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                )})
                              ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                                  No workouts scheduled
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 my-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Template' : 'Create Template'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5-Day Split"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description (optional)"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {/* Days Section */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Training Days *</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleAddDay}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    <Plus size={16} />
                    Add Day
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {formData.templateDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <input
                          type="text"
                          value={day.name}
                          onChange={(e) => {
                            const updatedDays = [...formData.templateDays];
                            updatedDays[dayIndex].name = e.target.value;
                            setFormData({ ...formData, templateDays: updatedDays });
                          }}
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Day name"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => handleRemoveDay(dayIndex)}
                          className="ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-gray-600 rounded"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>

                      {/* Workouts in Day */}
                      <div className="space-y-2 mb-3">
                        {day.templateWorkouts && day.templateWorkouts.map((workout, workoutIndex) => (
                          <div key={workoutIndex} className="bg-white dark:bg-gray-600 p-3 rounded space-y-2">
                            <div className="flex justify-between items-start">
                              <input
                                type="text"
                                value={workout.exerciseName}
                                onChange={(e) => handleWorkoutChange(dayIndex, workoutIndex, 'exerciseName', e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Exercise name"
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => handleRemoveWorkout(dayIndex, workoutIndex)}
                                className="ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded"
                              >
                                <X size={14} />
                              </motion.button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="number"
                                value={workout.sets}
                                onChange={(e) => handleWorkoutChange(dayIndex, workoutIndex, 'sets', parseInt(e.target.value))}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Sets"
                                min="1"
                              />
                              <input
                                type="number"
                                value={workout.reps}
                                onChange={(e) => handleWorkoutChange(dayIndex, workoutIndex, 'reps', parseInt(e.target.value))}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Reps"
                                min="1"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <select
                                value={workout.bodyPartId || ''}
                                onChange={(e) => handleWorkoutChange(dayIndex, workoutIndex, 'bodyPartId', e.target.value)}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Body Part</option>
                                {bodyParts.map(bp => (
                                  <option key={bp.id} value={bp.id}>{bp.name}</option>
                                ))}
                              </select>
                              <select
                                value={workout.equipmentId || ''}
                                onChange={(e) => handleWorkoutChange(dayIndex, workoutIndex, 'equipmentId', e.target.value)}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">Select Equipment</option>
                                {equipment.map(eq => (
                                  <option key={eq.id} value={eq.id}>{eq.name}</option>
                                ))}
                              </select>
                            </div>

                            <input
                              type="text"
                              value={workout.notes}
                              onChange={(e) => handleWorkoutChange(dayIndex, workoutIndex, 'notes', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Notes (optional)"
                            />
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleAddWorkout(dayIndex)}
                        className="w-full px-2 py-1 text-sm border border-dashed border-gray-300 dark:border-gray-500 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        + Add Workout
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Check size={18} />
                  {editingId ? 'Update' : 'Create'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TemplateManager;
