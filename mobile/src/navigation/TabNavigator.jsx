import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../theme';

import EntrepreneurScreen from '../screens/EntrepreneurScreen';
import FreelancerScreen from '../screens/FreelancerScreen';
import InvestorScreen from '../screens/InvestorScreen';
import FeedScreen from '../screens/FeedScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    const { role } = useAuth();
    const roleTheme = THEME.roles[role] || THEME.roles.investor;
    const accent = roleTheme.primary;

    const DashboardScreen =
        role === 'freelancer' ? FreelancerScreen :
            role === 'investor' ? InvestorScreen : EntrepreneurScreen;

    const dashboardLabel =
        role === 'freelancer' ? 'Freelancer' :
            role === 'investor' ? 'Investor' : 'Entrepreneur';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: THEME.card,
                    borderTopColor: THEME.cardBorder,
                    borderTopWidth: 1,
                    paddingBottom: 6,
                    height: 62,
                },
                tabBarActiveTintColor: accent,
                tabBarInactiveTintColor: THEME.textMuted,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                tabBarIcon: ({ color, size, focused }) => {
                    const icons = {
                        Dashboard: focused ? 'home' : 'home-outline',
                        Feed: focused ? 'newspaper' : 'newspaper-outline',
                        Chat: focused ? 'chatbubbles' : 'chatbubbles-outline',
                        Analytics: focused ? 'bar-chart' : 'bar-chart-outline',
                        Profile: focused ? 'person-circle' : 'person-circle-outline',
                    };
                    return <Ionicons name={icons[route.name]} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: dashboardLabel }} />
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name="Chat" component={ChatListScreen} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
