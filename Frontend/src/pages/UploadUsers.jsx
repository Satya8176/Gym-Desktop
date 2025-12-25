import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, CrossIcon } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { membersApi } from '../mocks/mockApi.js';
import { getMembers, uploadCsv } from '../serviceFunctions/userRelatedFunc.js';
import { useDispatch } from 'react-redux';
import { setUsers } from '../redux/slices/dataSlice.js';
import { useNavigate } from 'react-router-dom';

const UploadUsers = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const dispatch=useDispatch();
  const navigate=useNavigate()

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      
      // Mock CSV preview data
      setPreviewData([
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '9876543210', age: 25, plan: 'Monthly' },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '9123456789', age: 28, plan: 'Quarterly' },
        { firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', phone: '9988776655', age: 32, plan: 'Yearly' }
      ]);
    } else {
      setSelectedFile(null);
      setPreviewData(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      // await membersApi.uploadCSV(selectedFile);
      await uploadCsv(selectedFile);
      setSelectedFile(null);
      setPreviewData(null);
      const members=await getMembers()
      dispatch(setUsers(members));

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Users</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Import gym members from CSV file</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          {/* File Upload Section */}
          <div className="mb-8">
            <div className='flex flex-row justify-between'>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-4">
                Select CSV File
              </label>
              <span className='text-2xl text-red-500 font-bold px-3 hover:cursor-pointer'
              onClick={()=>{
                navigate("/dashboard");
              }}
              >X</span>
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
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileSelect}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
              </div>
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 ml-auto" />
                  {/* <CrossIcon /> */}
                  <span className='text-2xl text-red-500 font-bold px-3 hover:cursor-pointer'
                  onClick={()=>{
                    setSelectedFile(null);
                  }}
                  >X</span>
                </div>
              </div>
            )}
          </div>

          {/* CSV Format Guidelines */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">CSV Format Requirements</h3>
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">Required columns:</p>
                  <ul className="space-y-1">
                    <li>• Name</li>
                    {/* <li>• lastName</li> */}
                    <li>• Email</li>
                    <li>• WhatsApp</li>
                    <li>• Others</li>
                    {/* <li>• plan (Monthly, Quarterly, Yearly)</li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {/* {previewData && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview (First 3 rows)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        First Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Plan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {previewData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {row.firstName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {row.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {row.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {row.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {row.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            row.plan === 'Monthly' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            row.plan === 'Quarterly' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}>
                            {row.plan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}

          {/* Upload Button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:from-blue-800 dark:to-indigo-800 dark:hover:from-blue-900 dark:hover:to-indigo-900"
            >
              {uploading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadUsers;