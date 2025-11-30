import { createContext } from "react";

const boardContext=createContext({
    activeToolItems:"",
    elements:[],
    history: [[]],
    index: 0,
    toolActionType:"",
    boardMouseDownHandler:()=>{},
    boardMouseUpHandler:()=>{},
    boardMouseMoveHandler:()=>{},
    changeToolHandler:()=>{}
})
export default boardContext;