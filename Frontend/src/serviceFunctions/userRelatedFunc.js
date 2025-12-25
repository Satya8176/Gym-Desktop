import axios from "axios";
import toast from "react-hot-toast";


export const uploadCsv=async(selectedFile)=>{
  try{
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await axios.post(
          "http://localhost:4000/api/user/create",
          formData,
          { headers: {
            "Content-Type": "multipart/form-data",
            },
          }
        );
    // const result = res.data;
    // console.log("Server response:", result);
    // Optionally check for error in result, depending on your API
    if (res.status !== 200) throw new Error(result.message || "Upload failed");
    toast.success("Upload Sucessfull")
    }
  catch(err){
    console.log(err);
    toast.error("Error in Uploading");
  }
}

export const getMembers=async()=>{
  try{
    const res=await axios.get(
      "http://localhost:4000/api/user/getUsers"
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Fetching members fails");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error in getting Members",err)
  }
}

export const getSingleUser=async(enrollmentId)=>{
  try{
    const body=new FormData();
    body.append("enrollmentId",enrollmentId)
    const res=await axios.post(
      "http://localhost:4000/api/user/get-single-user",
      body
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Fetching members fails");
    const data = res.data;
    return data.data || data.users
  }
  catch(err){
    console.log("Error in getting Member",err)
  }
}

export const createExercise=async(body)=>{
  try{
    const res=await axios.post(
      "http://localhost:4000/api/workout/create-exercise",
      body
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Create exercise failed");
    toast.success("Exercises Created");
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Exercise Creation Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const getAllExercise=async()=>{
  try{
    const res=await axios.get(
      "http://localhost:4000/api/workout/get-all-exercise"
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Get all exercise failed");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error is getting Exercises",err);
  }
}

export const getAllRoutine=async(body)=>{
  try{
    const res=await axios.post(
      "http://localhost:4000/api/getWorkout/get-all-routines",
      body
    )

    if (res.status !== 200) throw new Error(res.data?.message || "Get all routines failed");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error in getting routine",err)
  }
}



//From here test realted data is there
export const modifyTestResult=(dataArray)=>{
  return dataArray.map(item=>({
    exerciseId:item.exerciseId,
    maxReps: item.maxReps,
    maxWeight: item.maxWeight
  }))
}

export const createTestFun=async(body)=>{
  try{
    const res=await axios.post(
      "http://localhost:4000/api/test/create-test",
      body
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Test upload failed");
    toast.success("Test Submitted Successfully");
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Test Creation Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const reTest=async(body)=>{
  try{
    const newTestEntries=modifyTestResult(body.testEntries);
    const newObj={
      userId:body.userId,
      testEntries:newTestEntries
    }
    const res=await axios.post(
      "http://localhost:4000/api/test/retest",
      newObj
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Retest upload failed");
    toast.success("Test Submitted Successfully");
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Retest Creation Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const fetchUserTests=async(enrollmentId)=>{
  try{
    const fd=new FormData();
    fd.append("userId",enrollmentId)
    const res=await axios.post(
      "http://localhost:4000/api/test/get-test",
      fd
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Test fetching Error");
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Test fetching Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const flattenExerciseList=(dataArray)=>{
  return dataArray.map(item => ({
    userId: item.userId,
    exerciseId: item.exerciseId,
    name: item.exercise?.name || null,
    maxReps: item.maxReps,
    maxWeight: item.maxWeight
  }));
}

export const UserAvailableExercises=(dataArray)=>{
  return dataArray.map(item=>({
    id:item.exerciseId,
    name:item.exercise?.name,
    maxReps: item.maxReps,
    maxWeight: item.maxWeight
  }))
}


export const updateUserDetail=async(userId,data)=>{
  try{
    const fd=new FormData();
    fd.append("userId",userId);
    fd.append("data",JSON.stringify(data));
    const res= await axios.post(
      "http://localhost:4000/api/user/update-User-Detail",
      fd
    )
    if (res.status !== 200) throw new Error(res.data?.message || "User detail updation error");
    toast.success("Update Sucessfull")
    return true;
  }
  catch(err){
    const msg=err?.response?.data?.message ||"User detail updation error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}



//From here we need to create rotuine function
export const createRoutineFun=async(enrollmentId,Name,WeekRoutine)=>{
  try{
    const fd=new FormData();
    fd.append("enrollmentId",enrollmentId);
    fd.append("Name",Name);
    fd.append("WeekRoutine",JSON.stringify(WeekRoutine));
    const res= await axios.post(
      "http://localhost:4000/api/workout/create-routine",
      fd
    )
    if (res.status !== 200) throw new Error(res.data?.message || "Routine creation error");
    toast.success("Routine Created")
    return true;
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Routine creation error"
    console.log("This is the error",msg);
    toast.error(msg);
  }
}

export const getLatestRoutine=async(enrollmentId)=>{
  try{
    const fd=new FormData();
    fd.append("enrollmentId",enrollmentId);
    const res=await axios.post(
      "http://localhost:4000/api/getWorkout/get-latest-routine",
      fd
    )

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Get latest routine failed");
    }
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error in getting routine",err)
    const msg=err.response.data.message;
    toast.error(msg)
  }
}

export const getAllMemHaveRoutine=async()=>{
  try{
   
    const res=await axios.get(
      "http://localhost:4000/api/getWorkout/all-mem-routine"
    )

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed in fetching data");
    }
    const data = res.data;
    return data.data || data.users || []
  }
  catch(err){
    console.log("Error in getting routine",err)
    const msg=err.response.data.message;
    toast.error(msg)
  }
}



function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export const generateRoutinePdf=(routineObj)=>{
    try {
      console.log("Routine at the print pdf",routineObj);
      const { Membername, Name, WeekRoutine,availableExercise } = routineObj || {};
      const routineName = Name || 'Routine';
      const memberName = Membername;
      const style = `
        body { font-family: Arial, Helvetica, sans-serif; padding: 20px; color: #111; }
        h1 { margin-bottom: 6px }
        h2 { margin: 18px 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 4px }
        .meta { margin-bottom: 12px; }
        .exercise { margin: 8px 0; }
        .exercise-name { font-weight: 700; margin-bottom: 4px }
        .set-row { margin-left: 12px; font-size: 14px }
      `;

      function renderSetsHtml(sets) {
        if (!Array.isArray(sets) || sets.length === 0) return `<div class="set-row">No sets</div>`;
        return sets.map((s, i) => {
          const setNo = s.setNo ?? s.set ?? (i + 1);
          const weight = s.weight ?? s.weightKG ?? '-';
          const reps = s.reps ?? s.repetitions ?? '-';
          return `<div class="set-row">Set ${setNo}: ${weight} kg x ${reps} reps</div>`;
        }).join('');
      }

      let html = `<!doctype html><html><head><meta charset="utf-8"><title>${routineName}</title><style>${style}</style></head><body>`;
      html += `<h1>${routineName}</h1>`;
      html += `<div class="meta"><strong>Member:</strong> ${memberName} <br/><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>`;

      // WeekRoutine is an array of { day, workouts }
      if (Array.isArray(WeekRoutine) && WeekRoutine.length > 0) {
        // If more than 3 days, render in two columns: days 1-3 (left) and days 4+ (right)
        if (WeekRoutine.length > 3) {
          // Add minimal CSS for columns
          const columnStyles = `
            .columns { display:flex; gap:18px; }
            .col { flex:1; min-width:0; }
            .day { break-inside: avoid; page-break-inside: avoid; -webkit-column-break-inside: avoid; }
          `;
          // inject column styles at top of document by replacing style string (append)
          html = html.replace('</style></head>', `${columnStyles}</style></head>`);

          const left = WeekRoutine.slice(0, 3);
          const right = WeekRoutine.slice(3);

          html += `<div class="columns">`;

          // left column (days 1..3)
          html += `<div class="col">`;
          for (const dayObj of left) {
            const day = dayObj.day || dayObj.name || 'Day';
            const workouts = dayObj.workouts || [];
            html += `<section class="day"><h2>${escapeHtml(day)}</h2>`;
            if (workouts.length === 0) {
              html += `<div class="exercise">No exercises</div>`;
              html += `</section>`;
              continue;
            }
            for (const w of workouts) {
              const exId = w.Exercise || w.id || w.exerciseId || (w.exercise && w.exercise.id) || null;
              const exName = w.name || w?.exercise?.name || (availableExercise || []).find(a => String(a.id) === String(exId))?.name || exId || 'Unknown Exercise';
              html += `<div class="exercise"><div class="exercise-name">${escapeHtml(exName)}</div>`;
              html += renderSetsHtml(w.sets || []);
              html += `</div>`;
            }
            html += `</section>`;
          }
          html += `</div>`;

          // right column (days 4..)
          html += `<div class="col">`;
          for (const dayObj of right) {
            const day = dayObj.day || dayObj.name || 'Day';
            const workouts = dayObj.workouts || [];
            html += `<section class="day"><h2>${escapeHtml(day)}</h2>`;
            if (workouts.length === 0) {
              html += `<div class="exercise">No exercises</div>`;
              html += `</section>`;
              continue;
            }
            for (const w of workouts) {
              const exId = w.Exercise || w.id || w.exerciseId || (w.exercise && w.exercise.id) || null;
              const exName = w.name || w?.exercise?.name || (availableExercise || []).find(a => String(a.id) === String(exId))?.name || exId || 'Unknown Exercise';
              html += `<div class="exercise"><div class="exercise-name">${escapeHtml(exName)}</div>`;
              html += renderSetsHtml(w.sets || []);
              html += `</div>`;
            }
            html += `</section>`;
          }
          html += `</div>`; // end right

          html += `</div>`; // end columns

        } else {
          // default — render sequentially (1 column)
          for (const dayObj of WeekRoutine) {
            const day = dayObj.day || dayObj.name || 'Day';
            const workouts = dayObj.workouts || [];
            html += `<h2>${escapeHtml(day)}</h2>`;
            if (workouts.length === 0) {
              html += `<div class="exercise">No exercises</div>`;
              continue;
            }
            for (const w of workouts) {
              const exId = w.Exercise || w.id || w.exerciseId || (w.exercise && w.exercise.id) || null;
              const exName = w.name || w?.exercise?.name || (availableExercise || []).find(a => String(a.id) === String(exId))?.name || exId || 'Unknown Exercise';
              html += `<div class="exercise"><div class="exercise-name">${escapeHtml(exName)}</div>`;
              html += renderSetsHtml(w.sets || []);
              html += `</div>`;
            }
          }
        }
      } else {
        html += `<div>No week routine available</div>`;
      }

      html += `<div style="font-size:12px; color:#666; margin-top:18px;">Generated by Gym app</div>`;
      html += `</body></html>`;

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        alert('Popup blocked. Allow popups for this site to download the routine PDF.');
        return;
      }
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 600);
    } catch (err) {
      console.error('Failed to generate routine PDF', err);
    }
  }




