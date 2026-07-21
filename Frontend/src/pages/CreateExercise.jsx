import React, { useState, useEffect } from 'react';
import { Plus, Dumbbell, Target, Settings, Edit2, X } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { createExercise, getAllExercise, updateExercise } from '../serviceFunctions/userRelatedFunc.js';
import { useDispatch, useSelector } from 'react-redux';
import { setAllExercises } from '../redux/slices/dataSlice.js';
import { useNavigate } from 'react-router-dom';

const CreateExercise = () => {
  const dispatch=useDispatch();
  const {totalExercies}=useSelector((state)=>state.dataSlice);
  const {totalEquipment}=useSelector((state)=>state.dataSlice);
  const {totalBodyPart}=useSelector((state)=>state.dataSlice);
  const [exercises, setExercises] = useState(totalExercies);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: '',
    equipment: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!totalExercies || totalExercies.length === 0) {
      const run=async()=>{
        const data=await getAllExercise();
        dispatch(setAllExercises(data))
        setExercises(data)
      }
      run();
    }
  }, [totalExercies, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingId) {
        // Update mode
        await updateExercise({ id: editingId, ...formData });
      } else {
        // Create mode
        await createExercise(formData);
      }
      
      const exercises = await getAllExercise();
      dispatch(setAllExercises(exercises));
      setExercises(exercises);

      // Reset form
      setFormData({
        name: '',
        muscleGroup: '',
        equipment: '',
        description: ''
      });
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save exercise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (exercise) => {
    setEditingId(exercise.id);
    setFormData({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      description: exercise.description
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      name: '',
      muscleGroup: '',
      equipment: '',
      description: ''
    });
  };

  const getEquipmentIcon = (equipment) => {
    switch (equipment) {
      case 'Barbell':
      case 'Dumbbell':
        return <Dumbbell className="h-4 w-4" />;
      case 'Machine':
        return <Settings className="h-4 w-4" />;
      case 'Bodyweight':
        return <Target className="h-4 w-4" />;
      default:
        return <Dumbbell className="h-4 w-4" />;
    }
  };

  const getMuscleGroupColor = (group) => {
    const colors = {
      'Chest': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
      'Back': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      'Shoulders': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      'Arms': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      'Legs': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      'Glutes': 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
      'Core': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
      'Cardio': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
      'Full Body': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[group] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-[80%] mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Exercise</h1>
          <p className="mt-2 text-muted-foreground">Add new exercises to your library</p>
        </div>

        <div className="flex flex-row  gap-5 mx-auto justify-between">
          {/* Create Exercise Form */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-8 w-[65%]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-card-foreground">
                  {editingId ? 'Update Exercise' : 'Add New Exercise'}
                </h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-muted-foreground hover:text-foreground transition-colors font-bold"
                >
                  <X className="h-7 w-7 dark:text-white text-black " />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Exercise Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Incline Dumbbell Press"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className='flex justify-between'>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Muscle Group
                    </label>
                    <p className='text-sm font-bold text-blue-600 hover:cursor-pointer'
                    onClick={()=>{navigate("/body-parts")}}
                    >+Add Muscle </p>
                  </div>
                  <select
                    name="muscleGroup"
                    value={formData.muscleGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select Muscle Group</option>
                    {totalBodyPart?.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className='flex justify-between'>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Equiptment
                    </label>
                    <p className='text-sm font-bold text-blue-600 hover:cursor-pointer'
                    onClick={()=>{
                      navigate("/equipment");
                    }}
                    >+Add Equiptment </p>
                  </div>
                  <select
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Equipment</option>
                    {totalEquipment?.map(equipment => (
                      <option key={equipment} value={equipment}>{equipment}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-card-foreground mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe the exercise technique, benefits, or any important notes..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium py-3 px-4 rounded-lg hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Exercise' : 'Add Exercise')}
              </button>
            </form>
          </div>

          {/* Exercises List */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-4 w-[35%]">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-card-foreground">Exercise Library</h2>
              <span className="bg-muted text-muted-foreground text-sm px-2 py-1 rounded-full">
                {exercises.length} exercises
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-card-foreground">{exercise.name}</h3>
                    <div className="flex gap-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMuscleGroupColor(exercise.muscleGroup)}`}>
                        {exercise.muscleGroup}
                      </span>
                      <button
                        onClick={() => handleEditClick(exercise)}
                        className="p-1 hover:bg-primary/20 rounded transition-colors"
                        title="Edit exercise"
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      {getEquipmentIcon(exercise.equipment)}
                      <span>{exercise.equipment}</span>
                    </div>
                  </div>
                  
                  
                  <p className="text-sm text-muted-foreground">{exercise.description}</p>
                </div>
              ))}
              
              {exercises.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No exercises yet. Create your first exercise!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExercise;