import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, Check, AlertCircle 
} from 'lucide-react';
import { 
  getAllBodyParts, 
  addBodyPart, 
  updateBodyPart, 
  deleteBodyPart 
} from '../serviceFunctions/templateFunctions';
import Navbar from '../components/Navbar';
import { useDispatch } from 'react-redux';
import { setAllBodyPart } from '../redux/slices/dataSlice';
import toast from 'react-hot-toast';
import { confirmAction } from '../utils/ConfirmAction';

const BodyPartManager = () => {
  const [bodyParts, setBodyParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const dispatch=useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Load body parts on mount
  useEffect(() => {
    fetchBodyParts();
  }, []);

  const fetchBodyParts = async () => {
    setLoading(true);
    const data = await getAllBodyParts();
    setBodyParts(data);
    setLoading(false);
  };

  const handleOpenModal = (bodyPart = null) => {
    if (bodyPart) {
      setEditingId(bodyPart.id);
      setFormData({
        name: bodyPart.name,
        description: bodyPart.description || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Body part name is required');
      return;
    }

    if (editingId) {
      const result = await updateBodyPart(editingId, formData);
      if (result) {
        setBodyParts(bodyParts.map(bp => bp.id === editingId ? result : bp));
        handleCloseModal();
      }
    } else {
      const result = await addBodyPart(formData);
      if (result) {
        setBodyParts([...bodyParts, result]);
        handleCloseModal();
      }
    }
    const bodyPart = await getAllBodyParts();
    const names = bodyPart.map(obj => obj.name);
    dispatch(setAllBodyPart(names));
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmAction("Are you sure about deleting this body part?");
    if (confirmed) {
      const success = await deleteBodyPart(id);
      if (success) {
        setBodyParts(bodyParts.filter(bp => bp.id !== id));
      }
      const bodyPart = await getAllBodyParts();
      const names = bodyPart.map(obj => obj.name);
      dispatch(setAllBodyPart(names));
    }
  };

  const filteredBodyParts = bodyParts.filter(bp =>
    bp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bp.description && bp.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Body Parts Manager
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Body Part
            </motion.button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <input
            type="text"
            placeholder="Search body parts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Body Parts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          ) : filteredBodyParts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-12"
            >
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchTerm ? 'No body parts found' : 'No body parts yet. Add one to get started!'}
              </p>
            </motion.div>
          ) : (
            filteredBodyParts.map((bodyPart, index) => (
              <motion.div
                key={bodyPart.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {bodyPart.name}
                  </h3>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleOpenModal(bodyPart)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-600 rounded"
                    >
                      <Edit2 size={18} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(bodyPart.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-600 rounded"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>
                {bodyPart.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {bodyPart.description}
                  </p>
                )}
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Body Part' : 'Add Body Part'}
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Body Part Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Chest, Back, Shoulders"
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
                  rows="3"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
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
                  {editingId ? 'Update' : 'Add'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BodyPartManager;
