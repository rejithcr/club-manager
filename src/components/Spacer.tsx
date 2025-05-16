import { View } from 'react-native'
import React from 'react'

const Spacer = (props: {space?: number}) => {
  return (
    <View style={{marginVertical: props.space ?? 5}}/>
  )
}

export default Spacer