import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { getMembers, uploadCsv } from '../serviceFunctions/userRelatedFunc.js';
import { useDispatch } from 'react-redux';
import { setUsers } from '../redux/slices/dataSlice.js';
import { useNavigate } from 'react-router-dom';

const UploadUsers = () => {
  const [selectedFile, setSelectedFile]   = useState(null);
  const [uploading, setUploading]         = useState(false);
  const [previewData, setPreviewData]     = useState(null);
  const [uploadError, setUploadError]     = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setUploadError(null);

    if (!file) return;

    const isValid = file.name.endsWith('.csv') || file.name.endsWith('.xlsx');

    if (isValid) {
      setSelectedFile(file);
      setPreviewData(true);
    } else {
      setSelectedFile(null);
      setPreviewData(null);
      setUploadError('Invalid file type. Please upload a .csv or .xlsx file.');
    }

    // Reset input so same file can be re-selected after removal
    e.target.value = '';
  };

  // ── Remove selected file ────────────────────────────────────────────────────
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setUploadError(null);
  };

  // ── Upload ──────────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setUploadError(null);

    try {
      await uploadCsv(selectedFile);
      setSelectedFile(null);
      setPreviewData(null);
      const members = await getMembers();
      dispatch(setUsers(members));
      navigate('/members');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(
        error?.response?.data?.message || 'Upload failed. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upload Users
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Import gym members from CSV or Excel file
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">

          {/* ── File Upload Area ── */}
          <div className="mb-8">
            <div className="flex flex-row justify-between">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-4"
              >
                Select CSV or Excel File
              </label>
              <span
                className="text-2xl text-red-500 font-bold px-3 hover:cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                X
              </span>
            </div>

            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <div className="flex text-sm text-gray-600 dark:text-gray-300">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept=".csv,.xlsx"
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CSV or XLSX files only
                </p>
              </div>
            </div>

            {/* Selected file info */}
            {selectedFile && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 ml-auto" />
                  <span
                    className="text-2xl text-red-500 font-bold px-3 hover:cursor-pointer"
                    onClick={handleRemoveFile}
                  >
                    X
                  </span>
                </div>
              </div>
            )}

            {/* Error message */}
            {uploadError && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    {uploadError}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Format Guidelines ── */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              File Format Requirements
            </h3>
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">Mandatory columns:</p>
                  <ul className="space-y-1">
                    <li>• Name of the Applicant</li>
                    <li>• Father's Name / Mother's Name</li>
                    <li>• Enrolment No. / Employee ID</li>
                    <li>• Email ID</li>
                    <li>• Whatsapp / Mobile Number</li>
                    <li>• Experience Level</li>
                    <li>• Height, Weight, Chest, Biceps, Thigh, Waist, Calf (Inch/Kgs)</li>
                    <li>• Do you have any Diseases or Medical Conditions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ── Upload Button ── */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-900 dark:hover:to-indigo-900"
            >
              {uploading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UploadUsers;