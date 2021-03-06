import React, {Component} from 'react';
import {Platform,StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import firebase from "firebase";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from 'react-native-fetch-blob';


const Blob = RNFetchBlob.polyfill.Blob;
fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export default class App extends Component {
    constructor() {
        super();
        const config = {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: ""
        };
        firebase.initializeApp(config);
        this.state = {
            //sample url you can set it empty but need to do some handling because image does not support empty url
            imageUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStE88QZWx1eLEsnCSjvXBQHjxiXJ1nY0PlNkf7H6twi9ru_NBU3g',
            firebaseImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStE88QZWx1eLEsnCSjvXBQHjxiXJ1nY0PlNkf7H6twi9ru_NBU3g',
            imgName: ''
        }

    }

    getImage() {

        let options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        // First argument = let it be null
        // Second argument = response is the callback which sends object: response
        ImagePicker.showImagePicker(options, (response) => {
            console.warn('Response = ', response);

            if (response.didCancel) {
                console.warn('User cancelled image picker');
            }
            else if (response.error) {
                console.warn('ImagePicker Error: ', response.error);
            }
            else {
                // let source = { uri: response.uri };

                // You can also display the image using data:
                let source = {uri: 'data:image/jpeg;base64,' + response.data, image: "file.png"};

                this.setState({
                    imageUri: response.uri,
                    imgName: response.fileName,
                });
                this.uploadImage(this.state.imageUri);
            }
        });
    }

    uploadImage = (uri, mime = 'application/octet-stream') => {
        // return new Promise((resolve, reject) => {
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        let uploadBlob = null;
        const sessionId = new Date().getTime();
        const imageRef = firebase.storage().ref('/images/').child(this.state.imgName);
        fs.readFile(uploadUri, 'base64')
            .then((data) => {
                return Blob.build(data, {type: `${mime};Base64`})
            })
            .then((blob) => {
                uploadBlob = blob;
                return imageRef.put(blob, {contentType: mime})
            })
            .then((url) => {
                uploadBlob.close();
                return imageRef.getDownloadURL();

            })
            .then((url) => {

                this.storeReference(url, sessionId);
                // console.warn(url);
            })
            .catch((err) => {
                console.error(err);
            })
    }
    storeReference = (url) => {
        this.setState({firebaseImageUrl: url});
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.welcome} onPress={this.getImage.bind(this)}>
                    <Text>Click to upload image</Text>
                </TouchableOpacity>
                <View style={{flex: 1}}>
                    <Image source={{uri: this.state.imageUri}} style={{height: '100%', width: '100%'}}/>
                </View>
                <View style={{flex: 1}}>
                    <Text>Image from Firease url</Text>
                    <Image source={{uri: this.state.firebaseImageUrl}} style={{height: 100, width: "100%"}}/>
                    <Text>{this.state.firebaseImageUrl}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
