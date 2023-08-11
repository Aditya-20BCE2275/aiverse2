"use client";
import { useEffect } from "react";
import {Crisp} from "crisp-sdk-web";

export const CrispChat=()=>{
    useEffect(()=>{
        Crisp.configure("9986847c-b7af-4c12-a3f3-3d5ebb2cd31f");
    },[]);
    return null;
}