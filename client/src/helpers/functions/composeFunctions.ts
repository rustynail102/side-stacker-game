import { ComponentEnhancer } from "@client/helpers/functions/@types/composeFunctions"

/**
 * Composes multiple functions into a single function. Used to compose HOC (Higher Order Components)
 * @param {...ComponentEnhancer<TComponentType, TComponentType>[]} functions - The functions to compose.
 * @returns {ComponentEnhancer<TComponentType, TComponentType>} - The composed function.
 */
export const composeFunctions = <TComponentType>(
  ...functions: ComponentEnhancer<TComponentType, TComponentType>[]
): ComponentEnhancer<TComponentType, TComponentType> =>
  functions.reduce(
    (compose, currentFunction) =>
      (...args) =>
        compose(currentFunction(...args)),
    (arg) => arg,
  )
