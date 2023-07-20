import { ValidationError } from "@app/errors/definitions/validationError"
import { OrderDirection } from "@app/features/@types/models"
import { isConvertableToNumber } from "@app/helpers/numbers/isConvertableToNumber"
import { Request } from "express"
import isEmpty from "lodash/isEmpty"
import omitBy from "lodash/omitBy"
import isNil from "lodash/isNil"
import { ZodRawShape, z } from "zod"

export class RequestValidationService {
  static validateBody = <T extends ZodRawShape>(
    body: Request["body"],
    entityObject: z.ZodObject<T>,
  ) => {
    const incorrectFields: string[] = []
    const entityObjectKeys: string[] = entityObject.keyof()._def.values

    Object.keys(body).forEach((bodyKey) => {
      if (!entityObjectKeys.includes(bodyKey as never)) {
        incorrectFields.push(bodyKey)
      }
    })

    if (!isEmpty(incorrectFields)) {
      throw new ValidationError(incorrectFields)
    }

    const payloadWithoutEmptyFields = omitBy(body, isNil)

    entityObject.parse(payloadWithoutEmptyFields)

    return payloadWithoutEmptyFields as z.infer<typeof entityObject>
  }

  static validateQuery = <T>(
    query: Request["query"],
    allowedQueryParams: string[],
    objectKeys: T[],
    allowedFilters: string[],
  ) => {
    const disallowedQueryParams = Object.keys(query).filter(
      (queryParam) => !allowedQueryParams.includes(queryParam),
    )

    const errors: string[] = []

    if (!isEmpty(disallowedQueryParams)) {
      errors.push(
        `Incorrect query params: ${JSON.stringify(disallowedQueryParams)}`,
      )
    }

    if (query.filters && allowedQueryParams.includes("filters")) {
      for (const [key, value] of Object.entries(query.filters)) {
        if (!allowedFilters.includes(key)) {
          errors.push(`incorrect filter query param: ${key} - ${value}`)
        }
      }
    }

    if (
      query.limit &&
      allowedQueryParams.includes("limit") &&
      !isConvertableToNumber(query.limit)
    ) {
      errors.push("limit query param should be a number")
    }

    if (
      query.offset &&
      allowedQueryParams.includes("offset") &&
      !isConvertableToNumber(query.offset)
    ) {
      errors.push("offset query param should be a number")
    }

    const orderDirectionObjectValues = Object.values(OrderDirection)

    if (
      query.orderDirection &&
      allowedQueryParams.includes("orderDirection") &&
      !orderDirectionObjectValues.includes(
        query.orderDirection as OrderDirection,
      )
    ) {
      errors.push(
        `order query param should be one of the following values: ${JSON.stringify(
          orderDirectionObjectValues,
        )}`,
      )
    }

    if (
      query.orderBy &&
      allowedQueryParams.includes("orderBy") &&
      !objectKeys.includes(query.orderBy as T)
    ) {
      errors.push(
        `orderBy query param should be one of the following values: ${JSON.stringify(
          objectKeys,
        )}`,
      )
    }

    if (!isEmpty(errors)) {
      throw new ValidationError(errors)
    }

    const { filters, limit, offset, orderBy, orderDirection } = query

    return {
      ...(filters && {
        filters: filters as Record<keyof typeof allowedFilters, string>,
      }),
      ...(limit && { limit: Number(limit) }),
      ...(offset && { offset: Number(offset) }),
      ...(orderBy && { orderBy: orderBy as T }),
      ...(orderDirection && {
        orderDirection: orderDirection as OrderDirection,
      }),
    }
  }

  static validateParams = <T extends ZodRawShape>(
    params: Request["params"],
    entityObject: z.ZodObject<T>,
  ) => {
    const incorrectParams: string[] = []
    const entityObjectKeys: string[] = entityObject.keyof()._def.values

    Object.keys(params).forEach((bodyKey) => {
      if (!entityObjectKeys.includes(bodyKey as never)) {
        incorrectParams.push(bodyKey)
      }
    })

    if (!isEmpty(incorrectParams)) {
      throw new ValidationError(incorrectParams)
    }

    const payloadWithoutEmptyFields = omitBy(params, isNil)

    entityObject.parse(payloadWithoutEmptyFields)

    return payloadWithoutEmptyFields as z.infer<typeof entityObject>
  }
}
