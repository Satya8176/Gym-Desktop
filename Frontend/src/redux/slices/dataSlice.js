import { createSlice } from "@reduxjs/toolkit";

const initialState={
  totalMembers:[],
  totalExercies:[],
  totalActiveRoutineCount:0,
  totalEquipment:[],
  totalBodyPart:[]
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
    setAllActiveRoutinesCount(state,value){
      state.totalActiveRoutineCount=value.payload
    },
    setAllEquipment(state,value){
      state.totalEquipment=value.payload
    },
    setAllBodyPart(state,value){
      state.totalBodyPart=value.payload
    }
  }
})

export const {setAllActiveRoutinesCount,setAllExercises,setUsers,setAllBodyPart,setAllEquipment}=dataSlice.actions
export default dataSlice.reducer