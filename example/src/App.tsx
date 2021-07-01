import * as React from 'react';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import {} from 'react-native-swipeable';
import PersonItem from './components/PersonItem';

const DATA = [
  {
    id: 1,
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNCBWq-ooJMctuPFZ_rSqfQBLyazZuOOvGSTQgpPBmjmrAwJXRXIl1slGQvtR3p_Q7rS4&usqp=CAU',
    name: 'Christopher Posey',
  },
  {
    id: 2,
    avatar:
      'https://photoartinc.com/wp-content/uploads/2018/02/photos-for-profile-picture.jpg',
    name: 'Anna Joey',
  },
  {
    id: 3,
    avatar:
      'https://s.studiobinder.com/wp-content/uploads/2021/01/Best-black-and-white-portraits-by-Platon.jpg?resolution=2560,1',
    name: 'Rishi Micha',
  },
  {
    id: 4,
    avatar:
      'https://abrittonphotography.com/wp-content/uploads/2017/12/Famous-Black-and-White-Portrait-Photographers.jpg',
    name: 'Parminder Ibraheem',
  },
  {
    id: 5,
    avatar:
      'https://cdn.goodgallery.com/e5ba8caf-02ad-404d-b239-84f0f06ff99c/t/0400/2fkix8wm/black-white-portrait-photographer-baltimore-maryland.jpg',
    name: 'Nevena Pavle',
  },
  {
    id: 6,
    avatar:
      'https://www.amateurphotographer.co.uk/wp-content/uploads/2020/04/Mono-portraits-without-rotolight.jpg',
    name: 'Pitter Radmila',
  },
  {
    id: 7,
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInqh7fBdL9eYAdoTK4zt8wSkdCb-2chFApw&usqp=CAU',
    name: 'Celestino Redmund',
  },
];

export default function App() {
  const activeItem = useSharedValue(-1);

  const renderItem = React.useCallback(
    ({ item }) => {
      return <PersonItem item={item} activeItem={activeItem} />;
    },
    [activeItem]
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList style={styles.container} data={DATA} renderItem={renderItem} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
