import { CalendarDataWithMetadata } from '../type';

export const alignDataList = (prevList: CalendarDataWithMetadata[], currentList: CalendarDataWithMetadata[]): CalendarDataWithMetadata[] => {
    // Create a map from currentList for quick lookup
    const currentMap = currentList.reduce((map, item) => {
        map[item.id] = item;
        return map;
    }, {});

    // Create the result array based on prevList order
    const alignedList = prevList.map((prevItem) => {
        if (!prevItem) return null;
        if (!prevItem.metadata?.isEnd && currentMap[prevItem.id]) {
            return currentMap[prevItem.id];
        }
        return null;
    });

    const cleanedArray = removeTrailingNulls<CalendarDataWithMetadata>(alignedList);

    // Find items in currentList that are not in prevList
    const prevIds = new Set(prevList.filter((item) => item).map((item) => item.id));
    const additionalItems = currentList.filter((item) => !prevIds.has(item.id));

    return fillNullsWithItems(cleanedArray, additionalItems);
};

const fillNullsWithItems = (array: CalendarDataWithMetadata[], items: CalendarDataWithMetadata[]): CalendarDataWithMetadata[] => {
    let itemIndex = 0; // To keep track of items to insert

    const filledArray = array.map((element) => {
        if (element === null && itemIndex < items.length) {
            const itemToInsert = items[itemIndex];
            itemIndex += 1;
            return itemToInsert;
        }
        return element;
    });
    // Append any remaining items
    const remainingItems = items.slice(itemIndex);
    return filledArray.concat(remainingItems);
};

const removeTrailingNulls = <T>(array: Array<T>): Array<T> => {
    let i = array.length - 1;
    while (i >= 0 && array[i] === null) {
        i--;
    }
    return array.slice(0, i + 1);
};
