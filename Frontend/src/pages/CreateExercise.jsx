import React, { useState, useEffect } from 'react';
import { Plus, Dumbbell, Target, Settings } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { exercisesApi } from '../mocks/mockApi.js';
import { createExercise, getAllExercise } from '../serviceFunctions/userRelatedFunc.js';
import { useDispatch, useSelector } from 'react-redux';
import { setAllExercises } from '../redux/slices/dataSlice.js';

const CreateExercise = () => {
  const dispatch=useDispatch();
  const {totalExercies}=useSelector((state)=>state.dataSlice)
  const [exercises, setExercises] = useState(totalExercies);

  const [formData, setFormData] = useState({
    name: '',
    muscleGroup: '',
    equipment: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const muscleGroups = [
    'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Glutes', 'Core', 'Cardio', 'Full Body'
  ];

  const equipmentTypes = [
    'Barbell', 'Dumbbell', 'Machine', 'Cable', 'Bodyweight', 'Kettlebell', 'Resistance Band', 'Other'
  ];

  // console.log("All Exercises",exercises);
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

  const loadExercises = async () => {
    try {
      const data = await exercisesApi.getAll();
      setExercises(data);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  };

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
      const res=await createExercise(formData);
      const exercises=await getAllExercise();
      dispatch(setAllExercises(exercises));
      setExercises(exercises);

      setFormData({
        name: '',
        muscleGroup: '',
        equipment: '',
        description: ''
      });
    } catch (error) {
      console.error('Failed to create exercise:', error);
    } finally {
      setLoading(false);
    }
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
      
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create Exercise</h1>
          <p className="mt-2 text-muted-foreground">Add new exercises to your library</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Exercise Form */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-card-foreground">Add New Exercise</h2>
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
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Muscle Group
                  </label>
                  <select
                    name="muscleGroup"
                    value={formData.muscleGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select Muscle Group</option>
                    {muscleGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    Equipment
                  </label>
                  <select
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    className="w-full px-3 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select Equipment</option>
                    {equipmentTypes.map(equipment => (
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
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium py-3 px-4 rounded-lg hover:from-primary/90 hover:to-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Exercise'}
              </button>
            </form>
          </div>

          {/* Exercises List */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-8">
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
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMuscleGroupColor(exercise.muscleGroup)}`}>
                      {exercise.muscleGroup}
                    </span>
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