import { ComponentEnhancer } from "@app/helpers/functions/@types/composeFunctions"

export const composeFunctions = <TComponentType>(
  ...functions: ComponentEnhancer<TComponentType, TComponentType>[]
): ComponentEnhancer<TComponentType, TComponentType> =>
  functions.reduce(
    (previousFunction, currentFunction) =>
      (...args) =>
        previousFunction(currentFunction(...args)),
    (arg) => arg,
  )
