import { Md5 } from "ts-md5";
import { IProduct } from "./types";

const getTimeStapm = () => {
  var today = new Date();
  return (
    String(today.getFullYear()) +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0")
  );
};

export const getProgress = (itemsAll: number, itemsShown: number) => {
  let pagesAll = 0;
  if (itemsAll % 50 === 0) {
    pagesAll = itemsAll / 50;
  } else {
    pagesAll = Math.ceil(itemsAll / 50);
  }
  // let pagesAll = Math.ceil(itemsAll/50)
  const pagesShown = itemsShown / 50;
  // console.log(pagesAll, pagesShown);
  // console.log(pagesAll, itemsShown)
  // console.log((pagesShown*100)/pagesAll)
  return (pagesShown * 100) / pagesAll;
};

export const auth = () => {
  return Md5.hashStr(`${process.env.REACT_APP_PASSWORD}_` + getTimeStapm());
};

export const removeDuplcates = (
  arr: string[] | number[] | null[]
)=> {
  const set = new Set<string|number|null>(arr) 
  return Array.from(set) as any
  
};

export const removeDuplcatesById = (arr: IProduct[]) => {
  const uniqueIds = new Set();

  const unique = arr.filter((item) => {
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
