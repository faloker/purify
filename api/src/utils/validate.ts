import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export async function validateClass(classToValidateAgainst, instanceToValidate): Promise<void> {
  await validate(plainToClass(classToValidateAgainst, instanceToValidate))
    .then(errors => {
      if (errors.length > 0) {
        throw new Error(`Failed Validation ${errors}`)
      }
    })
    .catch(error => {
      throw new Error(`Failed Validation ${error}`)
    })
}
