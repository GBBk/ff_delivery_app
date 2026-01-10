import CustomHeader from '@/components/CustomHeader'
import CustomProfileInput from '@/components/CustomProfileInput'
import { images } from '@/constants'
import { getFullUser, logout, updateProfile } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'
import useAuthStore from '@/store/auth.store'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const VIEWCLASSNAME = 'w-11/12 flex-row gap-2 items-center'

const Profile = () => {
  const { data } = useAppwrite({fn: getFullUser})
  const [form, setForm] = useState({
    phone: data?.phone || '',
    address: data?.address || ''
  });
  const {setIsAuthenticated} = useAuthStore()

  const submit = async () => {
    const { phone, address} = form;

    try {
      await updateProfile({
        phone,
        address
      })
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  }

  const handleLogout = async () => {
  try {
    await logout();
    setIsAuthenticated(false);
    router.replace("/sign-in");
  } catch (error) {
    console.log("Error:", error);
  }
};

  useEffect(() => {
    if(data) {
      setForm({
        phone: data.phone || '',
        address: data.address || ''
      })
    }
  }, [data])

  return (
    <SafeAreaView className='bg-white h-full'>
      <CustomHeader title='Profile' />
      <View className='flex-center mt-10 gap-5'>
        <Image source={data?.avatar} className='w-20 h-20 rounded-full bg-gray-200' />
        <CustomProfileInput source={images.user} label="Full Name" data={data?.name} onChangeText={(text) => setForm((prev)=> ({...prev, name: text}))}/>
        <CustomProfileInput source={images.envelope} label="Email" data={data?.email} onChangeText={(text) => setForm((prev)=> ({...prev, email: text}))}/>
        <CustomProfileInput source={images.phone} label="Phone Number" data={form?.phone} onChangeText={(text) => setForm((prev)=> ({...prev, phone: text}))} />
        <CustomProfileInput source={images.location} label="Address" data={form?.address} onChangeText={(text) => setForm((prev)=> ({...prev, address: text}))} />
        <TouchableOpacity className='bg-orange-100 border border-orange-500 p-4 mx-5 mb-5 rounded-full w-10/12 flex-center' onPress={submit}>
          <Text className='text-primary font-bold'> Edit Profile </Text>
        </TouchableOpacity >
        <TouchableOpacity className='bg-red-100 border border-red-500 p-4 mx-5 mb-5 rounded-full  w-10/12 flex-center' onPress={handleLogout}>
          <View className='flex-row gap-3 items-center'>
            <Image source={images.logout} className='size-5' resizeMode='contain'/>
            <Text className='text-red-500 font-bold' > Logout </Text>
          </View>
        </TouchableOpacity >
      </View>
      
    </SafeAreaView>
  )
}

export default Profile