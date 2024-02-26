import { Md5 } from "ts-md5";
import { IProduct } from "./types";

const getTimeStapm = () => {
  var today = new Date();
  return (
    String(today.getFullYear()) +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate())
  );
};

export const auth = () => {
  return Md5.hashStr(`${process.env.REACT_APP_PASSWORD}_` + getTimeStapm());
};

export const removeDuplcates = (arr: any) => {
  return Array.from(new Set(arr));
};

export const removeDuplcatesById = (arr: any) => {
  const uniqueIds = new Set();

  const unique = arr.filter((item: IProduct) => {
    const isDuplicate = uniqueIds.has(item.id);
    uniqueIds.add(item.id);
    if (!isDuplicate) {
      return true;
    }
    return false;
  });
  // console.log(unique)
  return unique;
};

export const sort = (arr: number[]) => {
  return arr.sort((a, b) => a - b);
};

export const getPriceRange = (
  arr: number[],
  min = 0,
  max = arr[arr.length - 1]
) => {
  return arr.filter((x) => x >= min && x <= max);
};

export const getRandomItem = (arr: string[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
