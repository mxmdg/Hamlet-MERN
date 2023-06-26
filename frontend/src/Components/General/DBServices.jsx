import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "../Config/config";

export const deleteClickHandler = async (id,collection) => {
  
    try {
      await axios.delete(`${serverURL}/hamlet/${collection}/${id}`);
    } catch (e) {
      alert(e);
    }
};

export const deleteMultiple = (id, collection) => {
  if (id.length > 1) {
    if (window.confirm("Estas recontra seguro de borrar varios elementos?")) {
      id.map((item)=>{
      try {
        deleteClickHandler(item,collection)
      } catch (error) {
        console.log(error)
      }
    })
    }
    
  } else if (id.length === 1) {
    if (window.confirm("Estas recontra seguro de borrar este elemento?")) {
      try {
        deleteClickHandler(id,collection)
      } catch (error) {
        console.log(error)
      }
    }
    
  }
}

const DBServices = (props)=> {
    
    
      
} 