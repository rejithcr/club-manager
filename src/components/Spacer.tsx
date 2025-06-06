import { View } from 'react-native'
import React from 'react'

const Spacer = (props: {space?: number, hspace?: number}) => {
  return (
    <View style={{marginVertical: props.space ?? 5, marginHorizontal: props.hspace ?? 0}}/>
  )
}

export default Spacer