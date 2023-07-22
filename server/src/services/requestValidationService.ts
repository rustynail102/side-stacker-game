import { ValidationError } from "@app/errors/validationError"
import { Request } from "express"
import isEmpty from "lodash/isEmpty"
import omitBy from "lodash/omitBy"
import isUndefined from "lodash/isUndefined"
import { ZodRawShape, z } from "zod"

export class RequestValidationService {
  static validateObject = <T extends ZodRawShape>(
    object: Record<string, unknown>,
    schema: z.ZodObject<T>,
  ) => {
    const incorrectFields: string[] = []
    const schemaKeys: string[] = schema.keyof()._def.values

    Object.keys(object).forEach((key) => {
      if (!schemaKeys.includes(key as never)) {
        incorrectFields.push(key)
      }
    })

    if (!isEmpty(incorrectFields)) {
      throw new ValidationError(incorrectFields)
    }

    const objectWithoutEmptyFields = omitBy(object, isUndefined)

    schema.parse(objectWithoutEmptyFields)

    return objectWithoutEmptyFields as z.infer<typeof schema>
  }

  static validateBody = <T extends ZodRawShape>(
    body: Request["body"],
    schema: z.ZodObject<T>,
  ) => this.validateObject(body, schema)

  static validateParams = <T extends ZodRawShape>(
    params: Request["params"],
    schema: z.ZodObject<T>,
  ) => this.validateObject(params, schema)

  static validateQuery = <T extends ZodRawShape>(
    query: Request["query"],
    schema: z.ZodObject<T>,
  ) => this.validateObject(query, schema)
}
