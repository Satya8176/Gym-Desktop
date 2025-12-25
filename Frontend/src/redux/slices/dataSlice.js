import { createSlice } from "@reduxjs/toolkit";

const initialState={
  totalMembers:[],
  totalExercies:[],
  totalActiveRoutine:[]
}

export const dataSlice=createSlice({
  name:"dataSlice",
  initialState:initialState,
  reducers:{
    setUsers(state,value){
      state.totalMembers=value.payload
    },
    setAllExercises(state,value){
      state.totalExercies=value.payload
    },
    setAllActiveRoutines(state,value){
      state.totalActiveRoutine=value.payload
    },
  }
})

export const {setAllActiveRoutines,setAllExercises,setUsers}=dataSlice.actions
export default dataSlice.reducer