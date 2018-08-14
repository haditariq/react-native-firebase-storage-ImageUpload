# react-native-firebase-storage-ImageUpload
Upload image to firebase storage using react native. Stick and have a look that is all what you need. 
<br>
# Getting started <br> 
# 1. Setup firebase in your react-native project <br> 
  https://www.npmjs.com/package/firebase
  ** firebase version package.json ("firebase": "^5.0.3" || 4.6.2 ) is working for me.

# 2. Get Image-picker for react native working. </br> 
    https://github.com/react-community/react-native-image-picker
    After Installing the module you can do Auto installtion react-native link react-native-image-picker@latest
    install manually explained in the source. <br>
    After installing the module you can auto install the component. If this does not works you need to install it
    manually mentioned in the source. Auto installation worked fine for me.
  ## Auto Installation: react-native link react-native-image-picker@latest </br>
  # 3. Getting started with Image uplaod to firebase storage.<br>
    we need to do some installations
    Go to https://www.npmjs.com/package/react-native-fetch-blob
    1. Install the module.
    2. Auto installtion: react-native link react-native-fetch-blob
    3. Do set RNFB_ANDROID_PERMISSIONS = true  (also mentioned in source).
    4. Do: import RNFetchBlob from 'react-native-fetch-blob';
    5. Add some code in middle of class and import area
        const Blob = RNFetchBlob.polyfill.Blob;
        fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        
# code for image upload 
    Parameters  
    1. uri = response.uri // response is returned from image picker
    uploadImage = (uri, mime = 'application/octet-stream') => {
        // return new Promise((resolve, reject) => {
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        let uploadBlob = null;
        const sessionId = new Date().getTime();
        //child(this.state.imgName) conatins response.fillName returned from image picked in response.
        // ref(/images/) make a folder on firebase storage
        imgName: response.fileName,
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
    
    
# Code all you need after installation
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



  
