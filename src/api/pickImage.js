var ImagePicker = require('react-native-image-picker');

var options = {
    quality: 1.0,
    maxWidth: 500,
    maxHeight: 500,
    title: 'Select Image',
    // customButtons: [
    //   {name: 'fb', title: 'Choose Photo from Facebook'},
    // ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

let pick = (cb) => {
    ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            alert('Please check permission access to camera on your devices')
        } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
        } else {
            let source = { uri: response.uri };
            cb(source, response.data);

        }
    });
}

module.exports = pick;