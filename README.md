# react-native-firebase-storage-ImageUpload
Upload image to firebase storage using react native. Stick and have a look that is all what you need. 
<br>
# Getting started <br> 
# 1. Setup firebase in your react-native project <br> 
  https://www.npmjs.com/package/firebase
  ** firebase version package.json ("firebase": "^5.0.3") is working for me.

# 2. Get Image-picker for react native working. </br> 
    https://github.com/react-community/react-native-image-picker
    install manually explained in the source. <br>
    After installing the module you can auto install the component. If this does not works you need to install it manually mentioned in       the source. Auto installation worked fine for me.
  ## Auto Installation: react-native link react-native-image-picker@latest </br>
  # 3. Getting started with Image uplaod to firebase storage.<br>
    we need to do some installations
    Go to https://www.npmjs.com/package/react-native-fetch-blob
    1. Install the module.
    2. Do set RNFB_ANDROID_PERMISSIONS = true  (also mentioned in source).
    3. Do: import RNFetchBlob from 'react-native-fetch-blob';
    4. Add some code in middle of class and import area
        const Blob = RNFetchBlob.polyfill.Blob;
        fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
        
# code for image upload 
  # Parameters  
    1. uri = response.uri // response is returned from image picker
    
                    imgName: response.fileName,
uploadImage = (uri, mime = 'application/octet-stream') => {
        // return new Promise((resolve, reject) => {
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        let uploadBlob = null;
        const sessionId = new Date().getTime();
        //child(this.state.imgName) conatins response.fillName returned from image picked in response.
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
                s

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

  
