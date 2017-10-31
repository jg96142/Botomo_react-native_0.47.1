cd android
./gradlew assembleRelease
cd app/build/outputs/apk/
python apksigner.py  -o botomo.apk app-release-unsigned.apk
adb uninstall com.botomo
adb install botomo.apk
