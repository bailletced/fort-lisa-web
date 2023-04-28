export const isDefined = (object: unknown): boolean => {
  return object !== null && object !== undefined;
};

export const isNotDefined = (object: unknown) => !isDefined(object);
