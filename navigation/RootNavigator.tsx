// navigation/RootNavigator.tsx
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './type';
import { useAuth } from '@/context/auth';
import LoginScreen from '@/app/login';
import HomeScreen from '@/app/(tabs)/index';
import { navigationRef } from '@/utils/RootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { user, loading } = useAuth();

    if (loading) return null;

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }} >
                {user ? (
                    <Stack.Screen name="Home" component={HomeScreen} />
                ) : (
                    <Stack.Screen name="signIn" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
