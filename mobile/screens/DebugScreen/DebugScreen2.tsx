import React, {useEffect, useRef} from 'react';
import {HeaderHeightContext} from '@react-navigation/stack';
import {StyleSheet, View, Animated} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import DraggableFlatList from 'react-native-draggable-flatlist';

type SomeProps = {navigation: any};

const exampleData = [...Array(20)].map((d, index) => ({
  key: `item-${index}`, // For example only -- don't use index as your key!
  label: index,
  backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${
    index * 5
  }, ${132})`,
}));

export default class DebugScreen2 extends React.Component {
  state = {
    data: exampleData,
    dragging: false,
  };
  point = new Animated.ValueXY();

  static contextType = HeaderHeightContext;

  panResponder: any;

  constructor(props: any) {
    super(props);
  }

  renderItem = ({item, index, drag, isActive}: any) => {
    return (
      <View
        style={{
          height: 100,
          width: 300,
          backgroundColor: isActive ? 'blue' : item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            backgroundColor: 'red',
          }}
          onPressIn={drag}>
          <Text>###</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'white',
            fontSize: 32,
          }}>
          {item.label}
        </Text>
      </View>
    );
  };

  render() {
    const {data} = this.state;

    return (
      <View style={styles.container}>
        <DraggableFlatList
          style={{width: '100%', backgroundColor: 'yellow'}}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `draggable-item-${item.key}`}
          onDragEnd={({data}) => this.setState({data})}
        />

        {/* {dragging && (
          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: 'black',
              zIndex: 2,
              height: 20,
              width: 100,
              top: this.point.getLayout().top,
            }}
          >
            <Text>Hello</Text>
          </Animated.View>
        )}
        <FlatList
          scrollEnabled={!dragging}
          style={{ width: '100%' }}
          data={data}
          // tslint:disable-next-line: jsx-no-lambda
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 1,
                padding: 20,
                flexDirection: 'row',
              }}
            >
              <View
                {...this.panResponder.panHandlers}
                style={{ height: 30, width: 30, backgroundColor: 'blue' }}
              >
                <Text>@</Text>
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  flex: 1,
                  backgroundColor: 'yellow',
                }}
              >
                {item}
              </Text>
            </View>
          )}
          keyExtractor={(item) => '' + item}
        />*/}
      </View>
    );
  }
}

const circleRadious = 40;

function DebugScreen(props: SomeProps) {
  useEffect(() => {});

  const touchX = useRef(new Animated.Value(0)).current;

  const click1 = () => {
    Animated.timing(touchX, {
      toValue: -150,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const click2 = () => {
    Animated.timing(touchX, {
      toValue: 150,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };
  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: touchX,
          },
        },
      },
    ],
    {useNativeDriver: false},
  );

  return (
    <View style={styles.container}>
      <Button onPress={click1} title="Button1" />
      <Button onPress={click2} title="Button2" />

      <PanGestureHandler onGestureEvent={onPanGestureEvent}>
        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                {
                  translateX: touchX,
                },
              ],
            },
          ]}
        />
      </PanGestureHandler>
    </View>
  );
}

// export default DebugScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: circleRadious,
    height: circleRadious,
    backgroundColor: 'red',
  },
});
