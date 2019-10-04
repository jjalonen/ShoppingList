import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import {SQLite} from 'expo-sqlite';

const db  = SQLite.openDatabase('listdb.db');

export default function App() {

  const [items, setItems] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists list(id integer primary key not null, items string, amount string);');
      });
      updateList();
    }, []);


  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into list (items, amount) values(?, ?);',
      [items, amount]);
    }, null, updateList
    )
  }
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from list;', [], (_, { rows}) =>
      setList(rows._array)
      );
    });
  }
  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('delete from list where id = ?;', 
      [id]);
    }, null, updateList)
  }

  return (
    <View style={styles.container}>
      <Text>Ruokalista</Text>
        <View style={styles.container}>
        <View>
        <TextInput
          placeholder="Tuote"
          style={{fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(items) => setItems(items)}
          value={String(items)}
        />
         <TextInput
          placeholder="Määrä"
          style={{fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(amount) => setAmount(amount)}
          value={String(amount)}
        />

        </View>
        </View>
        <View style={styles.buttoncontainer}>
          <Button onPress={saveItem} title=" ADD " />
        </View>
        <View style={styles.listcontainer}>
        <FlatList
          style={{marginLeft: "5%"}}
          keyExtractor={item=> item.id.toString()}
          renderItem={({ item})  =>
          <View style={styles.listcontainer}><Text>{item.items},{item.amount} </Text>
            <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>done</Text>
            </View>}
            data={list}
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttoncontainer: {
    flex: 2,
    width: 150,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    padding: 20,
  },
  listcontainer: {
    flex: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
});
