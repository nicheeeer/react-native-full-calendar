import { addDays, addHours } from 'date-fns';
import { CalendarData } from 'react-native-full-calendars';

const getRandomDate = (start: Date, rangeInDays: number): Date => {
    const randomDays = Math.floor(Math.random() * rangeInDays);
    const randomHours = Math.floor(Math.random() * 24);
    return addHours(addDays(start, randomDays), randomHours);
};

const mockColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#33FFF3'];
const mockContent = [
    'In the grand tapestry of existence, we often find ourselves standing at the crossroads of choices, each path brimming with uncertainties and promises alike. It is in these moments of hesitation that we are truly alive, for it is not the destination but the courage to embark on the journey that defines the essence of our being',
    'Project deadline',
    "Doctor's appointment",
    'Lunch with friends',
    'Gym session',
    'Weekly review',
    'Client presentation',
    'Birthday party',
    'Reading session',
    'Shopping trip',
];

const now = new Date();

export const mockData: CalendarData[] = Array.from({ length: 20 }, (_, index) => {
    const startAt = getRandomDate(now, 60);
    const endAt = addHours(startAt, Math.floor(Math.random() * 24 * 14) + 1);
    return {
        startAt,
        endAt,
        content: mockContent[index % mockContent.length],
        color: mockColors[index % mockColors.length],
        id: (Math.random() * 1000000000).toFixed(0),
    };
});
