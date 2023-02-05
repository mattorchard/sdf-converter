import { StateUpdater, useEffect, useState } from "preact/hooks";
import { isValidColor } from "../helpers/ColorHelpers";
import { SdfOptions } from "../helpers/SdfWglHelpers";
import { objectAsQueryParam, replaceUrlParams } from "../helpers/UrlHelpers";
import { KeysOfValues } from "../helpers/UtilTypes";

const defaultOptions: SdfOptions = {
  upResFactor: 2,
  spread: 10,
  alphaThreshold: 128,
  svgWidth: 512,
  svgHeight: 512,
  inColor: "#000000FF",
  outColor: "#00000000",
};

const parseColor = (color: string | undefined) =>
  color && isValidColor(color) ? color : null;

const getInitialState = (): SdfOptions => {
  const searchParamMap = new Map(new URLSearchParams(window.location.search));
  if (searchParamMap.size === 0) return defaultOptions;

  const getNum = (key: KeysOfValues<SdfOptions, number>) =>
    Number(searchParamMap.get(key)) || defaultOptions[key];

  const getColor = (key: KeysOfValues<SdfOptions, string>) =>
    parseColor(searchParamMap.get(key)) || defaultOptions[key];

  return {
    upResFactor: getNum("upResFactor"),
    spread: getNum("spread"),
    alphaThreshold: getNum("alphaThreshold"),
    svgWidth: getNum("svgWidth"),
    svgHeight: getNum("svgHeight"),
    inColor: getColor("inColor"),
    outColor: getColor("outColor"),
  };
};

export const useOptions = (): [SdfOptions, StateUpdater<SdfOptions>] => {
  const [options, setOptions] = useState<SdfOptions>(getInitialState);

  useEffect(() => {
    const queryParams = objectAsQueryParam(options);
    replaceUrlParams(queryParams);
  }, [options]);

  return [options, setOptions];
};
