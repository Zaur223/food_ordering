import {View, Text, Image, TouchableOpacity, Alert} from 'react-native'
import {useRouter} from 'expo-router'
import useAuthStore from '@/store/auth.store'
import {signOut} from '@/lib/appwrite'

const Profile = () => {
    const router = useRouter()
    const { user, setUser, setIsAuthenticated } = useAuthStore()

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (e: any) {
            // ignore errors but show a message
            Alert.alert('Error', e?.message || 'Could not sign out')
        } finally {
            setUser(null)
            setIsAuthenticated(false)
            router.replace('/sign-in')
        }
    }

    return (
        <View className="flex-1 items-center justify-center p-6 bg-white">
            {user?.avatar ? (
                <Image source={{ uri: user.avatar }} className="w-28 h-28 rounded-full mb-4" />
            ) : (
                <View className="w-28 h-28 rounded-full bg-gray-200 mb-4 items-center justify-center">
                    <Text className="text-2xl">{user?.name?.[0] ?? 'U'}</Text>
                </View>
            )}

            <Text className="base-bold text-lg mb-1">{user?.name ?? 'No name'}</Text>
            <Text className="body-regular text-gray-200 mb-6">{user?.email ?? ''}</Text>

            <TouchableOpacity onPress={handleSignOut} className="py-3 px-6 bg-primary rounded-lg">
                <Text className="text-white base-bold">Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Profile
