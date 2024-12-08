import React, { useCallback, useState } from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import Calendar from 'react-native-full-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { mockData } from './mockData';

function App(): React.JSX.Element {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handlePress = useCallback((date: Date) => {
        setSelectedDate(date);
    }, []);

    return (
        <GestureHandlerRootView>
            <SafeAreaView style={{ flex: 1 }}>
                <Calendar
                    selectedDate={selectedDate}
                    onPageChange={(date) => {
                        console.log(date);
                    }}
                    data={mockData}
                    onDatePress={handlePress}
                    width={Dimensions.get('window').width - 30}
                    theme={{ containerStyle: { alignItems: 'center' } }}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default App;
