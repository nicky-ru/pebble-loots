export const proto = "syntax = \"proto2\";\n" +
  "\n" +
  "message SensorData\n" +
  "{\n" +
  " optional uint32 snr = 1;\n" +
  " optional uint32 vbat = 2;\n" +
  " optional uint32 latitude = 3;\n" +
  " optional uint32 longitude = 4;\n" +
  " optional uint32 gasResistance = 5;\n" +
  " optional uint32 temperature = 6;\n" +
  " optional uint32 pressure = 7;\n" +
  " optional uint32 humidity = 8;\n" +
  " optional uint32 light = 9;\n" +
  " optional uint32 temperature2 = 10;\n" +
  " repeated sint32 gyroscope = 11;\n" +
  " repeated sint32 accelerometer = 12;\n" +
  " optional string random = 13;\n" +
  "}\n" +
  "\n" +
  "message SensorConfig\n" +
  "{\n" +
  "    optional uint32 bulkUpload = 1;\n" +
  "    optional uint32 dataChannel = 2;\n" +
  "    optional uint32 uploadPeriod = 3;\n" +
  "    optional uint32 bulkUploadSamplingCnt = 4;\n" +
  "    optional uint32 bulkUploadSamplingFreq = 5;\n" +
  "    optional uint32 beep = 6;\n" +
  "    optional string firmware = 7;\n" +
  "}\n" +
  "\n" +
  "message SensorState\n" +
  "{\n" +
  "    optional uint32 state = 1;\n" +
  "}\n" +
  "\n" +
  "message SensorConfirm {\n" +
  "    optional string owner = 1;\n" +
  "}\n" +
  "\n" +
  "message BinPackage\n" +
  "{\n" +
  "    enum PackageType {\n" +
  "        DATA = 0;\n" +
  "        CONFIG = 1;\n" +
  "        STATE = 2;\n" +
  "    }\n" +
  "    required PackageType type = 1;\n" +
  "    required bytes data = 2;\n" +
  "    required uint32 timestamp = 3;\n" +
  "    required bytes signature = 4;\n" +
  "}\n" +
  "\n" +
  "message ConfirmPackage {\n" +
  "    required bytes owner = 1;\n" +
  "    required uint32 timestamp = 2;\n" +
  "    required bytes signature = 3;\n" +
  "    required uint32 channel = 4;\n" +
  "}\n"
