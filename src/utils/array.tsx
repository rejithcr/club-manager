export const arrayDifference = (originalArray: any[], newArray: any[], idField: string) => {
  const addedItems = newArray.filter(
    (newItem) => !originalArray.some((originalItem) => originalItem[idField] === newItem[idField])
  );

  const removedItems = originalArray.filter(
    (originalItem) => !newArray.some((newItem) => newItem[idField] === originalItem[idField])
  );

  return {
    "added": addedItems,
    "removed": removedItems
  }
};
