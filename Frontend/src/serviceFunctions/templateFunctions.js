import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:4000/api";

// ==================== TEMPLATE FUNCTIONS ====================

export const createTemplate = async (templateData) => {
  try {
    
    const res = await axios.post(
      `${API_BASE_URL}/template/create-template`,
      templateData
    );
    if (res.status === 201) {
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error creating template";
    console.log("Error creating template:", err);
    toast.error(msg);
    return null;
  }
};

export const getAllTemplates = async () => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/template/get-all-templates`
    );
    if (res.status === 200) {
      return res.data.data || [];
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error fetching templates";
    console.log("Error fetching templates:", err);
    toast.error(msg);
    return [];
  }
};

export const getTemplateById = async (templateId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/template/get-template/${templateId}`
    );
    if (res.status === 200) {
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error fetching template";
    console.log("Error fetching template:", err);
    toast.error(msg);
    return null;
  }
};

export const getTemplatesByDifficulty = async (difficulty) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/template/get-templates-by-difficulty/${difficulty}`
    );
    if (res.status === 200) {
      return res.data.data || [];
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error fetching templates";
    console.log("Error fetching templates by difficulty:", err);
    toast.error(msg);
    return [];
  }
};

export const updateTemplate = async (templateId, templateData) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/template/update-template/${templateId}`,
      templateData
    );
    if (res.status === 200) {
      toast.success("Template updated successfully!");
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error updating template";
    console.log("Error updating template:", err);
    toast.error(msg);
    return null;
  }
};

export const deleteTemplate = async (templateId) => {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/template/delete-template/${templateId}`
    );
    if (res.status === 200) {
      toast.success("Template deleted successfully!");
      return true;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error deleting template";
    console.log("Error deleting template:", err);
    toast.error(msg);
    return false;
  }
};

// ==================== BODY PART FUNCTIONS ====================

export const addBodyPart = async (bodyPartData) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/bodypart/add-body-part`,
      bodyPartData
    );
    if (res.status === 201) {
      toast.success("Body part added successfully!");
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error adding body part";
    console.log("Error adding body part:", err);
    toast.error(msg);
    return null;
  }
};

export const getAllBodyParts = async () => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/bodypart/get-all-body-parts`
    );
    if (res.status === 200) {
      return res.data.data || [];
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error fetching body parts";
    console.log("Error fetching body parts:", err);
    toast.error(msg);
    return [];
  }
};

export const getBodyPartById = async (bodyPartId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/bodypart/get-body-part/${bodyPartId}`
    );
    if (res.status === 200) {
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error fetching body part";
    console.log("Error fetching body part:", err);
    toast.error(msg);
    return null;
  }
};

export const updateBodyPart = async (bodyPartId, bodyPartData) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/bodypart/update-body-part/${bodyPartId}`,
      bodyPartData
    );
    if (res.status === 200) {
      toast.success("Body part updated successfully!");
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error updating body part";
    console.log("Error updating body part:", err);
    toast.error(msg);
    return null;
  }
};

export const deleteBodyPart = async (bodyPartId) => {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/bodypart/delete-body-part/${bodyPartId}`
    );
    if (res.status === 200) {
      toast.success("Body part deleted successfully!");
      return true;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error deleting body part";
    console.log("Error deleting body part:", err);
    toast.error(msg);
    return false;
  }
};

// ==================== EQUIPMENT FUNCTIONS ====================

export const addEquipment = async (equipmentData) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/equipment/add-equipment`,
      equipmentData
    );
    if (res.status === 201) {
      toast.success("Equipment added successfully!");
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error adding equipment";
    console.log("Error adding equipment:", err);
    toast.error(msg);
    return null;
  }
};

export const getAllEquipment = async () => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/equipment/get-all-equipment`
    );
    if (res.status === 200) {
      return res.data.data || [];
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error fetching equipment";
    console.log("Error fetching equipment:", err);
    toast.error(msg);
    return [];
  }
};

export const getEquipmentById = async (equipmentId) => {
  try {
    const res = await axios.get(
      `${API_BASE_URL}/equipment/get-equipment/${equipmentId}`
    );
    if (res.status === 200) {
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error fetching equipment";
    console.log("Error fetching equipment:", err);
    toast.error(msg);
    return null;
  }
};

export const updateEquipment = async (equipmentId, equipmentData) => {
  try {
    const res = await axios.put(
      `${API_BASE_URL}/equipment/update-equipment/${equipmentId}`,
      equipmentData
    );
    if (res.status === 200) {
      toast.success("Equipment updated successfully!");
      return res.data.data;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error updating equipment";
    console.log("Error updating equipment:", err);
    toast.error(msg);
    return null;
  }
};

export const deleteEquipment = async (equipmentId) => {
  try {
    const res = await axios.delete(
      `${API_BASE_URL}/equipment/delete-equipment/${equipmentId}`
    );
    if (res.status === 200) {
      toast.success("Equipment deleted successfully!");
      return true;
    }
  } catch (err) {
    const msg = err?.response?.data?.message || "Error deleting equipment";
    console.log("Error deleting equipment:", err);
    toast.error(msg);
    return false;
  }
};
