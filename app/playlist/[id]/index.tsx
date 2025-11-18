import { View, Text } from 'react-native'
import React from 'react'
import ListItemPlayList from './listItem/list-items'

interface Props {
    id?: string
}

export default function PlayList({id}: Props) {
  return (
    <View style={{ width: "100%" }}>
      <ListItemPlayList userId={id}/>
    </View>
  )
}