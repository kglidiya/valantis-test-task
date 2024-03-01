import React, { ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { BASE_URL, getData, getDataTest, handleRequest } from "../../utils/api";
import { Md5 } from "ts-md5";
import Input from "../../ui/input/Input";
import useDebounce from "../../hooks/useDebounce";
import axiosRetry from "axios-retry";

import {
  auth,
  getPriceRange,
  getProgress,
  removeDuplcates,
  removeDuplcatesById,
  sort,
} from "../../utils/helpers";
import styles from "./Shop.module.css";
import {  IProduct } from "../../utils/types";
import Card from "../../components/card/Card";
import LoaderSeach from "../../ui/loader-seach/LoaderSeach";
import Loader from "../../ui/loader/Loader";
import { actions, fields } from "../../utils/constants";
import ModalOverLay from "../../components/overlay/Overlay";
import Filters from "../../components/filters/Filters";
import useIsFirstRender from "../../hooks/useIsFirstRender";

export default function Shop() {
  const [itemsAllToShow, setItemsAllToShow] = useState<IProduct[]>([]);
  const [itemsFilteredToShow, setItemsFilteredToShow] = useState<IProduct[]>([]);
  const [itemsAllUniqueIds, setItemsAllUniqueIds] = useState({
    itemsId: [] as string[],
    itemsQty: 0,
  });
  const [itemsAllIds, setItemsAllIds] = useState({
    isLoading: false,
    data: [] as string[],
    error: "",
  });
  const [itemsFetchedAll, setItemsFetchedAll] = useState({
    isLoading: false,
    data: [] as IProduct[],
    error: "",
  });
  const [itemsFetchedFiltered, setItemsFetchedFiltered] = useState({
    isLoading: false,
    data: [] as IProduct[],
    error: "",
  });
  const [filteredIds, setFilteredIds] = useState({
    isLoading: false,
    data: [] as string[],
    error: "",
  });

  const [brands, setBrands] = useState({
    isLoading: false,
    data: [] as string[] | null[],
    error: "",
  });
  const [prices, setPrices] = useState({
    isLoading: false,
    data: [] as number[],
    error: "",
  });

  const [limitToFetch, setLimitToFetch] = useState(100);
  const [offsetToFetch, setOffsetToFetch] = useState(0);
  const [limitItemsAllToShow, setLimitItemsAllToShow] = useState(50);
  const [offsetItemsAllToShow, setOffsetItemsAllToShow] = useState(0);
  const [limitFilteredItemsToShow, setLimitFilteredItemsToShow] = useState(50);
  const [offsetFilteredItemsToShow, setOffsetFilteredItemsToShow] = useState(0);
  const [progress, setProgress] = useState(0);

  const [password] = useState(auth());

  //Получаем id всех товаров, все брэнды и цены
  useEffect(() => {
    // console.log("Получаем id всех товаров, все брэнды и цены");
    handleRequest(brands, setBrands, password, {
      action: actions.GET_FIELDS,
      params: { field: fields.BRAND },
    });
    handleRequest(prices, setPrices, password, {
      action: actions.GET_FIELDS,
      params: { field: fields.PRICE },
    });
    handleRequest(itemsAllIds, setItemsAllIds, password, {
      action: actions.GET_IDS,
    });
  }, []);

  //Удаляем дубликаты всех id
  useEffect(() => {
    if (itemsAllIds.data.length) {
      setItemsAllUniqueIds({
        itemsId: removeDuplcates(itemsAllIds.data),
        itemsQty: itemsAllIds.data.length,
      });
    }
  }, [itemsAllIds.data.length]);

  //Удаляем дубликаты цен для выпадающего списка в фильрах поиска
  //и сортирем цены по возрастанию
  useEffect(() => {
    setPrices((prices) => {
      return { ...prices, data: removeDuplcates(sort(prices.data)) };
    });
  }, [prices.data.length]);

  //Удаляем дубликаты брэндов для выпадающего списка в фильрах поиска
  useEffect(() => {
    setBrands((brands) => {
      return { ...brands, data: removeDuplcates(brands.data) };
    });
  }, [brands.data.length]);

  //Получаем 100 неотфильтрованных товаров по id
  useEffect(() => {
    if (itemsAllUniqueIds.itemsQty > 0) {
      handleRequest(itemsFetchedAll, setItemsFetchedAll, password, {
        action: actions.GET_ITEMS,
        params: {
          ids: itemsAllUniqueIds.itemsId.slice(offsetToFetch, limitToFetch),
        },
      });
    }
  }, [itemsAllUniqueIds.itemsQty, offsetToFetch, limitToFetch]);

  //Отбираем 50 товаров для показа, удаляем дубликаты
  useEffect(() => {
    if (itemsFetchedAll.data.length) {
      const uniqueItems = removeDuplcatesById(itemsFetchedAll.data);
      setItemsAllToShow(
        uniqueItems.slice(offsetItemsAllToShow, limitItemsAllToShow)
      );
    }
  }, [itemsFetchedAll.data.length, limitItemsAllToShow, offsetItemsAllToShow]);

  //Отбираем 50 отфильтрованных товаров для показа, удаляем дубликаты
  useEffect(() => {
    const uniqueItems = removeDuplcatesById(itemsFetchedFiltered.data);
    setItemsFilteredToShow(
      uniqueItems.slice(offsetFilteredItemsToShow, limitFilteredItemsToShow)
    );
    setOffsetItemsAllToShow(0);
    setLimitItemsAllToShow(50);
  }, [
    itemsFetchedFiltered.data.length,
    offsetFilteredItemsToShow,
    limitFilteredItemsToShow,
  ]);

  // console.log(`offsetFilteredToShow   ${offsetFilteredToShow}`);
  // console.log(`limitFilteredItemsToShow   ${limitFilteredItemsToShow}`);
  // console.log(`limitToShow  ${limitToShow}`);
  // console.log(`offsetToShow  ${offsetToShow}`);
  // console.log(`offsetToFetch ${offsetToFetch}`);
  // console.log(`limitToFetch ${limitToFetch}`);
  // console.log(`searchResult  ${searchResult.data}`);
  // console.log(`filteredIds   ${filteredIds.data.length}`);
  // console.log(`itemsFilteredToShow  ${itemsFilteredToShow.length}`);

  //Отоброжение просмотренных товаров в процентах
  useEffect(() => {
    if (filteredIds.data.length > 0) {
      setProgress(
        getProgress(
          removeDuplcates(filteredIds.data).length,
          limitFilteredItemsToShow
        )
      );
    } else
      setProgress(getProgress(itemsAllIds.data.length, limitItemsAllToShow));
  }, [
    itemsAllIds.data.length,
    limitItemsAllToShow,
    limitFilteredItemsToShow,
    filteredIds.data,
  ]);

  const [isSearching, setIsSearching] = useState(false);
  // const isFirstRender = useIsFirstRender();
  console.log(`isSearching  ${isSearching}`);
  // const firstRender = useIsFirstRender();
  if (itemsAllIds.isLoading) {
    return <Loader />;
  }
  // if(filteredIds.isLoading || searchResult.isLoading){
  //   return <LoaderSeach />;
  // }

  return (
    <>
      <Filters
        filteredIds={filteredIds}
        setFilteredIds={setFilteredIds}
        setItemsFetchedFiltered={setItemsFetchedFiltered}
        itemsFetchedFiltered={itemsFetchedFiltered}
        password={password}
        setIsSearching={setIsSearching}
        prices={prices.data}
        brands={brands.data}
        setLimitItemsAllToShow={setLimitItemsAllToShow}
        // limitItemsAllToShow={limitItemsAllToShow}
        offsetItemsAllToShow={offsetItemsAllToShow}
        setOffsetItemsAllToShow={setOffsetItemsAllToShow}
        setLimitToFetch={setLimitToFetch}
        setOffsetToFetch={setOffsetToFetch}
        // limitFilteredItemsToShow={limitFilteredItemsToShow}
        setLimitFilteredItemsToShow={setLimitFilteredItemsToShow}
        offsetFilteredItemsToShow={offsetFilteredItemsToShow}
        setOffsetFilteredItemsToShow={setOffsetFilteredItemsToShow}
        progress={progress}
        limitToFetch={limitToFetch}
        offsetToFetch={offsetToFetch}
      />

      <div className={styles.products}>
        {/* {itemsAllToShow.length > 0 &&
          itemsFilteredToShow.length === 0 &&
          itemsAllToShow.map((item: IProduct, i: number) => {
            return <Card {...item} key={i} />;
          })}
        {itemsFilteredToShow.length > 0 &&
          itemsFilteredToShow.map((item: IProduct, i: number) => {
            return <Card {...item} key={i} />;
          })} */}
        {!isSearching &&
          itemsAllToShow.map((item: IProduct, i: number) => {
            return <Card {...item} key={i} />;
          })}
        {isSearching &&
          itemsFilteredToShow.length > 0 &&
          itemsFilteredToShow.map((item: IProduct, i: number) => {
            return <Card {...item} key={i} />;
          })}
      </div>

      {(filteredIds.isLoading ||
        (itemsFetchedFiltered.isLoading &&
          offsetFilteredItemsToShow === 0)) && (
        <ModalOverLay children={<LoaderSeach />} />
      )}
    </>
  );
}
