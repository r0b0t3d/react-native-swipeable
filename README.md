# react-native-swipeable

Swipeable component for react native powered by Reanimated 2 and Gesture Handler

![alt text](pictures/intro.gif "Intro")
## Installation

```sh
yarn add @r0b0t3d/react-native-swipeable
```

Also add dependencies, and follow instructions there to setup your project
```
yarn add react-native-reanimated react-native-gesture-handler
```
## Usage

```js
import {
  SwipableItem,
  withSwipeableContext,
  useSwipeableContext,
} from 'react-native-swipeable';

// ...

function YourComponent() {
    const { close } = useSwipeableContext();

    ... 

    const renderLeftActions = useCallback(() => {
        return (
            <SwipableItem.Button onPress={handlePinPress}>
                <View style={[styles.delete, { backgroundColor: 'yellow' }]}>
                    <Text>Pin</Text>
                </View>
            </SwipableItem.Button>
        );
    }, [handlePinPress]);

    return (
        <SwipableItem
            containerStyle={styles.container}
            renderRightActions={renderRightActions}
            renderLeftActions={renderLeftActions}
            onStartDrag={handleStartDrag}
            onOpened={handleOnOpened}
            onClosed={handleOnClosed}
            onItemPress={handleItemPress}
        >
            <View style={styles.overlay}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
                </Text>
            </View>
            </View>
        </SwipableItem>
    );
}

export default withSwipeableContext(YourComponent);
```

Check [Example](example/src) for the trick I did to close the item when other opened. 

**Hint:** I used `Animated.ShareValue<number>` to set the current item with menu opened

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
