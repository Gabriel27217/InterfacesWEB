import { useContext } from "react";
import { CarsContext } from "../context/CarsContext";

export function useCars() {
  return useContext(CarsContext);
}
