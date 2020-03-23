/*
 Navicat Premium Data Transfer

 Source Server         : demo
 Source Server Type    : MongoDB
 Source Server Version : 40010
 Source Host           : localhost:27017
 Source Schema         : sdms

 Target Server Type    : MongoDB
 Target Server Version : 40010
 File Encoding         : 65001

 Date: 23/03/2020 14:27:06
*/


// ----------------------------
// Collection structure for admin
// ----------------------------
db.getCollection("admin").drop();
db.createCollection("admin");

// ----------------------------
// Documents of admin
// ----------------------------
db.getCollection("admin").insert([ {
    _id: ObjectId("5d7c86dc7ee37325e0160f3c"),
    username: "一梦此间",
    password: "$2a$10$f1AzmP1yVG7TGeRPXd./Lu95vKsUiAHqpqGmwcpiL6V5cWlZHXWw2",
    avatar: "http://127.0.0.1:8888/public/41f85d88b7c54c0cc17498a14f1d8662",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for buildingInfo
// ----------------------------
db.getCollection("buildingInfo").drop();
db.createCollection("buildingInfo");

// ----------------------------
// Documents of buildingInfo
// ----------------------------
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d82082700174d3a4cf22298"),
    status: NumberInt("1"),
    "respective_region": "同大",
    nums: NumberInt("2"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d82082b00174d3a4cf22299"),
    status: NumberInt("1"),
    "respective_region": "同大",
    nums: NumberInt("3"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d82082e00174d3a4cf2229a"),
    status: NumberInt("1"),
    "respective_region": "三里",
    nums: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d82083200174d3a4cf2229b"),
    status: NumberInt("1"),
    "respective_region": "三里",
    nums: NumberInt("2"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d82083700174d3a4cf2229c"),
    status: NumberInt("1"),
    "respective_region": "三里",
    nums: NumberInt("3"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d82084800174d3a4cf2229e"),
    status: NumberInt("1"),
    "respective_region": "西区",
    nums: NumberInt("1"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d82084c00174d3a4cf2229f"),
    status: NumberInt("1"),
    "respective_region": "西区",
    nums: NumberInt("2"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d82084f00174d3a4cf222a0"),
    status: NumberInt("1"),
    "respective_region": "西区",
    nums: NumberInt("3"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5d8b235d5699d92f20d42984"),
    status: NumberInt("1"),
    "respective_region": "同大",
    nums: NumberInt("4"),
    __v: NumberInt("0")
} ]);
db.getCollection("buildingInfo").insert([ {
    _id: ObjectId("5dafae5eae7ab416a4e1b264"),
    status: NumberInt("1"),
    "respective_region": "同大",
    nums: NumberInt("5"),
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for dormitory
// ----------------------------
db.getCollection("dormitory").drop();
db.createCollection("dormitory");

// ----------------------------
// Documents of dormitory
// ----------------------------
db.getCollection("dormitory").insert([ {
    _id: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    "respective_region": ObjectId("5d82082700174d3a4cf22298"),
    "residual_position": NumberInt("0"),
    "hostel_no": NumberInt("414"),
    __v: NumberInt("0")
} ]);
db.getCollection("dormitory").insert([ {
    _id: ObjectId("5dac612ce0635b0bcc1fdfc1"),
    "respective_region": ObjectId("5d82082700174d3a4cf22298"),
    "residual_position": NumberInt("1"),
    "hostel_no": NumberInt("411"),
    __v: NumberInt("0")
} ]);
db.getCollection("dormitory").insert([ {
    _id: ObjectId("5dac6131e0635b0bcc1fdfc2"),
    "respective_region": ObjectId("5d82082700174d3a4cf22298"),
    "residual_position": NumberInt("4"),
    "hostel_no": NumberInt("412"),
    __v: NumberInt("0")
} ]);
db.getCollection("dormitory").insert([ {
    _id: ObjectId("5dac6371e0635b0bcc1fdfc3"),
    "respective_region": ObjectId("5d82082700174d3a4cf22298"),
    "residual_position": NumberInt("4"),
    "hostel_no": NumberInt("401"),
    __v: NumberInt("0")
} ]);
db.getCollection("dormitory").insert([ {
    _id: ObjectId("5dac7225e192481320300c51"),
    "respective_region": ObjectId("5d82082700174d3a4cf22298"),
    "residual_position": NumberInt("4"),
    "hostel_no": NumberInt("415"),
    __v: NumberInt("0")
} ]);
db.getCollection("dormitory").insert([ {
    _id: ObjectId("5dac722ee192481320300c52"),
    "respective_region": ObjectId("5d82082700174d3a4cf22298"),
    "residual_position": NumberInt("4"),
    "hostel_no": NumberInt("409"),
    __v: NumberInt("0")
} ]);
db.getCollection("dormitory").insert([ {
    _id: ObjectId("5dac7241e192481320300c53"),
    "respective_region": ObjectId("5d82082700174d3a4cf22298"),
    "residual_position": NumberInt("4"),
    "hostel_no": NumberInt("406"),
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for electricityCharges
// ----------------------------
db.getCollection("electricityCharges").drop();
db.createCollection("electricityCharges");

// ----------------------------
// Documents of electricityCharges
// ----------------------------
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5dae8b8ac320e23508b03e26"),
    cost: NumberInt("101"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-09-30T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5daea12fba6cfa3afcb42f97"),
    cost: NumberInt("70"),
    dormitory: ObjectId("5dac612ce0635b0bcc1fdfc1"),
    time: ISODate("2019-09-30T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5daea140ba6cfa3afcb42f98"),
    cost: NumberInt("80"),
    dormitory: ObjectId("5dac6131e0635b0bcc1fdfc2"),
    time: ISODate("2019-08-31T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5daea331fb55be3a2c33be57"),
    cost: NumberInt("70"),
    dormitory: ObjectId("5dac722ee192481320300c52"),
    time: ISODate("2019-09-30T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5daea33dfb55be3a2c33be58"),
    cost: NumberInt("97"),
    dormitory: ObjectId("5dac7225e192481320300c51"),
    time: ISODate("2019-09-30T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5daea353fb55be3a2c33be59"),
    cost: NumberInt("50"),
    dormitory: ObjectId("5dac7241e192481320300c53"),
    time: ISODate("2019-09-30T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db2653a7075b21ee4020bb0"),
    cost: NumberInt("20"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2018-12-31T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265447075b21ee4020bb1"),
    cost: NumberInt("20"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-01-31T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db2654d7075b21ee4020bb2"),
    cost: NumberInt("40"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-02-28T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265797075b21ee4020bb3"),
    cost: NumberInt("40"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-03-31T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265817075b21ee4020bb4"),
    cost: NumberInt("50"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-04-30T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265a77075b21ee4020bb5"),
    cost: NumberInt("60"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-05-31T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265b37075b21ee4020bb6"),
    cost: NumberInt("70"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-06-30T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265bc7075b21ee4020bb7"),
    cost: NumberInt("82"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-07-31T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265c57075b21ee4020bb8"),
    cost: NumberInt("90"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-08-31T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265cc7075b21ee4020bb9"),
    cost: NumberInt("11"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-10-31T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("electricityCharges").insert([ {
    _id: ObjectId("5db265d47075b21ee4020bba"),
    cost: NumberInt("30"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    time: ISODate("2019-11-30T16:00:00.000Z"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for housemasters
// ----------------------------
db.getCollection("housemasters").drop();
db.createCollection("housemasters");

// ----------------------------
// Documents of housemasters
// ----------------------------
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5d82449d3322cf47b46ac711"),
    username: "不才",
    password: "123456",
    name: "9999",
    sex: "女",
    tel: "18671657580",
    email: "2214452605@qq.com",
    management: ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0"),
    avatar: "http://127.0.0.1:8888/public/8011c1587d8ad18eae2495d832fe8217"
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5d8248e016bae1417cbc691b"),
    username: "乐正绫",
    password: "123456",
    name: "9999",
    sex: "女",
    tel: "18671657580",
    email: "2214452605@qq.com",
    management: ObjectId("5d82082b00174d3a4cf22299"),
    __v: NumberInt("0"),
    avatar: "http://127.0.0.1:8888/public/f1d639f1fc47ab64cf69621ee75874c3"
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5d82f86cdc6fda38d8b08396"),
    username: "乐正绫",
    password: "123456",
    name: "乐正绫",
    sex: "女",
    tel: "18671657580",
    email: "2214452605@qq.com",
    management: ObjectId("5d82082e00174d3a4cf2229a"),
    __v: NumberInt("0"),
    avatar: "http://127.0.0.1:8888/public/defalut.png"
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5d82f8a7a06239511cb4a849"),
    username: "星尘",
    password: "123456",
    name: "星尘",
    sex: "女",
    tel: "18671657580",
    email: "626059207@qq.com",
    management: ObjectId("5d82083200174d3a4cf2229b"),
    __v: NumberInt("0"),
    avatar: "http://127.0.0.1:8888/public/defalut.png"
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5d82f99b8201ac52582f33b0"),
    username: "111111",
    password: "1111111",
    name: "11",
    sex: "男",
    tel: "18671657580",
    email: "18671657580@qq.com",
    management: ObjectId("5d82083700174d3a4cf2229c"),
    __v: NumberInt("0"),
    avatar: "http://127.0.0.1:8888/public/defalut.png"
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5d82f9ba8201ac52582f33b1"),
    username: "新建化",
    password: "1111111",
    name: "111111",
    sex: "女",
    tel: "18671657580",
    email: "123456789",
    management: ObjectId("5d82084800174d3a4cf2229e"),
    __v: NumberInt("0"),
    avatar: "http://127.0.0.1:8888/public/defalut.png"
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5d82fd2d5feacf38a0da2273"),
    username: "111111",
    password: "1111111111111",
    name: "1111111111",
    sex: "男",
    tel: "11111111111",
    email: "1111111111111",
    management: ObjectId("5d82084c00174d3a4cf2229f"),
    __v: NumberInt("0"),
    avatar: "http://127.0.0.1:8888/public/defalut.png"
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5d82fe73dd4f3f2db8d0b23d"),
    username: "222222",
    password: "22222222",
    name: "22222",
    sex: "女",
    tel: "22222222222",
    email: "22222",
    management: ObjectId("5d82084f00174d3a4cf222a0"),
    __v: NumberInt("0"),
    avatar: "http://127.0.0.1:8888/public/defalut.png"
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5dafaee61a000a0938d66a74"),
    username: "长安四韵",
    password: "123456",
    name: "李四",
    sex: "男",
    tel: "18671657580",
    email: "2214452605@qq.com",
    management: ObjectId("5d8b235d5699d92f20d42984"),
    avatar: "http://127.0.0.1:8888/public/defalut.png",
    __v: NumberInt("0")
} ]);
db.getCollection("housemasters").insert([ {
    _id: ObjectId("5dafaf2be38451316c880d45"),
    username: "长安四韵",
    password: "123456",
    name: "王五",
    sex: "男",
    tel: "18671657580",
    email: "2214452605@qq.com",
    management: ObjectId("5dafae5eae7ab416a4e1b264"),
    avatar: "http://127.0.0.1:8888/public/defalut.png",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for hygienics
// ----------------------------
db.getCollection("hygienics").drop();
db.createCollection("hygienics");

// ----------------------------
// Documents of hygienics
// ----------------------------
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5dad6b7ab9e76946583fec86"),
    "check_time": ISODate("2019-10-20T16:00:00.000Z"),
    leavingMessage: "卫生做的十分好，继续保持!",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    score: NumberInt("99"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5dadb35e3e13bc12fcb1d704"),
    "check_time": ISODate("2019-10-20T16:00:00.000Z"),
    leavingMessage: "继续保持！",
    dormitory: ObjectId("5dac612ce0635b0bcc1fdfc1"),
    score: NumberInt("90"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5dadb3743e13bc12fcb1d705"),
    "check_time": ISODate("2019-10-20T16:00:00.000Z"),
    leavingMessage: "不错",
    dormitory: ObjectId("5dac7241e192481320300c53"),
    score: NumberInt("97"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5dadb38f3e13bc12fcb1d706"),
    "check_time": ISODate("2019-10-20T16:00:00.000Z"),
    leavingMessage: "有待加强",
    dormitory: ObjectId("5dac6131e0635b0bcc1fdfc2"),
    score: NumberInt("87"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5dadb3af3e13bc12fcb1d707"),
    "check_time": ISODate("2019-10-20T16:00:00.000Z"),
    leavingMessage: "有待加强",
    dormitory: ObjectId("5dac6371e0635b0bcc1fdfc3"),
    score: NumberInt("60"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5dadb3bc3e13bc12fcb1d708"),
    "check_time": ISODate("2019-10-20T16:00:00.000Z"),
    leavingMessage: "还行",
    dormitory: ObjectId("5dac722ee192481320300c52"),
    score: NumberInt("77"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5dadc010934024274cfdf84f"),
    "check_time": ISODate("2019-10-20T16:00:00.000Z"),
    leavingMessage: "一般，继续加油",
    dormitory: ObjectId("5dac612ce0635b0bcc1fdfc1"),
    score: NumberInt("78"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5dadc05f934024274cfdf850"),
    "check_time": ISODate("2019-09-09T16:00:00.000Z"),
    leavingMessage: "十分优秀！",
    dormitory: ObjectId("5dac7241e192481320300c53"),
    score: NumberInt("97"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5db2ed9843cd7617c0f90223"),
    "check_time": ISODate("2019-10-13T16:00:00.000Z"),
    leavingMessage: "还有部分未打扫干净!",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    score: NumberInt("79"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5db2edb843cd7617c0f90224"),
    "check_time": ISODate("2019-10-06T16:00:00.000Z"),
    leavingMessage: "不错，继续加油!",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    score: NumberInt("97"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5db2edd243cd7617c0f90225"),
    "check_time": ISODate("2019-09-30T16:00:00.000Z"),
    leavingMessage: "ok",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    score: NumberInt("97"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5db2ee0843cd7617c0f90226"),
    "check_time": ISODate("2019-10-27T16:00:00.000Z"),
    leavingMessage: "有待加强!",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    score: NumberInt("79"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("hygienics").insert([ {
    _id: ObjectId("5db2ee2e43cd7617c0f90227"),
    "check_time": ISODate("2019-11-03T16:00:00.000Z"),
    leavingMessage: "可以",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    score: NumberInt("70"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for maintenance
// ----------------------------
db.getCollection("maintenance").drop();
db.createCollection("maintenance");

// ----------------------------
// Documents of maintenance
// ----------------------------
db.getCollection("maintenance").insert([ {
    _id: ObjectId("5db3f96535012a0cec6573b4"),
    time: ISODate("2019-10-26T07:44:36.000Z"),
    status: NumberInt("1"),
    "repair_time": ISODate("2019-10-26T07:51:15.077Z"),
    content: "宿舍电灯坏了",
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    __v: NumberInt("0")
} ]);
db.getCollection("maintenance").insert([ {
    _id: ObjectId("5db984f6ea7f9c4f38267b06"),
    time: ISODate("2019-10-30T12:41:25.000Z"),
    status: NumberInt("1"),
    "repair_time": ISODate("2019-10-30T12:47:54.202Z"),
    content: ".......",
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for notices
// ----------------------------
db.getCollection("notices").drop();
db.createCollection("notices");

// ----------------------------
// Documents of notices
// ----------------------------
db.getCollection("notices").insert([ {
    _id: ObjectId("5dafaf2be38451316c880d46"),
    "bf_id": ObjectId("5dafaf2be38451316c880d45"),
    time: ISODate("2019-10-23T01:38:51.238Z"),
    detail: "初始化",
    __v: NumberInt("0")
} ]);
db.getCollection("notices").insert([ {
    _id: ObjectId("5dafe3e416853e15a8004fa2"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    time: ISODate("2019-10-24T16:00:00.000Z"),
    detail: "若能再相见\n那条长街\n将泛黄的老胶卷\n拨回到十年更前\n\n若道别\n逃离浮喧\n似重逢后再道别\n或久违的初见\n"
} ]);

// ----------------------------
// Collection structure for student
// ----------------------------
db.getCollection("student").drop();
db.createCollection("student");
db.getCollection("student").createIndex({
    sno: NumberInt("1")
}, {
    name: "sno_1",
    unique: true
});

// ----------------------------
// Documents of student
// ----------------------------
db.getCollection("student").insert([ {
    _id: ObjectId("5daee1260733be320cee0226"),
    sno: "517300264101",
    name: "张三",
    age: NumberInt("20"),
    sex: "男",
    password: "987654",
    avatar: "http://127.0.0.1:8888/public/63ed712b5e8fd61fbdc4335832ef4aec",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("student").insert([ {
    _id: ObjectId("5daf1bd9430d9f1c241f3930"),
    sno: "517300264102",
    name: "李四",
    age: NumberInt("19"),
    sex: "男",
    password: "123456",
    avatar: "http://127.0.0.1:8888/public/defalut.png",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("student").insert([ {
    _id: ObjectId("5daf1c18aed5801dd49b44f4"),
    sno: "517300264103",
    name: "王五",
    age: NumberInt("20"),
    sex: "男",
    password: "123456",
    avatar: "http://127.0.0.1:8888/public/defalut.png",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("student").insert([ {
    _id: ObjectId("5dafa2ddc96c491d30046ee7"),
    sno: "517300264104",
    name: "测试",
    age: NumberInt("20"),
    sex: "男",
    password: "1213456",
    avatar: "http://127.0.0.1:8888/public/defalut.png",
    dormitory: ObjectId("5dac6125e0635b0bcc1fdfc0"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("student").insert([ {
    _id: ObjectId("5dafa312c96c491d30046ee9"),
    sno: "517300264105",
    name: "测试1",
    age: NumberInt("20"),
    sex: "男",
    password: "123456",
    avatar: "http://127.0.0.1:8888/public/defalut.png",
    dormitory: ObjectId("5dac612ce0635b0bcc1fdfc1"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("student").insert([ {
    _id: ObjectId("5dafa32dc96c491d30046eeb"),
    sno: "517300264106",
    name: "测试2",
    age: NumberInt("19"),
    sex: "男",
    password: "123456",
    avatar: "http://127.0.0.1:8888/public/defalut.png",
    dormitory: ObjectId("5dac612ce0635b0bcc1fdfc1"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
db.getCollection("student").insert([ {
    _id: ObjectId("5dafa347c96c491d30046eed"),
    sno: "517300264107",
    name: "测试",
    age: NumberInt("20"),
    sex: "男",
    password: "123456",
    avatar: "http://127.0.0.1:8888/public/defalut.png",
    dormitory: ObjectId("5dac612ce0635b0bcc1fdfc1"),
    "bf_id": ObjectId("5d82082700174d3a4cf22298"),
    __v: NumberInt("0")
} ]);
