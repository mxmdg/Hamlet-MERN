import React, { useState, useEffect } from "react";
import axios from "axios";
import { databaseURL } from "../Config/config";

export const deleteClickHandler = async (id, collection) => {
  try {
    await axios.delete(`${databaseURL + collection}/${id}`);
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

export const getElement = async (id, collection) => {
  try {
    const item = await axios.get(`${databaseURL + collection}/${id}`);
    return item;
  } catch (e) {
    console.log(e);
    return id;
  }
};

export const getElements = async (collection) => {
  try {
    const items = await axios.get(`${databaseURL + collection}`);
    console.log(items.data);
    return items;
  } catch (e) {
    console.log(e);
  }
};

const DBServices = (props) => {};
