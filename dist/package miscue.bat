echo C:\Program Files (x86)\Java\jdk1.6.0\bin\keytool -genkey -v -keystore PATH/TO/YOUR_RELEASE_KEY.keystore -alias YOUR_ALIAS_NAME -keyalg RSA -keysize 2048 -validity 10000

cd C:\Program Files (x86)\Java\jdk1.6.0\bin\

jarsigner -verbose -keystore C:\Users\Lee.2ESKIMOS\Appcelerator\Miscue\MiscueKey.keystore -storepass spikespike -keypass spikespike C:\Users\Lee.2ESKIMOS\Appcelerator\Miscue\build\android\bin\app-unsigned.apk Miscue

cd C:\android-sdk-win\build-tools\23.0.0.2\

zipalign -v 4 C:\Users\Lee.2ESKIMOS\Appcelerator\Miscue\build\android\bin\app-unsigned.apk C:\Users\Lee.2ESKIMOS\Appcelerator\Miscue\Dist\com.twoeskimos.miscue.apk
