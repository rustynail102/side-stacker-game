import { ValidationError } from "@server/errors/validationError"
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

    // Transformation step - this is needed because values in the incoming requests
    // are always strings
    const transformedObject = Object.keys(objectWithoutEmptyFields).reduce(
      (acc, key) => {
        const value = objectWithoutEmptyFields[key]
        const fieldSchema = schema.shape[key as keyof T]
        const innerSchema =
          fieldSchema instanceof z.ZodOptional
            ? fieldSchema._def.innerType
            : fieldSchema

        if (innerSchema instanceof z.ZodNumber && typeof value === "string") {
          acc[key] = parseInt(value, 10)
        } else {
          acc[key] = value
        }

        return acc
      },
      {} as Record<string, unknown>,
    )

    schema.parse(transformedObject)

    return transformedObject as z.infer<typeof schema>
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
