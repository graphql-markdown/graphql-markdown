/**
 * Array functions
 */

import { Maybe } from "graphql/jsutils/Maybe";

export const toArray = <T extends {}>(param: Record<string, T>): Maybe<T>[] => {
  return Object.keys(param).map((key) => param[key]);
}

export const convertArrayToObject = <T extends {} & {name: string}>(typeArray: T[]): Record<string, T> => {
    const output: Record<string, T> = {};
    for(const entry of typeArray) {
        if ("name" in entry) {
            Object.assign(output, output, {[entry.name]: entry})
        }
    }
    return output;
}
