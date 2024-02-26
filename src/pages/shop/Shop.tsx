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
  removeDuplcates,
  removeDuplcatesById,
  sort,
} from "../../utils/helpers";
import styles from "./Shop.module.css";
import { IFieldVales, IProduct } from "../../utils/types";
import Card from "../../components/card/Card";
import InputSelect from "../../ui/inputSelect/InputSelect";
import axios, { AxiosError } from "axios";
import Tabs from "../../components/tabs/Tabs";
import LoaderSeach from "../../ui/loader-seach/LoaderSeach";
import Loader from "../../ui/loader/Loader";
import { actions, fields } from "../../utils/constants";
import ModalOverLay from "../../components/overlay/Overlay";



export default function Shop() {
  const [activeTab, setActiveTab] = useState(fields.PRODUCT);
  const [itemsAll, setItems] = useState<any>({ itemsId: [], itemsQty: 0 });
  const [itemsToShow, setItemsToShow] = useState<any>([]);
  const [itemsAllIds, setItemsAllIds] = useState<any>({
    isLoading: false,
    data: [],
    error: "",
  });
  const [itemsFetched, setItemsFetched] = useState<any>({
    isLoading: false,
    data: [],
    error: "",
  });
  const [filteredIds, setFilteredIds] = useState<any>({
    isLoading: false,
    data: [],
    error: false,
  });

  const [searchResult, setSearchResult] = useState<any>({
    isLoading: false,
    data: [],
    error: false,
  });
  const [brands, setBrands] = useState<any>({
    isLoading: false,
    data: [],
    error: false,
  });
  const [prices, setPrices] = useState<any>({
    isLoading: false,
    data: [],
    error: false,
  });

  const [limitToFetch, setLimitToFetch] = useState(100);
  const [offsetToFetch, setOffsetToFetch] = useState(0);
  const [limitToShow, setLimitToShow] = useState(50);
  const [offsetToShow, setOffsetToShow] = useState(0);
  const [limitToSeach, setLimitToSeach] = useState(100);
  const [offsetToSeach, setOffsetToSeach] = useState(0);
  const [password] = useState(auth());

  //Поля инпутов
  const { register, watch, setValue, getValues } = useForm<IFieldVales>({
    values: {
      brand: null,
      product: undefined,
      price: undefined,
    },
  });

  //Получаем id всех товаров, все брэнды и цены
  useEffect(() => {
    console.log('Получаем id всех товаров, все брэнды и цены')
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

  useMemo(() => {
    if (itemsAllIds.data) {
      setItems({
        itemsId: removeDuplcates(itemsAllIds.data),
        itemsQty: itemsAllIds.data.length,
      });
    }
  }, [itemsAllIds.data]);

  //Получаем 100 неотфильтрованных товаров по id
  useEffect(() => {
    if (itemsAll.itemsQty > 0) {
      handleRequest(itemsFetched, setItemsFetched, password, {
        action: actions.GET_ITEMS,
        params: { ids: itemsAll.itemsId.slice(offsetToFetch, limitToFetch) },
      });
    }
  }, [itemsAll.itemsQty, offsetToFetch, limitToFetch]);

  //Удаляем дубликаты цен для выпадающего списка в фильрах поиска 
  //и сортирем цены по возрастанию
  useEffect(() => {
    setPrices((prices: any) => {
      return { ...prices, data: removeDuplcates(sort(prices.data)) };
    });
  }, [prices.data.length]);
  
 //Удаляем дубликаты брэндов для выпадающего списка в фильрах поиска
  useEffect(() => {
    setBrands((brands: any) => {
      return { ...brands, data: removeDuplcates(brands.data) };
    });
  }, [brands.data.length]);
  //   console.log(sort(price.data));

  //Отбираем 50 товаров для показа, удаляем дубликаты
  useEffect(() => {
    console.log("Отбираем 50 товаров для показа");
    const uniqueItems = removeDuplcatesById(itemsFetched.data);
    setItemsToShow(uniqueItems.slice(offsetToShow, limitToShow));
    // setItemsToShow(itemsFetched.data.slice(offsetToShow, limitToShow));
  }, [itemsFetched.data, limitToShow, offsetToShow]);
  //   console.log(itemsFetched.data);
  //   console.log(limit, offset);

  const getNextItems = () => {
    setLimitToFetch((prev) => prev + 100);
    setOffsetToFetch((prev) => prev + 100);
    setOffsetToShow((prev) => prev + 50);
    setLimitToShow((prev) => prev + 50);
  };

  const getPrevItems = () => {
    setOffsetToShow((prev) => prev - 50);
    setLimitToShow((prev) => prev - 50);
  };

  //   console.log(itemsToShow);
  //   console.log(itemsFetched.data);
  //   console.log(itemsToShow.data);
  //   useMemo(() => {
  //     if (itemsToShow.data?.result) {
  //       setItems({
  //         itemsId: status.data.result,
  //         itemsQty: status.data.result.length,
  //       });
  //     }
  //   }, [itemsToShow.data?.result]);
  // console.log(itemsAll.itemsId.slice(0, 50));



  const [fetching, setFetching] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  // const isFirstRender = useIsFirstRender();
  const [total, setTotal] = useState(1);

  const filterItems = (values: IFieldVales) => {
    const params = {} as IFieldVales;

    if (values.brand) {
      params.brand = values.brand;
    }
    if (values.product) {
      params.product = values.product;
    }
    if (values.price) {
      params.price = Number(values.price);
    }

    handleRequest(filteredIds, setFilteredIds, password, {
      action:   actions.FILTER,
      params,
    });
  };
  //   console.log(filteredIds.data);
  //   console.log(filteredIdsByPrice.data);

  // useEffect(() => {
  //   if (filteredIdsByPrice.data.length === 0) {
  //     setSearchResultByPrice((prev: any) => {
  //         return { ...prev, data: [...prev.data, ...t.result] };
  //       });
  //   } else
  //   setSearchResultByPrice((prev: any) => {
  //     return { ...prev, data: [...prev.data, ...t.result] };
  //   });
  //     setSearchResultByPrice([
  //       ...searchResultByPrice,
  //       ...filteredIdsByPrice.data,
  //     ]);

  // }, [filteredIdsByPrice.data.length]);

  //   console.log(filteredIdsByPrice.data);

  //Фильтруем данные при выболе значения выпалающего списка брэндом или цен
  useEffect(() => {
    const subscription = watch((values) => {
      setSearchResult((prev: any) => {
        return { ...prev, data: [] };
      });
      if(values.price || values.brand) {
        filterItems(values);
      }
 
    });

    return () => subscription.unsubscribe();
  }, [watch]);


  useEffect(() => {
    if (filteredIds.data.length > 0) {
      handleRequest(searchResult, setSearchResult, password, {
        action: actions.GET_ITEMS,
        params: {
          ids: filteredIds.data.slice(offsetToSeach, limitToSeach),
        },
      });
    }
  }, [filteredIds.data.length]);



  const debouncedSearch = useDebounce(filterItems, 1500);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e: any) => {
    setIsSearching(true);
    debouncedSearch(watch());
    setOffsetToFetch(0);
  };
 

  const handleTab1 = () => {
    setActiveTab(fields.PRODUCT);
    setValue("brand", "");
    setValue("price", "");
  };
  const handleTab2 = () => {
    setActiveTab(fields.BRAND);
    setValue("price", "");
    setValue("product", "");
  };
  const handleTab3 = () => {
    setActiveTab(fields.PRICE);
    setValue("brand", "");
    setValue("product", "");
  };

  if (itemsAllIds.isLoading || itemsFetched.isLoading) {
    return <Loader />;
  }
  // if(filteredIds.isLoading || searchResult.isLoading){
  //   return <LoaderSeach />;
  // }

  return (
    <>
      <div className={styles.filters}>
        {/* <ul className={styles.tabs}>
          <li
            onClick={handleTab1}
            className={
              activeTab === "product"
                ? `${styles.tab} ${styles.tab_active}`
                : styles.tab
            }
          >
            Поиск по названию товара
          </li>
          <li
            onClick={handleTab2}
            className={
              activeTab === "brand"
                ? `${styles.tab} ${styles.tab_active}`
                : styles.tab
            }
          >
            Поиск по брэнду
          </li>
          <li
            onClick={handleTab3}
            className={
              activeTab === "price"
                ? `${styles.tab} ${styles.tab_active}`
                : styles.tab
            }
          >
            Поиск по цене
          </li>
        </ul> */}
        <Tabs
          activeTab={activeTab}
          handleTab1={handleTab1}
          handleTab2={handleTab2}
          handleTab3={handleTab3}
        />
        {activeTab === fields.PRODUCT && (
          <Input
            type="text"
            name="product"
            placeholder="Введите название"
            register={register}
            clearButton={true}
            onChange={handleInputChange}
            setValue={setValue}
          />
        )}
        {activeTab === fields.BRAND && (
          <InputSelect
            placeholder="Брэнд"
            register={register}
            setValue={setValue}
            options={brands.data}
            type="text"
            name="brand"
            clearButton={true}
          />
        )}
        {activeTab === fields.PRICE && (
          <InputSelect
            placeholder="Цена"
            register={register}
            setValue={setValue}
            options={prices.data}
            type="text"
            name="price"
            clearButton={true}
          />
        )}
           {offsetToShow !== 0 && (
        <button type="button" onClick={getPrevItems}>
          Prev
        </button>
      )}
      <button type="button" onClick={getNextItems}>
        Next
      </button>
      </div>

   

      <div className={styles.products}>
        {itemsToShow.length > 0 &&
          searchResult.data.length === 0 &&
          itemsToShow.map((item: IProduct, i: number) => {
            return <Card {...item} key={i} />;
          })}
        {searchResult.data.length > 0 &&
          searchResult.data.map((item: IProduct, i: number) => {
            return <Card {...item} key={i} />;
          })}
      </div>
      {(filteredIds.isLoading || searchResult.isLoading) && <ModalOverLay children={<LoaderSeach/>}/>}
    </>
  );
}
