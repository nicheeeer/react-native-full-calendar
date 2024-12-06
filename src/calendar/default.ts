import { Theme } from './type';

export const DEFAULT_THEME: Theme = {
    headerDateFormat: 'MMMM yyyy',
    dayLabelDateFormat: 'eeeeee',
    dayTextForamt: 'd',
    disableOpacity: 0.2,
    daySelectedStyle: {
        backgroundColor: 'rgb(216, 216, 216)',
    },
    dayTodayTextStyle: {
        color: 'white',
    },
    dayTodayStyle: {
        backgroundColor: 'purple',
        borderRadius: 20,
    },
    itemStartMargin: 2,
    itemEndMargin: 2,
    itemStartBorderRadius: 4,
    itemEndBorderRadius: 4,
};
