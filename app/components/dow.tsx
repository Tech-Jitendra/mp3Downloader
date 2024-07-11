import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, PermissionsAndroid, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';

const Downloader = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to download files',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const downloadFile = async () => {
    const isGranted = await requestStoragePermission();
    if (!isGranted) {
      Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
      return;
    }

    const { config, fs } = RNFetchBlob;
    let DownloadDir = fs.dirs.DownloadDir; // You can check the available directories in the documentation.

    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // <-- this is the only thing required
        notification: true,
        path: `${DownloadDir}/song.mp3`,
        description: 'Downloading MP3 song.',
      },
    };

    config(options)
      .fetch('GET', url)
      .then((res) => {
        setStatus('File downloaded successfully.');
        console.log('The file saved to ', res.path());
      })
      .catch((error) => {
        setStatus('Download failed.');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MP3 Downloader</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter MP3 URL"
        value={url}
        onChangeText={setUrl}
      />
      <Button title="Download MP3" onPress={downloadFile} />
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Downloader;
