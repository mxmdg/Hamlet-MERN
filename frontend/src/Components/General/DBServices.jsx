import React, { useState, useEffect } from "react";
import axios from "axios";
import { serverURL } from "../Config/config";

export const deleteClickHandler = async (id, collection) => {
  try {
    await axios.delete(`${serverURL}/hamlet/${collection}/${id}`);
  } catch (e) {
    alert(e);
  }
};

export const deleteMultiple = (id, collection) => {
  if (id.length > 1) {
    if (
      window.confirm(
        "ATENCION! Esta accion borrará los elementos seleccionados"
      )
    ) {
      id.map((item) => {
        try {
          deleteClickHandler(item, collection);
        } catch (error) {
          console.log(error);
        }
      });
    }
  } else if (id.length === 1) {
    if (
      window.confirm("ATENCION! Esta accion borrará el elemento seleccionado")
    ) {
      try {
        deleteClickHandler(id, collection);
      } catch (error) {
        console.log(error);
      }
    }
  }
};

export const addElement = (data) => {};

const DBServices = (props) => {};
