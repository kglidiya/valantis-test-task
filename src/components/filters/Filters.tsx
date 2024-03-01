import React, {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import {
  IFieldVales,
  IProduct,
  IStatusIds,
  IStatusProduct,
} from "../../utils/types";
import { handleRequest } from "../../utils/api";
import { actions, fields } from "../../utils/constants";
import useDebounce from "../../hooks/useDebounce";
import InputSelect from "../../ui/inputSelect/InputSelect";
import Tabs from "../tabs/Tabs";
import styles from "./Filters.module.css";
import Input from "../../ui/input/Input";
import { getProgress } from "../../utils/helpers";
import ButtonNext from "../../ui/icons/arrow/Arrow";
import Arrow from "../../ui/icons/arrow/Arrow";
import ProgressBarr from "../../ui/progress-bar/ProgressBar";
const rotate =
  "translate(8.500000, 8.500000) scale(-1, 1) translate(-8.500000, -8.500000)";

interface IFiltersProps {
  prices: number[];
  brands: (string | null)[];
  password: string;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  progress: number;
  filteredIds: IStatusIds;
  setFilteredIds: Dispatch<SetStateAction<IStatusIds>>;
  itemsFetchedFiltered: IStatusProduct;
  setItemsFetchedFiltered: Dispatch<SetStateAction<IStatusProduct>>;
  // limitItemsAllToShow;
  setLimitItemsAllToShow: Dispatch<SetStateAction<number>>;
  offsetItemsAllToShow: number;
  setOffsetItemsAllToShow: Dispatch<SetStateAction<number>>;
  offsetToFetch: number;
  setOffsetToFetch: Dispatch<SetStateAction<number>>;
  limitToFetch: number;
  setLimitToFetch: Dispatch<SetStateAction<number>>;
  // limitFilteredItemsToShow;
  setLimitFilteredItemsToShow: Dispatch<SetStateAction<number>>;
  offsetFilteredItemsToShow: number;
  setOffsetFilteredItemsToShow: Dispatch<SetStateAction<number>>;
}

export default function Filters({
  prices,
  brands,
  password,
  setIsSearching,
  progress,
  filteredIds,
  setFilteredIds,
  itemsFetchedFiltered,
  setItemsFetchedFiltered,
  // limitItemsAllToShow,
  setLimitItemsAllToShow,
  offsetItemsAllToShow,
  setOffsetItemsAllToShow,
  offsetToFetch,
  setOffsetToFetch,
  limitToFetch,
  setLimitToFetch,
  // limitFilteredItemsToShow,
  setLimitFilteredItemsToShow,
  offsetFilteredItemsToShow,
  setOffsetFilteredItemsToShow,
}: IFiltersProps) {
  const [activeTab, setActiveTab] = useState(fields.PRODUCT);
  const [isBtnPrevDisabled, setIsBtnPrevDisabled] = useState(true);
  const [isBtnNextDisabled, setIsBtnNextDisabled] = useState(false);

  const { register, watch, setValue, reset } = useForm<IFieldVales>({
    values: {
      brand: null,
      product: "",
      price: "",
    },
  });
  console.log(`progress  ${progress}`);
  // console.log(`searchResult ${searchResult.data.length}`);
  const getNextItems = () => {
    if (progress < 100) {
      setLimitToFetch((prev) => prev + 100);
      setOffsetToFetch((prev) => prev + 100);

      if (itemsFetchedFiltered.data.length > 0) {
        setLimitFilteredItemsToShow((prev) => prev + 50);
        setOffsetFilteredItemsToShow((prev) => prev + 50);
      } else {
        setOffsetItemsAllToShow((prev) => prev + 50);
        setLimitItemsAllToShow((prev) => prev + 50);
      }
    }
  };
  // console.log(filteredIds.data)
  const getPrevItems = () => {
    // offsetToShow !== 0 || offsetFilteredToShow
    if (
      itemsFetchedFiltered.data.length > 0 &&
      offsetFilteredItemsToShow !== 0
    ) {
      setLimitFilteredItemsToShow((prev) => prev - 50);
      setOffsetFilteredItemsToShow((prev) => prev - 50);
    }
    if (itemsFetchedFiltered.data.length === 0 && offsetItemsAllToShow !== 0) {
      setOffsetItemsAllToShow((prev) => prev - 50);
      setLimitItemsAllToShow((prev) => prev - 50);
    }
  };
  useEffect(() => {
    if (offsetItemsAllToShow === 0 && offsetFilteredItemsToShow === 0) {
      setIsBtnPrevDisabled(true);
    } else setIsBtnPrevDisabled(false);
    if (progress === 100) {
      setIsBtnNextDisabled(true);
    } else setIsBtnNextDisabled(false);
  }, [offsetFilteredItemsToShow, progress, offsetItemsAllToShow]);

  const filterItems = (values: IFieldVales) => {
    setIsSearching(true);
    const params = {} as IFieldVales;

    if (values.brand) {
      params.brand = values.brand;
      // setIsSearching(true);
    }
    if (values.product) {
      params.product = values.product;
      // setIsSearching(true);
    }
    if (values.price) {
      params.price = values.price;
      // setIsSearching(true);
    }

    handleRequest(filteredIds, setFilteredIds, password, {
      action: actions.FILTER,
      params,
    });
  };

  useEffect(() => {
    const subscription = watch((values) => {
      setItemsFetchedFiltered((prev) => {
        return { ...prev, data: [] };
      });
      setFilteredIds((prev) => {
        return { ...prev, data: [] };
      });

      setOffsetToFetch(0);
      setLimitToFetch(100);
      setLimitItemsAllToShow(50);
      setOffsetItemsAllToShow(0);
      setIsSearching(false);
      if (values.price || values.brand) {
        filterItems(values);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    // setIsSearching(true);
    if (filteredIds.data.length > 0) {
      handleRequest(itemsFetchedFiltered, setItemsFetchedFiltered, password, {
        action: actions.GET_ITEMS,
        params: {
          ids: filteredIds.data.slice(offsetToFetch, limitToFetch),
        },
      });
      // setOffsetToShow(0);
      // setLimitToShow(50);
      // console.log(`serch`)
    }
  }, [filteredIds.data.length, limitToFetch]);

  const debouncedSearch = useDebounce(filterItems, 1500);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    // setIsSearching(false);
    debouncedSearch(watch());
    setOffsetToFetch(0);
    setLimitToFetch(100);
  };

  const handleTab1 = () => {
    setActiveTab(fields.PRODUCT);
    reset();
    setIsSearching(false);
  };

  const handleTab2 = () => {
    setActiveTab(fields.BRAND);
    reset();
    setIsSearching(false);
  };

  const handleTab3 = () => {
    setActiveTab(fields.PRICE);
    reset();
    setIsSearching(false);
  };

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.innerWrapper}>
        <Tabs
          activeTab={activeTab}
          handleTab1={handleTab1}
          handleTab2={handleTab2}
          handleTab3={handleTab3}
        />
        {activeTab === fields.PRODUCT && (
          <Input
         
            name="product"
            placeholder="Введите название"
            register={register}
     
            onChange={handleInputChange}
            setValue={setValue}
          />
        )}
        {activeTab === fields.BRAND && (
          <InputSelect
            placeholder="Брэнд"
            register={register}
            setValue={setValue}
            options={brands}
  
            name="brand"
       
          />
        )}
        {activeTab === fields.PRICE && (
          <InputSelect
            placeholder="Цена"
            register={register}
            setValue={setValue}
            options={prices}
           
            name="price"
      
          />
        )}

        <div className={styles.navigation}>
          <span onClick={getPrevItems}>
            <Arrow rotate={rotate} disabled={isBtnPrevDisabled} />
          </span>
          <ProgressBarr progress={progress} />
          <span onClick={getNextItems}>
            <Arrow disabled={isBtnNextDisabled} />
          </span>
        </div>
      </div>
    </div>
  );
}
