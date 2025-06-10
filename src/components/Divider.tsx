import { View, StyleSheet } from 'react-native'
import React from 'react'

interface DividerProps {
  style?: object;
  children?: React.ReactNode;
}

const Divider: React.FC<DividerProps> = ({style, children}) => {
  return (
    <View style={{...styles.divider, ...style}}>
        {children}
    </View>
  )
}

export default Divider

const styles = StyleSheet.create({  
  divider: {
    borderBottomColor: 'rgba(136, 136, 136, 0.2)',
    borderBottomWidth: .75,
    width: "100%"
  }
})