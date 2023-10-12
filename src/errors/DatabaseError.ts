import DatabaseError from 'db-errors';
import {
  BadRequestError,
  NotFoundError,
  InternalError,
} from '@n-errors/HttpError';

// Database error handling
// Path: src/errors/DatabaseError.ts

// Convert table name to model name
const tableNameToModelName = (tableName: string) => {
  const words = tableName.split('_');
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join('');
};

const getModelFromForeignKey = (model: string, foreignKey: string) => {
  // Remove model name from foreign key
  const foreignKeyWithoutModel = foreignKey.replace(`${model.toLowerCase()}_`, '');
  // Remove foreign key suffix
  const foreignKeyWithoutSuffix = foreignKeyWithoutModel.replace('_foreign', '');
  // Remove id suffix
  const foreignKeyWithoutIdSuffix = foreignKeyWithoutSuffix.replace('_id', '');
  // Convert foreign key to model name
  return tableNameToModelName(foreignKeyWithoutIdSuffix);
};

export const handleDatabaseError = (error: any) => {
  if (error instanceof NotFoundError) {
    throw error;
  } else if (error instanceof BadRequestError) {
    throw error;
  } else if (error instanceof InternalError) {
    throw error;
  } else if (error instanceof DatabaseError.CheckViolationError) {
    const model = tableNameToModelName(error.table);
    throw new BadRequestError(`${model} violates check constraint.`);
  } else if (error instanceof DatabaseError.ForeignKeyViolationError) {
    const model = tableNameToModelName(error.table);
    throw new BadRequestError(`Invalid ${getModelFromForeignKey(model, error.constraint)} id specified.`);
  } else if (error instanceof DatabaseError.NotNullViolationError) {
    const model = tableNameToModelName(error.table);
    throw new BadRequestError(`${model} has null value in ${error.column} column.`);
  } else if (error instanceof DatabaseError.UniqueViolationError) {
    const columns = tableNameToModelName(error.columns.join(', '));
    const model = tableNameToModelName(error.table);
    throw new BadRequestError(`${columns} in ${model} already exists.`);
  } else if (error instanceof DatabaseError.DataError) {
    throw new BadRequestError('Data error.');
  } else if (error instanceof DatabaseError.DBError) {
    throw new InternalError('Database error.');
  }
};
