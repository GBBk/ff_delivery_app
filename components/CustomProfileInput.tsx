import React from 'react'
import { Image, ImageSourcePropType, View } from 'react-native'
import CustomInput from './CustomInput'

const VIEWCLASSNAME = 'w-11/12 flex-row gap-2 items-center'

const CustomProfileInput = ({source, label, data, onChangeText}: {source: ImageSourcePropType, label: string, data: string, onChangeText: (text: string) => void}) => {
  return (
    <View className={VIEWCLASSNAME}>
          <Image source={source} className='size-10' resizeMode='contain'/>
          <CustomInput label={label} value={data} onChangeText={onChangeText} />
    </View>
  )
}

export default CustomProfileInput