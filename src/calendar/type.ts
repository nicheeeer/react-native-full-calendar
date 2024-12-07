import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface CalendarProps {
  /**
   * The data displayed in the calendar, including events
   */
  data: CalendarData[];
  /**
   *  A reference to the `CalendarController` instance, allowing external control or state inspection of the calendar.
   */
  ref?: React.Ref<CalendarController> | null;
  /**
   * The currently selected date in the calendar.
   */
  selectedDate?: Date | null;
  /**
   * The date considered as the current day in the calendar.
   * @defaultValue new Date()
   */
  currentDate?: Date;
  /**
   * Callback triggered when a date is pressed.
   * @param date The pressed date.
   * @param options Options associated with the pressed date.
   */
  onDatePress?: OnDatePress;
  /**
   * Callback triggered when the calendar page changes.
   * @param date The date representing the start of the new page.
   */
  onPageChange?: (date: Date) => void;
  /**
   * Function to render the header of the calendar.
   * @param props Object containing start date and end date information.
   */
  renderHeader?: RenderHeader;
  /**
   * Function to render the labels for days in the calendar (e.g., Mon, Tue).
   * @param props The date for which the label is rendered.
   */
  renderDayLabel?: RenderDayLabel;
  /**
   * Function to render the content of a single day in the calendar.
   * @param props Items and metadata associated with the date.
   */
  renderDate?: RenderDate;
  /**
   * Function to render text indicating the number of additional items beyond the visible count.
   * @param props The number of items exceeding `maxVisibleCount`.
   */
  renderMoreItemText?: RenderMoreItemText;
  /**
   * Theme settings for customizing the calendar's appearance.
   */
  theme?: Theme;
  /**
   * Number of additional pages to load before and after the current page.
   *
   * If `buffer` is 2, the calendar loads 2 pages before and 2 pages after the current page.
   * @defaultValue 1
   */
  buffer?: number;
  /**
   * The earliest date the user can navigate to in the calendar.
   */
  minDate?: Date;
  /**
   * The latest date the user can navigate to in the calendar.
   */
  maxDate?: Date;
  /**
   * The first day of the week.
   * @defaultValue 0 (Sunday)
   */
  weekStartDay?: WeekDayIndex;
  /**
   * The width of the calendar component.
   */
  width?: number;
  /**
   * The height of the calendar component.
   */
  height?: number;
  /**
   * The maximum number of items visible within a single date component.
   * @defaultValue 4
   */
  maxVisibleCount?: number;
}

export interface CalendarData {
  /**
   * The starting date and time of the event.
   */
  startAt: Date;
  /**
   * The ending date and time of the event.
   */
  endAt: Date;
  /**
   * The content or description of the event.
   */
  content: string;
  /**
   * The color associated with the event, typically used for visual distinction in the calendar.
   */
  color: string;
  /**
   * A unique identifier for the event.
   */
  id: string;
}

export interface CalendarMetadata {
  /**
   * Indicates whether the event starts on this date.
   * `true` means this date is the start of the event, and `false` otherwise.
   */
  isStart: boolean;
  /**
   * Indicates whether the event ends on this date.
   * `true` means this date is the end of the event, and `false` otherwise.
   */
  isEnd: boolean;
  /**
   * An array of dates that fall between the event's start date (`startAt`) and end date (`endAt`), inclusive.
   */
  datesInRange: DateString[];
}

export type CalendarDataWithMetadata = CalendarData & {
  metadata: CalendarMetadata;
};

export interface DateOptions {
  /**
   * Indicates whether the date is selected.
   * `true` means the date is selected, and `false` means it is not.
   */
  isSelected: boolean;
  /**
   * Indicates whether the date represents today.
   * `true` means the date is today, and `false` means it is not.
   */
  isToday: boolean;
  /**
   * Indicates whether the date is disabled.
   * `true` means the date is inactive, and `false` means it is active
   */
  isDisabled: boolean;
  /**
   * An array of basic data associated with the date.
   */
  items: CalendarData[];
  /**
   * An array of data associated with the date, including additional metadata.
   */
  itemsWithMetadata: CalendarDataWithMetadata[];
}

export type OnDatePress =
  | undefined
  | ((date: Date, options: DateOptions) => void);

export type RenderDate = (
  props: { date: Date } & DateOptions
) => JSX.Element | null;

export type RenderHeader = (props: {
  startDate: Date;
  endDate: Date;
}) => JSX.Element | null;

export type RenderDayLabel = (props: { date: Date }) => JSX.Element | null;

export type RenderMoreItemText = (props: {
  count: number;
}) => JSX.Element | null;

export type ImperativeOptions = {
  animated?: boolean;
};

export type CalendarController = {
  /**
   * Navigates to the next page in the calendar.
   * @param options Additional options to customize the navigation behavior.
   */
  nextPage: (options?: ImperativeOptions) => void;
  /**
   * Navigates to the previous page in the calendar.
   * @param options Additional options to customize the navigation behavior.
   */
  prevPage: (options?: ImperativeOptions) => void;
  /**
   * Sets the calendar to a specific page corresponding to the given date.
   * @param date The target date to navigate to.
   * @param options Additional options to customize the navigation behavior.
   */
  setPage: (date: Date, options?: ImperativeOptions) => void;
};

export interface Theme {
  /**
   * The style for the main calendar container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The style for the overall container of the calendar.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * The style for the container of each day.
   */
  dayContainerStyle?: StyleProp<ViewStyle>;
  /**
   * The style for the selected day.
   * @defaultValue { backgroundColor: 'rgb(216, 216, 216)' }
   */
  daySelectedStyle?: StyleProp<ViewStyle>;
  /**
   * The style for the container of the day number.
   */
  dayNumberStyle?: StyleProp<ViewStyle>;
  /**
   * The style for the text of the day number.
   */
  dayNumberTextStyle?: StyleProp<TextStyle>;
  /**
   * The style for the container of today's day.
   * @defaultValue { backgroundColor: 'purple', borderRadius: 20 }
   */
  dayTodayStyle?: StyleProp<ViewStyle>;
  /**
   * The style for the text of today's day.
   * @defaultValue { color: 'white' }
   */
  dayTodayTextStyle?: StyleProp<TextStyle>;
  /**
   * The style for the container of day items (events).
   */
  dayItemStyle?: StyleProp<ViewStyle>;
  /**
   * The style for the text of day items (events).
   */
  dayItemTextStyle?: StyleProp<TextStyle>;

  /**
   * The margin for the starting item (event).
   * @defaultValue 2
   */
  itemStartMargin?: number;
  /**
   * The border radius for the starting item (event).
   * @defaultValue 4
   */
  itemStartBorderRadius?: number;

  /**
   * The margin for the ending item (event).
   * @defaultValue 2
   */
  itemEndMargin?: number;
  /**
   * The border radius for the ending item (event).
   * @defaultValue 4
   */
  itemEndBorderRadius?: number;

  /**
   * The format used for day text.
   * @defaultValue d
   */
  dayTextForamt?: string;

  /**
   * The opacity when the date is disabled.
   * @defaultValue 0.2
   */
  disableOpacity?: number;
  /**
   * The style for the container of header.
   */
  headerStyle?: StyleProp<ViewStyle>;
  /**
   * The style for the text of header.
   */
  headerTextStyle?: StyleProp<TextStyle>;
  /**
   * The date format used in the header.
   * @defaultValue MMMM yyyy
   */
  headerDateFormat?: string;
  /**
   * The date format used for the day label.
   * @defaultValue eeeeee
   */
  dayLabelDateFormat?: string;
}

export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type DateString = `${number}${number}${number}${number}-${
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'}-${
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'}`;
