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
  
