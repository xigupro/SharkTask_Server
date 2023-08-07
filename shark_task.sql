/*
 Navicat Premium Data Transfer

 Source Server         : 西谷
 Source Server Type    : MySQL
 Source Server Version : 50739
 Source Host           : localhost:3306
 Source Schema         : task_paradise

 Target Server Type    : MySQL
 Target Server Version : 50739
 File Encoding         : 65001

 Date: 10/12/2022 20:31:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for activities
-- ----------------------------
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `description` text COMMENT '活动说明',
  `type` smallint(2) DEFAULT '1' COMMENT '类型1.按任务完成数量；2.按邀请用户数量；3.按邀请奖励额；4.按任务奖励额',
  `award_rule` varchar(10240) DEFAULT NULL COMMENT '奖励规则，是一个json字符串数组，描述名次对应的奖金金额',
  `money_award` decimal(10,2) DEFAULT '0.00' COMMENT '奖金池金额',
  `min` int(8) DEFAULT '0' COMMENT '最低门槛值',
  `required` varchar(64) DEFAULT NULL COMMENT '达到条件,多个条件以英文逗号分隔。1绑定微信;2绑定手机号;3绑定支付宝;',
  `status` smallint(2) DEFAULT '1' COMMENT '1上架；2下架',
  `start_at` varchar(13) DEFAULT '' COMMENT '开始时间',
  `end_at` varchar(13) DEFAULT '' COMMENT '结束时间',
  `is_pay` smallint(2) DEFAULT '0' COMMENT '是否已发放奖金',
  `deleted` smallint(2) DEFAULT '0' COMMENT '1已删除；0未删除',
  `created_at` varchar(13) DEFAULT '' COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT '' COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='活动';

-- ----------------------------
-- Records of activities
-- ----------------------------
BEGIN;
INSERT INTO `activities` VALUES (1, '用户邀请排行榜', '邀请用户授权即可', 2, '[{\"value\":\"8\"},{\"value\":\"6\"},{\"value\":\"4\"}]', 18.00, 1, '1,2', 1, '1604203200000', '1607990400000', 0, 0, '1583566059606', '1608022604147');
INSERT INTO `activities` VALUES (2, '完成任务排行榜', '完成任务即可', 1, '[{\"value\":\"10\"},{\"value\":\"8\"},{\"value\":\"6\"}]', 24.00, 10, '', 1, '1582992000000', '1583510400000', 0, 0, '1583573833963', '1608020561812');
INSERT INTO `activities` VALUES (3, '邀请用户', '1.邀请用户；\n2.完成任务。', 2, '[{\"value\":\"1011\"},{\"value\":\"643\"},{\"value\":\"2\"},{\"value\":\"10\"},{\"value\":\"0\"}]', 1666.00, 0, '', 1, '1583596800000', '1584547200000', 0, 1, '1583637891382', '1584253974773');
INSERT INTO `activities` VALUES (4, '邀请奖励排行榜', '按照邀请奖励金额的大小排行', 3, '[{\"value\":\"10\"},{\"value\":\"8\"},{\"value\":\"6\"},{\"value\":\"4\"}]', 28.00, 10, '', 1, '1583769600000', '1584374400000', 0, 0, '1584452288749', '1608020579133');
INSERT INTO `activities` VALUES (5, '任务奖励额排行榜', '按照任务奖励总金额进行排行', 4, '[{\"value\":\"20\"},{\"value\":\"8\"},{\"value\":\"2\"}]', 30.00, 3, '', 1, '1604203200000', '1606694400000', 0, 0, '1584454259594', '1608185642102');
COMMIT;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) DEFAULT NULL COMMENT '用户ID',
  `name` varchar(128) DEFAULT NULL COMMENT '收件人',
  `tel` varchar(32) DEFAULT NULL COMMENT '联系电话',
  `province` varchar(32) DEFAULT NULL COMMENT '省份',
  `city` varchar(32) DEFAULT NULL COMMENT '城市',
  `area` varchar(32) DEFAULT NULL COMMENT '区',
  `address` varchar(512) DEFAULT NULL COMMENT '详细地址',
  `area_code` varchar(32) DEFAULT NULL COMMENT '区码',
  `postal_code` varchar(32) DEFAULT NULL COMMENT '邮编',
  `is_default` smallint(2) DEFAULT '0' COMMENT '是否默认',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '标题',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COMMENT='用户收货地址';

-- ----------------------------
-- Records of address
-- ----------------------------
BEGIN;
INSERT INTO `address` VALUES (1, 10031, '唐文雍', '13800138001', '河北省', '邯郸市', '邯山区', '天河区万科云', '130402', '510001', 1, '1623949899317', '1623950426143', 0);
INSERT INTO `address` VALUES (9, 10013, '汤唯', '13800138000', '辽宁省', '大连市', '西岗区', '万科云', '210203', '510000', 1, '1623950480070', '1624423328499', 0);
INSERT INTO `address` VALUES (10, 10013, '唐文雍', '15918575650', '天津市', '天津市', '河西区', '万科云', '120103', '510000', 0, '1623950559842', '1624765721824', 1);
INSERT INTO `address` VALUES (11, 10013, '是否', '13800138000', '北京市', '北京市', '东城区', '打发点', '110101', '410000', 0, '1631454433378', NULL, 0);
INSERT INTO `address` VALUES (12, 10031, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, '1631458962355', '1631459046393', 1);
INSERT INTO `address` VALUES (13, 10031, 't', '135453', NULL, NULL, NULL, NULL, '110101', '234345', 0, '1631460175663', '1631460521334', 1);
INSERT INTO `address` VALUES (14, 10031, 'asf', '2423434', '北京市', '北京市', NULL, NULL, '110101', '65', 0, '1631460339648', '1631460527749', 1);
INSERT INTO `address` VALUES (15, 10031, 'twy', '234234111', '北京市', '北京市', '东城区', '234111', '110101', '3453534534534534111', 1, '1631460542934', '1631460867138', 0);
COMMIT;

-- ----------------------------
-- Table structure for administrators
-- ----------------------------
DROP TABLE IF EXISTS `administrators`;
CREATE TABLE `administrators` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT '登录名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `role` varchar(2) DEFAULT NULL COMMENT '角色。1.超级管理员;2.普通管理员',
  `powers` text COMMENT '权限',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否删除。0否，1是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of administrators
-- ----------------------------
BEGIN;
INSERT INTO `administrators` VALUES (1, 'admin', 'admin', '1', NULL, '1547735288302', '1548769645672', 0);
INSERT INTO `administrators` VALUES (2, 'admin001', 'admin', '2', '{\"home\":{\"todo\":\"1\",\"message\":\"1\",\"today\":\"0\",\"overview\":\"1\"},\"banners\":{\"add\":\"1\",\"edit\":\"1\",\"delete\":\"0\"},\"entries\":{\"add\":\"1\",\"edit\":\"1\",\"delete\":\"0\"},\"tasks\":{\"add\":\"1\",\"edit\":\"1\",\"delete\":\"0\",\"status\":\"1\",\"grabList\":\"1\",\"reviewList\":\"1\",\"review\":\"1\",\"type\":\"1\",\"addType\":\"1\",\"editType\":\"1\",\"deleteType\":\"1\",\"price\":\"1\",\"addPrice\":\"1\",\"editPrice\":\"1\",\"deletePrice\":\"1\"},\"review\":{\"detail\":\"1\",\"delete\":\"0\",\"reject\":\"1\",\"resolve\":\"1\",\"appeal\":\"1\",\"handlingAppeal\":\"1\"},\"finance\":{\"resolve\":\"0\",\"reject\":\"1\",\"stream\":\"0\"},\"users\":{\"inviteList\":\"1\",\"moneyStream\":\"1\",\"invitationAward\":\"1\",\"scoreStream\":\"1\",\"editUser\":\"1\",\"recharge\":\"1\",\"reduce\":\"0\",\"editScore\":\"0\",\"vip\":\"1\",\"freeze\":\"0\",\"certificationReview\":\"1\",\"handlingCertificationReview\":\"1\",\"certificationDetail\":\"1\",\"deleteCertification\":\"0\",\"vipPrice\":\"1\",\"editVipPrice\":\"1\"},\"fixed\":{\"add\":\"1\",\"eidt\":\"1\",\"delete\":\"0\",\"status\":\"1\",\"sign\":\"1\",\"addSign\":\"1\",\"editSign\":\"1\",\"deleteSign\":\"0\"},\"activities\":{\"add\":\"1\",\"edit\":\"1\",\"delete\":\"0\",\"sendReward\":\"0\"},\"administrators\":{\"add\":\"1\",\"edit\":\"0\",\"delete\":\"0\"},\"system\":{\"base\":\"1\",\"task\":\"1\",\"sort\":\"1\",\"vip\":\"1\",\"entry\":\"1\",\"invite\":\"1\",\"withdraw\":\"1\",\"score\":\"1\",\"share\":\"1\",\"agreement\":\"1\",\"update\":\"1\",\"pay\":\"0\",\"ad\":\"1\"}}', '1598864551426', '1608783543836', 1);
INSERT INTO `administrators` VALUES (3, 'admin123', 'admin123', '2', '{\"home\":{\"todo\":\"0\",\"message\":\"0\",\"today\":\"0\",\"overview\":\"0\"},\"banners\":{\"add\":\"0\",\"edit\":\"0\",\"delete\":\"0\"},\"entries\":{\"add\":\"0\",\"edit\":\"0\",\"delete\":\"0\"},\"messages\":{\"add\":\"1\",\"edit\":\"1\",\"delete\":\"1\"},\"tasks\":{\"add\":\"0\",\"edit\":\"0\",\"delete\":\"0\",\"status\":\"0\",\"grabList\":\"0\",\"reviewList\":\"0\",\"review\":\"0\",\"type\":\"0\",\"addType\":\"0\",\"editType\":\"0\",\"deleteType\":\"0\",\"price\":\"0\",\"addPrice\":\"0\",\"editPrice\":\"0\",\"deletePrice\":\"0\"},\"review\":{\"detail\":\"0\",\"delete\":\"0\",\"reject\":\"0\",\"resolve\":\"0\",\"appeal\":\"0\",\"handlingAppeal\":\"0\"},\"finance\":{\"exportWithdraw\":\"0\",\"exportStream\":\"0\",\"resolve\":\"0\",\"reject\":\"0\",\"stream\":\"0\"},\"users\":{\"inviteList\":\"0\",\"moneyStream\":\"0\",\"invitationAward\":\"0\",\"scoreStream\":\"0\",\"editUser\":\"0\",\"recharge\":\"0\",\"reduce\":\"0\",\"editScore\":\"0\",\"vip\":\"0\",\"freeze\":\"0\",\"loginIps\":\"0\",\"certificationReview\":\"0\",\"handlingCertificationReview\":\"0\",\"certificationDetail\":\"0\",\"deleteCertification\":\"0\",\"vipPrice\":\"0\",\"editVipPrice\":\"0\",\"exportUserList\":\"0\"},\"fixed\":{\"add\":\"0\",\"eidt\":\"0\",\"delete\":\"0\",\"status\":\"0\",\"sign\":\"0\",\"addSign\":\"0\",\"editSign\":\"0\",\"deleteSign\":\"0\"},\"activities\":{\"add\":\"0\",\"edit\":\"0\",\"delete\":\"0\",\"sendReward\":\"0\"},\"help\":{\"add\":\"1\",\"edit\":\"1\",\"delete\":\"1\",\"type\":\"1\",\"addType\":\"1\",\"editType\":\"1\",\"deleteType\":\"1\"},\"administrators\":{\"add\":\"1\",\"edit\":\"1\",\"delete\":\"1\",\"logs\":\"1\"},\"system\":{\"base\":\"0\",\"task\":\"0\",\"sort\":\"0\",\"vip\":\"0\",\"entry\":\"0\",\"invite\":\"0\",\"withdraw\":\"0\",\"score\":\"0\",\"share\":\"0\",\"agreement\":\"0\",\"update\":\"0\",\"pay\":\"0\",\"ad\":\"0\"}}', '1609832773830', '1609832773830', 0);
COMMIT;

-- ----------------------------
-- Table structure for appeals
-- ----------------------------
DROP TABLE IF EXISTS `appeals`;
CREATE TABLE `appeals` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `task_id` int(8) NOT NULL COMMENT '任务快照ID',
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  `review_id` int(8) DEFAULT NULL COMMENT '审核ID',
  `status` smallint(2) NOT NULL DEFAULT '1' COMMENT '状态。1待处理；2.已处理；3已撤销',
  `content` text COMMENT '申诉内容',
  `images` varchar(1000) DEFAULT NULL COMMENT '申诉图片',
  `result` varchar(1000) DEFAULT NULL COMMENT '处理结果说明',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否，1是',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='申诉';

-- ----------------------------
-- Table structure for attestations
-- ----------------------------
DROP TABLE IF EXISTS `attestations`;
CREATE TABLE `attestations` (
  `id` smallint(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `gender` smallint(2) DEFAULT NULL COMMENT '1男；2女',
  `student_number` varchar(48) DEFAULT NULL COMMENT '学号',
  `id_card_number` varchar(48) DEFAULT NULL COMMENT '身份证',
  `is_graduated` smallint(2) DEFAULT NULL COMMENT '是否已毕业。1是；0否',
  `school` varchar(255) DEFAULT NULL COMMENT '学校',
  `subject` varchar(255) DEFAULT NULL COMMENT '专业',
  `start_time` varchar(13) DEFAULT NULL COMMENT '入学时间',
  `end_time` varchar(13) DEFAULT NULL COMMENT '毕业时间',
  `phone` varchar(64) DEFAULT NULL COMMENT '手机号',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `wechat` varchar(64) DEFAULT NULL COMMENT '微信',
  `created_at` varchar(13) DEFAULT NULL COMMENT '提交时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `user_id` smallint(10) DEFAULT NULL COMMENT '用户id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for banners
-- ----------------------------
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT COMMENT '轮播ID',
  `sort` smallint(6) DEFAULT '0',
  `type` smallint(2) DEFAULT '1' COMMENT '显示位置。1首页主轮播；2首页副轮播；3个人中心',
  `title` varchar(255) DEFAULT NULL COMMENT '轮播标题',
  `url` varchar(512) DEFAULT NULL COMMENT 'h5，安卓，iOS轮播跳转链接',
  `mp_url` varchar(512) DEFAULT NULL COMMENT '小程序页面链接',
  `image` varchar(255) NOT NULL COMMENT '轮播图片链接',
  `updated_at` varchar(133) DEFAULT NULL COMMENT '更新时间',
  `created_at` varchar(133) DEFAULT NULL COMMENT '创建时间',
  `created_by` varchar(255) DEFAULT NULL COMMENT '创建者',
  `updated_by` varchar(255) DEFAULT NULL COMMENT '更新者',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否；1是',
  `client` varchar(16) DEFAULT NULL COMMENT '1.小程序；2.h5；3.安卓；4.iOS。多个端以英文逗号分隔',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COMMENT='图片轮播';

-- ----------------------------
-- Records of banners
-- ----------------------------
BEGIN;
INSERT INTO `banners` VALUES (15, 0, 1, '邀请用户', '/#/invite', '../invite/invite', 'Fj6OtY1KVmEhvCtIQR81l81vqhlA', '1609323997574', '1574666340980', 'admin', NULL, 0, '2,3,4,1');
INSERT INTO `banners` VALUES (18, 0, 1, '福利中心', '/#/fixed', '../fixed_task/fixed_task', 'Fj1CIkkhD_E_HRhAvzXrf0acctXZ', '1609231368871', '1598535490585', 'admin', NULL, 0, '2,4,1,3');
INSERT INTO `banners` VALUES (20, 0, 2, '发布任务', '/#/task/form', '../task_form/task_form', 'FuMHLXZ0pCU6-gz1F4lL4ZgYivuY', '1609231955314', '1608711707055', 'admin', NULL, 0, '1,2,3,4');
INSERT INTO `banners` VALUES (21, 0, 3, '付费刷新', '/#/refresh/index', '../refresh/refresh', 'FsBRViXLmWNOPo5Iof7Cf2zKX4xq', '1609233896588', '1608712927212', 'admin', NULL, 0, '1,2,3,4');
INSERT INTO `banners` VALUES (24, 0, 1, '活动', '/#/activity/list', '../activities/activities', 'FnonlmvxY0M1x3F-kfPAZQb7ktM5', NULL, '1609232130347', 'admin', NULL, 0, '1,2,3,4');
INSERT INTO `banners` VALUES (25, 0, 3, '会员', '/#/vip/index', '../vip/vip', 'FrK72w4wgKCCuEeWYm7cjMMEow3-', NULL, '1609233803249', 'admin', NULL, 0, '1,2,3,4');
COMMIT;

-- ----------------------------
-- Table structure for certifications
-- ----------------------------
DROP TABLE IF EXISTS `certifications`;
CREATE TABLE `certifications` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) DEFAULT NULL COMMENT '用户id',
  `truename` varchar(255) DEFAULT NULL COMMENT '名称',
  `phone` varchar(15) DEFAULT NULL COMMENT '手机号',
  `remark` varchar(1024) DEFAULT NULL COMMENT '备注',
  `id_card` varchar(64) DEFAULT NULL COMMENT '证件号码',
  `certificate` varchar(255) DEFAULT NULL COMMENT '证件',
  `certificate_1` varchar(255) DEFAULT NULL COMMENT '证件1',
  `certificate_2` varchar(255) DEFAULT NULL COMMENT '证件2',
  `status` smallint(2) DEFAULT NULL COMMENT '0.审核中;1.审核通过;2.审核不通过',
  `result` varchar(255) DEFAULT NULL COMMENT '审核结果',
  `reviewed_at` varchar(13) DEFAULT NULL COMMENT '审核时间',
  `created_at` varchar(13) DEFAULT NULL COMMENT '提交审核时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `alipay_code` varchar(255) DEFAULT NULL COMMENT '支付宝收款码',
  `wxpay_code` varchar(255) DEFAULT NULL COMMENT '微信收款码',
  `alipay_account` varchar(255) DEFAULT NULL COMMENT '支付宝账号',
  `wechat_account` varchar(255) DEFAULT NULL COMMENT '微信号',
  `bank_card` varchar(255) DEFAULT NULL COMMENT '银行卡号',
  `bank_name` varchar(255) DEFAULT NULL COMMENT '银行名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of certifications
-- ----------------------------
BEGIN;
INSERT INTO `certifications` VALUES (6, 10013, '汤唯', '13800138000', '', '441882199909012341', 'FsKhlcIt5P8ZX_vXmZoVSBV0TJ3W', NULL, NULL, 1, NULL, NULL, '1609047164419', NULL, 'undefined', 'undefined', NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for duoyou_orders
-- ----------------------------
DROP TABLE IF EXISTS `duoyou_orders`;
CREATE TABLE `duoyou_orders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(128) DEFAULT NULL COMMENT '奖励订单号（前面带“hb”字符串的为活动订单号，没有的为广告任务订单号，所有订单号唯一',
  `advert_id` int(10) DEFAULT NULL COMMENT '广告任务ID\n广告任务ID\n广告任务ID',
  `advert_name` varchar(128) DEFAULT NULL COMMENT '广告任务名称',
  `created` varchar(14) DEFAULT NULL COMMENT '订单创建时间（奖励时间，时间戳）',
  `media_income` decimal(10,3) DEFAULT NULL COMMENT '媒体广告收益\n货币单位为后台配置的单位',
  `member_income` decimal(10,3) DEFAULT NULL COMMENT '媒体用户奖励\n货币单位为后台配置的单位',
  `media_id` varchar(128) DEFAULT NULL COMMENT '媒体主ID（开发者ID）',
  `user_id` varchar(128) DEFAULT NULL COMMENT '媒体主用户UID（APP用户UID）\n确保唯一性不能重复，否则用户领不到奖励.',
  `device_id` varchar(128) DEFAULT NULL COMMENT '设备号，安卓系统设备imei',
  `content` varchar(512) DEFAULT NULL COMMENT '备注内容\n备注内容',
  `sign` varchar(128) DEFAULT NULL COMMENT '32位MD5加密签名校验\n除sign外的所有必填项都参与加密',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for entries
-- ----------------------------
DROP TABLE IF EXISTS `entries`;
CREATE TABLE `entries` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `sort` smallint(6) DEFAULT '0' COMMENT '排序',
  `name` varchar(255) DEFAULT NULL COMMENT '入口名',
  `sub_name` varchar(128) DEFAULT NULL COMMENT '副标题',
  `url` varchar(512) DEFAULT NULL COMMENT '链接',
  `mp_url` varchar(512) DEFAULT NULL COMMENT '小程序页面链接',
  `icon` varchar(255) NOT NULL COMMENT '图标',
  `font_color` varchar(255) NOT NULL COMMENT '字体颜色',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否；1是',
  `client` varchar(16) DEFAULT NULL COMMENT '1.小程序；2.h5；3.安卓；4.iOS。多个端以英文逗号分隔',
  `is_show` smallint(2) DEFAULT '1' COMMENT '是否显示',
  `type` varchar(16) DEFAULT NULL COMMENT '展示位置。1首页；2发现；',
  `created_at` varchar(133) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(133) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COMMENT='首页入口';

-- ----------------------------
-- Records of entries
-- ----------------------------
BEGIN;
INSERT INTO `entries` VALUES (4, 1, '福利', '', '/#/fixed', '../fixed_task/fixed_task', 'FqXlit0FxHmYTavYuS9UPEJoEpsm', '#666666', 0, '2,3,1,4', 1, '1,2', '1580474667626', '1624990444335');
INSERT INTO `entries` VALUES (5, 0, '认证', '', '/#/certification/index', '../certification/certification', 'FrcJuUOtA9AWv10aSP0jHbCeVowA', '#666666', 0, '2,3,4,1', 0, '1,2', '1580477590386', '1624990461268');
INSERT INTO `entries` VALUES (6, 0, '试玩', '玩游戏也可以赚钱', 'duoyou', '', 'FkU-NzVvr8cb61Wxm9sZHLJBHbEj', '#666666', 0, '3,4', 1, '1,2', '1580477620320', '1624990483969');
INSERT INTO `entries` VALUES (7, 0, '会员', '享受更多权益', '/#/vip/index', '../vip/vip', 'FmA4MrthDYo5RT9Lr-wegE_OymaT', '#333', 0, '2,3,4,1', 1, '1,2', '1580525458208', '1624990475401');
INSERT INTO `entries` VALUES (11, 0, '活动', '', '/#/activity/list', '../activities/activities', 'FjInGQ7dBszQENPHZ4TUa9gRKvZY', '#333', 0, '2,3,4,1', 1, '1,2', '1583654828128', '1624990494078');
INSERT INTO `entries` VALUES (12, 0, '客服', '有事找我', '', 'kefu', 'Fq_EZElHhkCJFLVJpGktdz_D1b3c', '#333', 0, '1', 0, '1,2', '1583760131261', '1624990504146');
INSERT INTO `entries` VALUES (15, 0, '自营', '', '/#/task/self', '../self_tasks/self_tasks', 'Fs0Fg4ArEBLsul0kMbUuSW3f-gHY', '#333', 0, '2,1,3,4', 1, '1,2', '1588428891231', '1624990514416');
INSERT INTO `entries` VALUES (17, 0, '邀请', '', '/#/invite', '../invite/invite', 'FjInGQ7dBszQENPHZ4TUa9gRKvZY', '#333', 0, '2,1,3,4', 0, '1,2', '1590298600456', '1624990529347');
INSERT INTO `entries` VALUES (18, 0, '商城', '', '/#/goods/list', '../goods/list/index', 'Fp0VHPKBadLzxydTOYOP3dkbX5je', '#333', 0, '1,2,4,3', 1, '1', '1623857790670', '1624037294316');
INSERT INTO `entries` VALUES (19, 0, '合伙人', '', '/#/partner/index', '../partner/partner', 'FpNN0GucPr8StSnJgu2zusysa5ML', '#333', 0, '1,2,3,4', 1, '1,2', '1624990308350', NULL);
COMMIT;

-- ----------------------------
-- Table structure for favorite
-- ----------------------------
DROP TABLE IF EXISTS `favorite`;
CREATE TABLE `favorite` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `task_id` int(8) NOT NULL COMMENT '任务快照ID',
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  `type` smallint(2) DEFAULT '1' COMMENT '1.任务;2.店铺',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='任务收藏';

-- ----------------------------
-- Records of favorite
-- ----------------------------
BEGIN;
INSERT INTO `favorite` VALUES (1, 93, 10002, 1, '1598951128290');
COMMIT;

-- ----------------------------
-- Table structure for fixed_tasks
-- ----------------------------
DROP TABLE IF EXISTS `fixed_tasks`;
CREATE TABLE `fixed_tasks` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `description` varchar(2048) DEFAULT NULL COMMENT '描述',
  `link` varchar(1024) DEFAULT NULL COMMENT '任务链接，广告ID等',
  `status` smallint(2) DEFAULT '1' COMMENT '任务状态。1上架；2下架；',
  `type` smallint(2) DEFAULT '1' COMMENT '任务类型。1观看小程序广告；2.群分享；3.完成任务数量阶梯奖励；4.发布任务数量阶梯奖励；5.邀请用户数量阶梯奖励；6.实名认证；7.加入会员；8.观看APP广告',
  `ladder_count` smallint(2) DEFAULT '1' COMMENT '阶梯数',
  `money` decimal(10,2) DEFAULT '0.00' COMMENT '任务佣金',
  `frequency` smallint(2) DEFAULT '1' COMMENT '频率。1每日；2一次性(新手)',
  `need_vip` smallint(2) DEFAULT '0' COMMENT '是否只限会员领取',
  `client` varchar(32) DEFAULT '1' COMMENT '适用客户端，多个端用逗号分隔。1.小程序；2.h5；3.安卓；4.iOS',
  `onsell_at` varchar(13) DEFAULT NULL COMMENT '上架时间',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COMMENT='无需审核的固定任务，佣金自动发放';

-- ----------------------------
-- Records of fixed_tasks
-- ----------------------------
BEGIN;
INSERT INTO `fixed_tasks` VALUES (1, '观看广告', '点击观看按钮并观看完广告视频', '1029990819', 1, 8, 1, 0.20, 1, 0, '3,4', '1598666283717', '1592811977457');
INSERT INTO `fixed_tasks` VALUES (2, '转发微信群', '点击转发按钮并发送到微信群', NULL, 1, 2, 1, 0.10, 1, 0, '1', '1598519293002', '1575612801000');
INSERT INTO `fixed_tasks` VALUES (3, '完成1个任务', '领取并完成1个任务', '', 1, 3, 1, 1.00, 1, 0, '1,2,3,4', '1598519297962', '1575612801000');
INSERT INTO `fixed_tasks` VALUES (4, '完成8个任务', '领取并完成8个任务', '', 1, 3, 8, 15.00, 2, 0, '1,2,3,4', '1598519302744', '1575612801000');
INSERT INTO `fixed_tasks` VALUES (5, '发布3个任务', '成功发布3个任务', '', 1, 4, 3, 8.00, 1, 0, '1,2,3,4', '1598519282604', '1575612801000');
INSERT INTO `fixed_tasks` VALUES (6, '邀请1个用户', '成功邀请1个好友授权登录', '', 1, 5, 1, 0.50, 1, 0, '1,3,4,2', '1593614181150', '1575612801000');
INSERT INTO `fixed_tasks` VALUES (7, '邀请2个用户', '成功邀请2个好友授权登录', '', 1, 5, 2, 15.00, 1, 0, '1,2,3,4', '1593615056105', '1575612801000');
INSERT INTO `fixed_tasks` VALUES (8, '邀请3个用户', '成功邀请3个好友授权登录', '', 1, 5, 3, 20.00, 1, 0, '1,2,3,4', '1593614800894', '1575612801000');
INSERT INTO `fixed_tasks` VALUES (9, '邀请4个用户', '成功邀请4个好友授权登录', '', 1, 5, 4, 20.00, 1, 0, '1,2,3,4', '1593612675556', '1575612801000');
INSERT INTO `fixed_tasks` VALUES (11, 'xxx', 'sdfds', '1', 1, 5, 1, 10.00, 1, 0, '1', '1619837983280', '1619837983280');
COMMIT;

-- ----------------------------
-- Table structure for form_ids
-- ----------------------------
DROP TABLE IF EXISTS `form_ids`;
CREATE TABLE `form_ids` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) NOT NULL COMMENT '小程序openid',
  `formid` varchar(100) NOT NULL COMMENT '小程序提交表单时返回的formid',
  `expired_at` varchar(200) DEFAULT NULL COMMENT '过期时间时间',
  `is_used` smallint(2) DEFAULT '0' COMMENT '是否被使用过',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(128) DEFAULT NULL COMMENT '标题',
  `sub_title` varchar(128) DEFAULT NULL COMMENT '副标题',
  `thumbnail` varchar(128) DEFAULT NULL COMMENT '缩略图',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '价格',
  `express_fee` decimal(10,2) DEFAULT '0.00' COMMENT '运费',
  `quantity` int(10) DEFAULT '0' COMMENT '数量',
  `content` text COMMENT '详情图片，多张图片逗号相连',
  `sort` int(10) DEFAULT '0' COMMENT '排序',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '标题',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除',
  `status` smallint(2) DEFAULT '0' COMMENT '1上架；0下架',
  `type` smallint(6) NOT NULL COMMENT '类型',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 MIN_ROWS=10000;

-- ----------------------------
-- Records of goods
-- ----------------------------
BEGIN;
INSERT INTO `goods` VALUES (1, '小米电脑显示器显示屏23.8英寸液晶拼接屏幕 可选34英寸2K曲面144Hz游戏电竞带鱼屏21:9 34英寸/144Hz/2K', '', 'FlYDzjpc67yrMMge4_JIfSdW_dIM', 2600.00, 0.00, 99, 'Fq_EZElHhkCJFLVJpGktdz_D1b3c,FqXlit0FxHmYTavYuS9UPEJoEpsm,FpNN0GucPr8StSnJgu2zusysa5ML,FrcJuUOtA9AWv10aSP0jHbCeVowA', 1, '1624469612848', '1624548096311', 0, 1, 12);
INSERT INTO `goods` VALUES (2, '香柚小镇 创意树叶沥水肥皂盒浴室免打孔吸盘香皂盒叶子肥皂架卫生间收纳置物架 绿色一个装', NULL, 'Fl0xR8FRTfrja42bGQoSdcjEKR9d', 40.00, 0.00, 100, NULL, 0, '1624469612848', NULL, 0, 1, 13);
INSERT INTO `goods` VALUES (3, '美的 Midea 捣蛋鬼系列空气炸锅 无油大容量家用智能电炸锅煎炸锅 3L MF-KZ30E206L', NULL, 'Fm1ZOBF4l6GvZYrR5Q-vYyxIqN7D', 80.00, 0.00, 0, 'Fm1ZOBF4l6GvZYrR5Q-vYyxIqN7D,Fm1ZOBF4l6GvZYrR5Q-vYyxIqN7D', 0, '1624469612848', NULL, 0, 1, 12);
INSERT INTO `goods` VALUES (4, '美的 Midea太空舱空气炸锅 无油大容量家用智能电炸锅煎炸锅3.0L MF-KZ30P206', NULL, 'FuQbkfFM0n0JmnhbbvVDVz3kSmen', 90.00, 0.00, 1, NULL, 0, '1624469612848', NULL, 0, 1, 12);
INSERT INTO `goods` VALUES (5, 'asdfasd', 'asdf', 'Fq_EZElHhkCJFLVJpGktdz_D1b3c', 1111.00, 112.00, 1001, 'FjInGQ7dBszQENPHZ4TUa9gRKvZY,FkU-NzVvr8cb61Wxm9sZHLJBHbEj', 0, '1624548501075', '1624548515986', 1, 0, 13);
COMMIT;

-- ----------------------------
-- Table structure for goods_type
-- ----------------------------
DROP TABLE IF EXISTS `goods_type`;
CREATE TABLE `goods_type` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '分类名称',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否；1是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COMMENT='商品类型';

-- ----------------------------
-- Records of goods_type
-- ----------------------------
BEGIN;
INSERT INTO `goods_type` VALUES (12, '数码', '1574502120076', '1574502120076', 0);
INSERT INTO `goods_type` VALUES (13, '服饰', '1574502120076', '1624469301431', 0);
COMMIT;

-- ----------------------------
-- Table structure for growth_levels
-- ----------------------------
DROP TABLE IF EXISTS `growth_levels`;
CREATE TABLE `growth_levels` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `level` smallint(2) DEFAULT NULL COMMENT '等级；1普通会员；2合伙人白银；3合伙人砖石；4合伙人至尊；5合伙人荣耀',
  `name` varchar(255) NOT NULL DEFAULT '',
  `task_count` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '所需完成任务数',
  `invite_count` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '所需邀请人数',
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT '',
  `show_in_progress` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '是否显示在等级进度条上',
  `award_ratio` smallint(2) DEFAULT '0' COMMENT '一级任务奖励百分比',
  `award_ratio_two` smallint(2) DEFAULT '0' COMMENT '二级任务奖励百分比',
  `task_limit` smallint(6) DEFAULT '-1' COMMENT '可领取的任务数量，设为负数则不限制',
  `money_monthly` decimal(10,2) DEFAULT '0.00' COMMENT '每月发放金额',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10005 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of growth_levels
-- ----------------------------
BEGIN;
INSERT INTO `growth_levels` VALUES (10000, 1, '普通', 0, 0, '普通用户', 'https://img.xigu.pro/FsNJD14EdK2OGEBeE2e2O01eiyVj', 0, 5, 1, 10, 0.00);
INSERT INTO `growth_levels` VALUES (10001, 2, '白银', 88, 88, '合伙人白银级', 'https://img.xigu.pro/FsNJD14EdK2OGEBeE2e2O01eiyVj', 1, 10, 2, -1, 5.00);
INSERT INTO `growth_levels` VALUES (10002, 3, '钻石', 264, 264, '合伙人钻石级', 'https://img.xigu.pro/FsNJD14EdK2OGEBeE2e2O01eiyVj', 1, 12, 3, -1, 20.00);
INSERT INTO `growth_levels` VALUES (10003, 4, '至尊', 580, 580, '合伙人至尊级', 'https://img.xigu.pro/FsNJD14EdK2OGEBeE2e2O01eiyVj', 1, 15, 4, -1, 60.00);
INSERT INTO `growth_levels` VALUES (10004, 5, '荣耀', 2048, 2048, '合伙人荣耀级', 'https://img.xigu.pro/FsNJD14EdK2OGEBeE2e2O01eiyVj', 0, 18, 5, -1, 100.00);
COMMIT;

-- ----------------------------
-- Table structure for help_articles
-- ----------------------------
DROP TABLE IF EXISTS `help_articles`;
CREATE TABLE `help_articles` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `type` smallint(2) NOT NULL COMMENT '分类ID',
  `title` varchar(1024) DEFAULT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `useful_count` int(8) DEFAULT '0' COMMENT '有用数',
  `useless_count` int(8) DEFAULT '0' COMMENT '没用数',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '标题',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='帮助中心文章';

-- ----------------------------
-- Records of help_articles
-- ----------------------------
BEGIN;
INSERT INTO `help_articles` VALUES (1, 1, '积分的作用', '<p>积分可在发布任务时抵扣发布费用。</p><p><img src=\"https://img.xigu.pro/FgNQRiK7U3RrbnvMHSrSRl0dSEiy\" style=\"max-width:100%;\"><br></p>', 0, 0, 0, '1608879800610', '1608887241291');
COMMIT;

-- ----------------------------
-- Table structure for help_type
-- ----------------------------
DROP TABLE IF EXISTS `help_type`;
CREATE TABLE `help_type` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL COMMENT '类型',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否；1是',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COMMENT='帮助中心分类';

-- ----------------------------
-- Records of help_type
-- ----------------------------
BEGIN;
INSERT INTO `help_type` VALUES (1, '积分相关', 0, '1608878410000', '1608882705593');
INSERT INTO `help_type` VALUES (2, '会员相关', 0, '1608878410000', NULL);
INSERT INTO `help_type` VALUES (3, '账号相关', 0, '1608878410000', NULL);
INSERT INTO `help_type` VALUES (4, '任务相关', 0, '1608878410000', NULL);
INSERT INTO `help_type` VALUES (5, '提现相关', 0, '1608878410000', NULL);
INSERT INTO `help_type` VALUES (8, '新手指南', 0, '1609046311744', NULL);
INSERT INTO `help_type` VALUES (9, '热门问题', 0, '1609046316615', NULL);
COMMIT;

-- ----------------------------
-- Table structure for huifubao_orders
-- ----------------------------
DROP TABLE IF EXISTS `huifubao_orders`;
CREATE TABLE `huifubao_orders` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `result` varchar(10) DEFAULT NULL COMMENT '支付结果，1=成功 其它为未知',
  `pay_message` varchar(512) DEFAULT NULL COMMENT '支付结果信息，支付成功时为空',
  `agent_id` varchar(32) DEFAULT NULL COMMENT '商户编号，（汇付宝商户内码：七位整数数字）',
  `jnet_bill_no` varchar(32) DEFAULT NULL COMMENT '汇付宝交易号(订单号)',
  `agent_bill_id` varchar(64) DEFAULT NULL COMMENT '商户系统内部的订单号',
  `pay_type` varchar(10) DEFAULT NULL COMMENT '支付类型',
  `pay_amt` decimal(16,2) DEFAULT NULL COMMENT '订单实际支付金额(注意：此金额是用户的实付金额)',
  `remark` varchar(512) DEFAULT NULL COMMENT '商户自定义，原样返回。请求接口传入的值',
  `pay_user` varchar(32) DEFAULT NULL COMMENT '支付人信息。不返回值说明此支付类型不支持',
  `trade_bill_no` varchar(32) DEFAULT NULL COMMENT '上游通道支付单号',
  `sign` varchar(64) DEFAULT NULL COMMENT 'MD5\\RSA\\RSA2签名结果',
  `created_at` varchar(16) DEFAULT NULL COMMENT '记录创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for invitation_award
-- ----------------------------
DROP TABLE IF EXISTS `invitation_award`;
CREATE TABLE `invitation_award` (
  `id` int(8) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `task_id` int(8) DEFAULT NULL COMMENT '任务ID',
  `award` decimal(10,2) DEFAULT '0.00' COMMENT '奖金额',
  `user_id` int(8) DEFAULT NULL COMMENT '用户ID',
  `inviter` int(8) DEFAULT NULL COMMENT '邀请者ID',
  `type` smallint(2) DEFAULT '1' COMMENT '1.任务奖励；2.开通/续费会员奖励',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='任务奖励，被邀请者完成了任务则会生成记录';

-- ----------------------------
-- Records of invitation_award
-- ----------------------------
BEGIN;
INSERT INTO `invitation_award` VALUES (1, 73, 0.15, 10014, 10013, 1, '1624775619637');
INSERT INTO `invitation_award` VALUES (2, 73, 0.03, 10013, NULL, 1, '1624775619637');
INSERT INTO `invitation_award` VALUES (3, 73, 0.15, 10014, 10013, 1, '1624776248699');
INSERT INTO `invitation_award` VALUES (4, 73, 0.00, 10013, NULL, 1, '1624776248699');
COMMIT;

-- ----------------------------
-- Table structure for juxiangwan_orders
-- ----------------------------
DROP TABLE IF EXISTS `juxiangwan_orders`;
CREATE TABLE `juxiangwan_orders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `prize_id` int(10) DEFAULT NULL COMMENT '奖励流水标识，唯一',
  `mid` int(10) DEFAULT NULL COMMENT '渠道标识，聚享玩提供',
  `resource_id` varchar(64) DEFAULT NULL COMMENT '渠道用户标识',
  `time` int(10) DEFAULT NULL COMMENT '10 位时间戳\n\n',
  `prize_info` varchar(1024) DEFAULT NULL COMMENT '用户领奖信息（json_encode 后的字符串，数组格式）',
  `adid` int(10) DEFAULT NULL COMMENT '广告 id（奖励为活动时，此字段为特定值 0）',
  `device_code` varchar(64) DEFAULT NULL COMMENT '玩家设备码（安卓 imei,ios idfa）',
  `field` int(10) DEFAULT NULL COMMENT '（1 棋牌 2 金融 3 微任务 4H5 5 手游 6 棋牌 2 7 手游 2；奖励为活动时，此字段为固定值 0）',
  `icon` varchar(512) DEFAULT NULL COMMENT '游戏 icon（需用 url 解码）',
  `sign` varchar(128) DEFAULT NULL COMMENT '验签，md5(prize_info+mid+time+resource_id+token)     (prize_info 里数据为 unicode 编码格式)',
  `task_prize` float(10,2) DEFAULT NULL COMMENT '用户领取金额（单位元）',
  `deal_prize` float(10,2) DEFAULT NULL COMMENT '渠道利润（单位元）',
  `task_id` int(10) DEFAULT NULL COMMENT '奖励任务任务 id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of juxiangwan_orders
-- ----------------------------
BEGIN;
INSERT INTO `juxiangwan_orders` VALUES (1, 22180865, 1212, '10000', 1601261272, '[{\"name\":\"u6f2bu6597u7eaau51434u671f-501wan\",\"type\":1,\"prize_id\":22180865,\"prize_time\":1601261265,\"task_id\":174989,\"title\":\"u7b49u7ea7u8fbeu523030u7ea7\r\",\"ad_id\":16221,\"game_id\":16044,\"task_prize\":0.4,\"task_prize_coin\":0.4,\"deal_prize\":\"0.4\"}]', 16221, '865704038727781', 4, 'http%3A%2F%2Ft.juxiangwan.com%2Fupload%2Fadmin%2F20200826%2F6ad819e8dd8cdfad09bac7a7114eba36.jpg', '0142d3d1595d74fef5f2b729e15d00d7', 0.40, 0.40, 174989);
COMMIT;

-- ----------------------------
-- Table structure for login_ips
-- ----------------------------
DROP TABLE IF EXISTS `login_ips`;
CREATE TABLE `login_ips` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) DEFAULT NULL COMMENT '用户ID',
  `ip` varchar(32) DEFAULT NULL COMMENT '登录IP',
  `country` varchar(128) DEFAULT NULL COMMENT '国家',
  `region` varchar(128) DEFAULT NULL COMMENT '省份',
  `city` varchar(128) DEFAULT NULL COMMENT '城市名称',
  `lat` varchar(14) DEFAULT NULL,
  `lon` varchar(14) DEFAULT NULL,
  `org` varchar(128) DEFAULT NULL COMMENT '运营商',
  `login_type` smallint(2) DEFAULT '1' COMMENT '登录方式。1微信；2账号密码；3短信；4苹果',
  `login_client` smallint(2) DEFAULT '1' COMMENT '登录客户端。发布来源。1后台管理；2.微信小程序；3.H5；4.安卓；5.iOS',
  `login_at` varchar(14) DEFAULT NULL COMMENT '登录时间',
  `device` varchar(512) DEFAULT NULL COMMENT '设备信息',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of login_ips
-- ----------------------------
BEGIN;
INSERT INTO `login_ips` VALUES (1, 10013, '192.168.3.72', NULL, NULL, NULL, NULL, NULL, NULL, 2, 3, '1623517632431', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.6(0x18000633) NetType/WIFI Language/zh_CN');
COMMIT;

-- ----------------------------
-- Table structure for logs
-- ----------------------------
DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `user` varchar(64) DEFAULT NULL COMMENT '用户唯一标识，可能是id，username',
  `client` smallint(2) DEFAULT '1' COMMENT '操作日志来源。1后台管理；2.微信小程序；3.H5；4.安卓；5.iOS',
  `ip` varchar(32) DEFAULT NULL COMMENT '操作ip',
  `content` text COMMENT '内容',
  `created_at` varchar(14) DEFAULT NULL COMMENT '登录时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COMMENT='操作日志';

-- ----------------------------
-- Records of logs
-- ----------------------------
BEGIN;
INSERT INTO `logs` VALUES (82, 'admin', 1, NULL, '更新了ID为1的帮助文章', '1608887241297');
INSERT INTO `logs` VALUES (83, 'admin', 1, NULL, '管理员admin登录了后台管理', '1609037724813');
INSERT INTO `logs` VALUES (84, 'admin', 1, NULL, '通过了用户ID为10013的认证申请', '1609041794353');
INSERT INTO `logs` VALUES (85, 'admin', 1, NULL, '修改了ID为10013的用户信息', '1609042364878');
INSERT INTO `logs` VALUES (86, 'admin', 1, NULL, '添加了ID为8的帮助文章分类', '1609046311750');
INSERT INTO `logs` VALUES (87, 'admin', 1, NULL, '添加了ID为9的帮助文章分类', '1609046316622');
INSERT INTO `logs` VALUES (88, 'admin', 1, NULL, '添加了ID为72的公告', '1609070714250');
INSERT INTO `logs` VALUES (89, 'admin', 1, NULL, '修改了系统设置', '1609072187380');
INSERT INTO `logs` VALUES (90, 'admin', 1, NULL, '修改了系统设置', '1609072198195');
INSERT INTO `logs` VALUES (91, 'admin', 1, NULL, '管理员admin登录了后台管理', '1609309798242');
INSERT INTO `logs` VALUES (92, 'admin', 1, NULL, '修改了系统设置', '1609309803113');
INSERT INTO `logs` VALUES (93, 'admin', 1, NULL, '修改了系统设置', '1609309825469');
INSERT INTO `logs` VALUES (94, 'admin', 1, '::1', '更新了ID为4的菜单', '1609324075170');
INSERT INTO `logs` VALUES (95, 'admin', 1, '::1', '管理员admin登录了后台管理', '1609831284746');
INSERT INTO `logs` VALUES (96, 'admin', 1, '::1', '编辑了ID为73的任务', '1609831302214');
INSERT INTO `logs` VALUES (97, 'admin', 1, '::1', '编辑了ID为73的任务', '1609832698925');
INSERT INTO `logs` VALUES (98, 'admin', 1, '::1', '添加了ID为3的管理员', '1609832773835');
INSERT INTO `logs` VALUES (99, 'admin', 1, '::1', '管理员admin登录了后台管理', '1609839935933');
INSERT INTO `logs` VALUES (100, 'admin', 1, '::1', '管理员admin登录了后台管理', '1609840055841');
INSERT INTO `logs` VALUES (101, 'admin', 1, '::1', '管理员admin登录了后台管理', '1615215410326');
INSERT INTO `logs` VALUES (102, 'admin', 1, '::1', '管理员admin登录了后台管理', '1619243058157');
INSERT INTO `logs` VALUES (103, 'admin', 1, '::1', '修改了系统设置', '1619243065101');
INSERT INTO `logs` VALUES (104, 'admin', 1, '::1', '管理员admin登录了后台管理', '1619837795276');
INSERT INTO `logs` VALUES (105, 'admin', 1, '::1', '添加了ID为10的福利', '1619837830074');
INSERT INTO `logs` VALUES (106, 'admin', 1, '::1', '更新了ID为10的福利', '1619837872046');
INSERT INTO `logs` VALUES (107, 'admin', 1, '::1', '删除了ID为10的福利', '1619837966319');
INSERT INTO `logs` VALUES (108, 'admin', 1, '::1', '添加了ID为11的福利', '1619837983293');
INSERT INTO `logs` VALUES (109, 'admin', 1, '::1', '管理员admin登录了后台管理', '1620754615713');
INSERT INTO `logs` VALUES (110, 'admin', 1, '::1', '编辑了ID为119的任务', '1620754839637');
INSERT INTO `logs` VALUES (111, 'admin', 1, '::1', '管理员admin登录了后台管理', '1623857659410');
INSERT INTO `logs` VALUES (112, 'admin', 1, '::1', '添加了ID为18的菜单', '1623857790673');
INSERT INTO `logs` VALUES (113, 'admin', 1, '::1', '管理员admin登录了后台管理', '1624037282659');
INSERT INTO `logs` VALUES (114, 'admin', 1, '::1', '更新了ID为18的菜单', '1624037294322');
INSERT INTO `logs` VALUES (115, 'admin', 1, '::1', '管理员admin登录了后台管理', '1624423825940');
INSERT INTO `logs` VALUES (116, 'admin', 1, '::1', '上架了ID为78的任务', '1624466161598');
INSERT INTO `logs` VALUES (117, 'admin', 1, '::1', '下架了ID为78的任务', '1624466163950');
INSERT INTO `logs` VALUES (118, 'admin', 1, '::1', '添加了ID为14的商品分类', '1624469287427');
INSERT INTO `logs` VALUES (119, 'admin', 1, '::1', '删除了ID为14的商品分类', '1624469290108');
INSERT INTO `logs` VALUES (120, 'admin', 1, '::1', '更新了ID为13的商品分类', '1624469295812');
INSERT INTO `logs` VALUES (121, 'admin', 1, '::1', '更新了ID为13的商品分类', '1624469301439');
INSERT INTO `logs` VALUES (122, 'admin', 1, '::1', '管理员admin登录了后台管理', '1624547308306');
INSERT INTO `logs` VALUES (123, 'admin', 1, '::1', '更新了ID为1的商品', '1624547421377');
INSERT INTO `logs` VALUES (124, 'admin', 1, '::1', '更新了ID为1的商品', '1624547654333');
INSERT INTO `logs` VALUES (125, 'admin', 1, '::1', '更新了ID为1的商品', '1624547929605');
INSERT INTO `logs` VALUES (126, 'admin', 1, '::1', '更新了ID为1的商品', '1624547947218');
INSERT INTO `logs` VALUES (127, 'admin', 1, '::1', '更新了ID为1的商品', '1624548005775');
INSERT INTO `logs` VALUES (128, 'admin', 1, '::1', '更新了ID为1的商品', '1624548021750');
INSERT INTO `logs` VALUES (129, 'admin', 1, '::1', '更新了ID为1的商品', '1624548031417');
INSERT INTO `logs` VALUES (130, 'admin', 1, '::1', '更新了ID为1的商品', '1624548041263');
INSERT INTO `logs` VALUES (131, 'admin', 1, '::1', '更新了ID为1的商品', '1624548079827');
INSERT INTO `logs` VALUES (132, 'admin', 1, '::1', '更新了ID为1的商品', '1624548090228');
INSERT INTO `logs` VALUES (133, 'admin', 1, '::1', '更新了ID为1的商品', '1624548096319');
INSERT INTO `logs` VALUES (134, 'admin', 1, '::1', '添加了ID为5的商品', '1624548501109');
INSERT INTO `logs` VALUES (135, 'admin', 1, '::1', '发货了ID为4的订单', '1624550778419');
INSERT INTO `logs` VALUES (136, 'admin', 1, '::1', '发货了ID为4的订单', '1624550802175');
INSERT INTO `logs` VALUES (137, 'admin', 1, '::1', '取消了ID为1的订单', '1624551246629');
INSERT INTO `logs` VALUES (138, 'admin', 1, '::1', '管理员admin登录了后台管理', '1624687320662');
INSERT INTO `logs` VALUES (139, 'admin', 1, '::1', '更新了ID为10001的用户等级', '1624691518981');
INSERT INTO `logs` VALUES (140, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1624691528988');
INSERT INTO `logs` VALUES (141, 'admin', 1, '::1', '更新了ID为10000的普通用户等级', '1624691678433');
INSERT INTO `logs` VALUES (142, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1624724035926');
INSERT INTO `logs` VALUES (143, 'admin', 1, '::1', '更新了ID为10002的钻石用户等级', '1624724045439');
INSERT INTO `logs` VALUES (144, 'admin', 1, '::1', '更新了ID为10003的至尊用户等级', '1624724049596');
INSERT INTO `logs` VALUES (145, 'admin', 1, '::1', '更新了ID为10003的至尊用户等级', '1624724055730');
INSERT INTO `logs` VALUES (146, 'admin', 1, '::1', '更新了ID为10004的荣耀用户等级', '1624724060065');
INSERT INTO `logs` VALUES (147, 'admin', 1, '::1', '更新了ID为10000的普通用户等级', '1624725487615');
INSERT INTO `logs` VALUES (148, 'admin', 1, '::1', '更新了ID为10000的普通用户等级', '1624725558012');
INSERT INTO `logs` VALUES (149, 'admin', 1, '::1', '更新了ID为10000的普通用户等级', '1624725726300');
INSERT INTO `logs` VALUES (150, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1624725739481');
INSERT INTO `logs` VALUES (151, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1624725787620');
INSERT INTO `logs` VALUES (152, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1624725798212');
INSERT INTO `logs` VALUES (153, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1624725802575');
INSERT INTO `logs` VALUES (154, 'admin', 1, '::1', '更新了ID为10002的钻石用户等级', '1624725807775');
INSERT INTO `logs` VALUES (155, 'admin', 1, '::1', '更新了ID为10003的至尊用户等级', '1624725813100');
INSERT INTO `logs` VALUES (156, 'admin', 1, '::1', '更新了ID为10004的荣耀用户等级', '1624725820566');
INSERT INTO `logs` VALUES (157, 'admin', 1, '::1', '更新了ID为10004的荣耀用户等级', '1624725824724');
INSERT INTO `logs` VALUES (158, 'admin', 1, '::1', '更新了ID为10000的普通用户等级', '1624768331483');
INSERT INTO `logs` VALUES (159, 'admin', 1, '::1', '管理员admin登录了后台管理', '1624775331466');
INSERT INTO `logs` VALUES (160, 'admin', 1, '::1', '通过了ID为2的审核，任务ID为73', '1624775619694');
INSERT INTO `logs` VALUES (161, 'admin', 1, '::1', '通过了ID为3的审核，任务ID为73', '1624776248790');
INSERT INTO `logs` VALUES (162, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1624779233327');
INSERT INTO `logs` VALUES (163, 'admin', 1, '::1', '通过了ID为4的审核，任务ID为73', '1624779267838');
INSERT INTO `logs` VALUES (164, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1624779385404');
INSERT INTO `logs` VALUES (165, 'admin', 1, '::1', '管理员admin登录了后台管理', '1624990291724');
INSERT INTO `logs` VALUES (166, 'admin', 1, '::1', '添加了ID为19的菜单', '1624990308358');
INSERT INTO `logs` VALUES (167, 'admin', 1, '::1', '更新了ID为4的菜单', '1624990444342');
INSERT INTO `logs` VALUES (168, 'admin', 1, '::1', '更新了ID为5的菜单', '1624990453329');
INSERT INTO `logs` VALUES (169, 'admin', 1, '::1', '更新了ID为5的菜单', '1624990461274');
INSERT INTO `logs` VALUES (170, 'admin', 1, '::1', '更新了ID为7的菜单', '1624990475411');
INSERT INTO `logs` VALUES (171, 'admin', 1, '::1', '更新了ID为6的菜单', '1624990483975');
INSERT INTO `logs` VALUES (172, 'admin', 1, '::1', '更新了ID为11的菜单', '1624990494091');
INSERT INTO `logs` VALUES (173, 'admin', 1, '::1', '更新了ID为12的菜单', '1624990504153');
INSERT INTO `logs` VALUES (174, 'admin', 1, '::1', '更新了ID为15的菜单', '1624990514422');
INSERT INTO `logs` VALUES (175, 'admin', 1, '::1', '更新了ID为17的菜单', '1624990529353');
INSERT INTO `logs` VALUES (176, 'admin', 1, '::1', '管理员admin登录了后台管理', '1625114624496');
INSERT INTO `logs` VALUES (177, 'admin', 1, '::1', '通过了ID为17的提现申请', '1625114631704');
INSERT INTO `logs` VALUES (178, 'admin', 1, '::1', '通过了ID为18的提现申请', '1625115186160');
INSERT INTO `logs` VALUES (179, 'admin', 1, '::1', '通过了ID为19的提现申请', '1625157113713');
INSERT INTO `logs` VALUES (180, 'admin', 1, '::1', '通过了ID为20的提现申请', '1625157564275');
INSERT INTO `logs` VALUES (181, 'admin', 1, '::1', '通过了ID为21的提现申请', '1625157575970');
INSERT INTO `logs` VALUES (182, 'admin', 1, '::1', '管理员admin登录了后台管理', '1625497512646');
INSERT INTO `logs` VALUES (183, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1625497767870');
INSERT INTO `logs` VALUES (184, 'admin', 1, '::1', '更新了ID为10004的荣耀用户等级', '1625497817083');
INSERT INTO `logs` VALUES (185, 'admin', 1, '::1', '更新了ID为10003的至尊用户等级', '1625497824530');
INSERT INTO `logs` VALUES (186, 'admin', 1, '::1', '更新了ID为10002的钻石用户等级', '1625497830978');
INSERT INTO `logs` VALUES (187, 'admin', 1, '::1', '更新了ID为10001的白银用户等级', '1625497835482');
INSERT INTO `logs` VALUES (188, 'admin', 1, '::1', '管理员admin登录了后台管理', '1625926467005');
INSERT INTO `logs` VALUES (189, 'admin', 1, '::1', '管理员admin登录了后台管理', '1628695083331');
INSERT INTO `logs` VALUES (190, 'admin', 1, '::1', '管理员admin登录了后台管理', '1633441414787');
INSERT INTO `logs` VALUES (191, 'admin', 1, '::1', '修改了ID为10031的用户信息', '1633441873081');
INSERT INTO `logs` VALUES (192, 'admin', 1, '::1', '修改了ID为10031的用户信息', '1633441892560');
INSERT INTO `logs` VALUES (193, 'admin', 1, '::1', '修改了ID为10031的用户信息', '1633441958324');
INSERT INTO `logs` VALUES (194, 'admin', 1, '::1', '修改了ID为10031的用户信息', '1633441966851');
INSERT INTO `logs` VALUES (195, 'admin', 1, '::1', '修改了系统设置', '1670643088499');
INSERT INTO `logs` VALUES (196, 'admin', 1, '::1', '修改了系统设置', '1670643098001');
INSERT INTO `logs` VALUES (197, 'admin', 1, '::1', '上架了ID为74的任务', '1670668752777');
INSERT INTO `logs` VALUES (198, 'admin', 1, '::1', '上架了ID为74的任务', '1670668788879');
INSERT INTO `logs` VALUES (199, 'admin', 1, '::1', '上架了ID为74的任务', '1670669219879');
INSERT INTO `logs` VALUES (200, 'admin', 1, '::1', '修改了系统设置', '1670671932396');
INSERT INTO `logs` VALUES (201, 'admin', 1, '::1', '修改了系统设置', '1670671948064');
INSERT INTO `logs` VALUES (202, 'admin', 1, '::1', '上架了ID为75的任务', '1670672072850');
INSERT INTO `logs` VALUES (203, 'admin', 1, '::1', '上架了ID为75的任务', '1670672108271');
INSERT INTO `logs` VALUES (204, 'admin', 1, '::1', '编辑了ID为75的任务', '1670675431107');
COMMIT;

-- ----------------------------
-- Table structure for lucky_draw
-- ----------------------------
DROP TABLE IF EXISTS `lucky_draw`;
CREATE TABLE `lucky_draw` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL COMMENT '名称',
  `value` int(8) DEFAULT NULL COMMENT '奖励额，负数为减，正数为加',
  `created_at` varchar(13) DEFAULT '' COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT '' COMMENT '更新时间',
  `sort` int(8) DEFAULT NULL COMMENT '排序字段',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='转盘奖励列表';

-- ----------------------------
-- Records of lucky_draw
-- ----------------------------
BEGIN;
INSERT INTO `lucky_draw` VALUES (1, '+12积分', 12, '', '', NULL);
INSERT INTO `lucky_draw` VALUES (2, '谢谢参与', 0, '', '', NULL);
INSERT INTO `lucky_draw` VALUES (3, '+10积分', 10, '', '', NULL);
INSERT INTO `lucky_draw` VALUES (4, '-10积分', -10, '', '', NULL);
INSERT INTO `lucky_draw` VALUES (5, '+5积分', 5, '', '', NULL);
INSERT INTO `lucky_draw` VALUES (6, '-5积分', -5, '', '', NULL);
INSERT INTO `lucky_draw` VALUES (7, '1积分', 1, '', '', NULL);
INSERT INTO `lucky_draw` VALUES (8, '-1积分', -1, '', '', NULL);
COMMIT;

-- ----------------------------
-- Table structure for messages
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `type` smallint(2) DEFAULT NULL COMMENT '1.消息;2.任务详情;3.审核详情(雇主);4.审核详情(领主);5.提现详情;6.开通会员;7.公告;8动态',
  `user_id` int(8) DEFAULT NULL COMMENT '所属用户ID，如果是所有用户则为0，如果是后台管理则为1',
  `business_id` varchar(255) DEFAULT NULL COMMENT '涉及到的id，json',
  `title` varchar(1024) DEFAULT NULL,
  `content` text COMMENT '内容',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '标题',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of messages
-- ----------------------------
BEGIN;
INSERT INTO `messages` VALUES (71, 1, 1, '{\"certification_id\":6}', '用户申请认证', 'ID为10013的用户提交了认证资料给你审核，认证ID为6', 0, '1609047164427', NULL);
INSERT INTO `messages` VALUES (72, 7, NULL, NULL, '加入会员限时价99元，永久享受多项权益', '加入会员限时价99元，永久享受多项权益，赶紧去开通吧!', 0, '1609070714226', NULL);
INSERT INTO `messages` VALUES (73, 2, 10013, '{\"task_id\":\"75\"}', '互暖上架', '你发布的互暖已经发布上架，赶紧去推广吧', 0, '1615112749103', NULL);
INSERT INTO `messages` VALUES (74, 2, 10013, '{\"task_id\":\"74\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1619238689369', NULL);
INSERT INTO `messages` VALUES (75, 2, 10013, '{\"task_id\":\"76\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1619238695962', NULL);
INSERT INTO `messages` VALUES (76, 2, 10013, '{\"task_id\":\"89\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1619238705141', NULL);
INSERT INTO `messages` VALUES (77, 2, 10013, '{\"task_id\":\"90\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1619238711612', NULL);
INSERT INTO `messages` VALUES (78, 2, 10013, '{\"task_id\":\"115\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1619238719224', NULL);
INSERT INTO `messages` VALUES (79, 2, 10013, '{\"task_id\":\"116\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1619238721083', NULL);
INSERT INTO `messages` VALUES (80, 2, 10013, '{\"task_id\":\"118\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1619238724579', NULL);
INSERT INTO `messages` VALUES (81, 2, 10013, '{\"task_id\":\"88\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1619238726243', NULL);
INSERT INTO `messages` VALUES (82, 1, 1, '119', '用户发布任务', '用户10029发布了任务“12324324224”, 总共花费了102元，抵用了0积分', 0, '1620754801640', NULL);
INSERT INTO `messages` VALUES (83, 2, 10013, '{\"task_id\":\"78\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1624466161595', NULL);
INSERT INTO `messages` VALUES (84, 2, 10013, '{\"task_id\":\"78\"}', '任务下架', '你发布的任务已经改为下架', 0, '1624466163947', NULL);
INSERT INTO `messages` VALUES (85, 3, 1, '{\"task_id\":\"73\",\"user_id\":\"10014\",\"review_id\":1}', '用户提交审核', 'ID为10014的用户提交了资料给你审核，审核ID为1', 0, '1624775303041', NULL);
INSERT INTO `messages` VALUES (86, 4, 10014, '{\"task_id\":73,\"user_task\":5,\"review_id\":1}', '任务审核通过', '你提交的任务审核符合要求，佣金已发放，再接再厉哦', 0, '1624775338957', NULL);
INSERT INTO `messages` VALUES (87, 3, 1, '{\"task_id\":\"73\",\"user_id\":\"10014\",\"review_id\":2}', '用户提交审核', 'ID为10014的用户提交了资料给你审核，审核ID为2', 0, '1624775609855', NULL);
INSERT INTO `messages` VALUES (88, 4, 10014, '{\"task_id\":73,\"user_task\":6,\"review_id\":2}', '任务审核通过', '你提交的任务审核符合要求，佣金已发放，再接再厉哦', 0, '1624775619622', NULL);
INSERT INTO `messages` VALUES (89, 3, 1, '{\"task_id\":\"73\",\"user_id\":\"10014\",\"review_id\":3}', '用户提交审核', 'ID为10014的用户提交了资料给你审核，审核ID为3', 0, '1624776148773', NULL);
INSERT INTO `messages` VALUES (90, 4, 10014, '{\"task_id\":73,\"user_task\":7,\"review_id\":3}', '任务审核通过', '你提交的任务审核符合要求，佣金已发放，再接再厉哦', 0, '1624776154164', NULL);
INSERT INTO `messages` VALUES (91, 4, 10014, '{\"task_id\":73,\"user_task\":7,\"review_id\":3}', '任务审核通过', '你提交的任务审核符合要求，佣金已发放，再接再厉哦', 0, '1624776248685', NULL);
INSERT INTO `messages` VALUES (92, 3, 1, '{\"task_id\":\"73\",\"user_id\":\"10013\",\"review_id\":4}', '用户提交审核', 'ID为10013的用户提交了资料给你审核，审核ID为4', 0, '1624779257170', NULL);
INSERT INTO `messages` VALUES (93, 4, 10013, '{\"task_id\":73,\"user_task\":8,\"review_id\":4}', '任务审核通过', '你提交的任务审核符合要求，佣金已发放，再接再厉哦', 0, '1624779267763', NULL);
INSERT INTO `messages` VALUES (94, 1, 1, '17', '用户提现', '用户10013申请提现11元', 0, '1625114602020', NULL);
INSERT INTO `messages` VALUES (95, 5, 10013, '{\"withdraw_id\":\"17\"}', '提现申请通过', '你提交的提现申请已经审核通过，已打款，请注意查收', 0, '1625114631701', NULL);
INSERT INTO `messages` VALUES (96, 1, 1, '18', '用户提现', '用户10013申请提现11元', 0, '1625115175114', NULL);
INSERT INTO `messages` VALUES (97, 8, 0, '', '用户西谷科技成功提现11元', '', 0, '1625115186156', NULL);
INSERT INTO `messages` VALUES (98, 5, 10013, '{\"withdraw_id\":\"18\"}', '提现申请通过', '你提交的提现申请已经审核通过，已打款，请注意查收', 0, '1625115186158', NULL);
INSERT INTO `messages` VALUES (99, 1, 1, '19', '用户提现', '用户10013申请提现10元', 0, '1625157107636', NULL);
INSERT INTO `messages` VALUES (100, 8, 0, '', '用户西谷科技成功提现10元', '', 0, '1625157113691', NULL);
INSERT INTO `messages` VALUES (101, 5, 10013, '{\"withdraw_id\":\"19\"}', '提现申请通过', '你提交的提现申请已经审核通过，已打款，请注意查收', 0, '1625157113701', NULL);
INSERT INTO `messages` VALUES (102, 1, 1, '20', '用户提现', '用户10013申请提现12元', 0, '1625157556093', NULL);
INSERT INTO `messages` VALUES (103, 8, 0, '', '用户西谷科技成功提现12元', '', 0, '1625157564255', NULL);
INSERT INTO `messages` VALUES (104, 5, 10013, '{\"withdraw_id\":\"20\"}', '提现申请通过', '你提交的提现申请已经审核通过，已打款，请注意查收', 0, '1625157564264', NULL);
INSERT INTO `messages` VALUES (105, 1, 1, '21', '用户提现', '用户10013申请提现14元', 0, '1625157570117', NULL);
INSERT INTO `messages` VALUES (106, 8, 0, '', '用户西谷科技成功提现14元', '', 0, '1625157575932', NULL);
INSERT INTO `messages` VALUES (107, 5, 10013, '{\"withdraw_id\":\"21\"}', '提现申请通过', '你提交的提现申请已经审核通过，已打款，请注意查收', 0, '1625157575945', NULL);
INSERT INTO `messages` VALUES (108, 8, 0, '', '恭喜yarn🤡成功兑换', '', 0, '1631895150341', NULL);
INSERT INTO `messages` VALUES (109, 1, 1, '120', '用户发布任务', '用户10031发布了任务“1”, 总共花费了1.02元，抵用了0积分', 0, '1632804975781', NULL);
INSERT INTO `messages` VALUES (110, 2, 10013, '{\"task_id\":\"74\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1670668752773', NULL);
INSERT INTO `messages` VALUES (111, 2, 10013, '{\"task_id\":\"74\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1670668788877', NULL);
INSERT INTO `messages` VALUES (112, 2, 10013, '{\"task_id\":\"74\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1670669219877', NULL);
INSERT INTO `messages` VALUES (113, 2, 10013, '{\"task_id\":\"75\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1670672072844', NULL);
INSERT INTO `messages` VALUES (114, 2, 10013, '{\"task_id\":\"75\"}', '任务上架', '你发布的任务已经发布上架，赶紧去推广吧', 0, '1670672108269', NULL);
COMMIT;

-- ----------------------------
-- Table structure for messages_state
-- ----------------------------
DROP TABLE IF EXISTS `messages_state`;
CREATE TABLE `messages_state` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `message_id` int(8) DEFAULT NULL COMMENT '消息ID',
  `is_read` smallint(2) DEFAULT '0' COMMENT '是否已读',
  `user_id` int(8) DEFAULT NULL COMMENT '读者ID',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for money_stream
-- ----------------------------
DROP TABLE IF EXISTS `money_stream`;
CREATE TABLE `money_stream` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `type` smallint(2) DEFAULT NULL COMMENT '1充值;2提现;3收入;4支出;',
  `money` decimal(13,2) DEFAULT NULL COMMENT '金额',
  `balance` decimal(13,2) DEFAULT NULL COMMENT '此条记录产生后的余额',
  `user_id` int(8) DEFAULT NULL COMMENT '用户ID',
  `is_income` smallint(2) DEFAULT NULL COMMENT '1收入；0支出',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of money_stream
-- ----------------------------
BEGIN;
INSERT INTO `money_stream` VALUES (49, 3, 1.00, 1.00, 10018, 1, '1609309838017', '新用户红包');
INSERT INTO `money_stream` VALUES (50, 3, 0.50, NULL, 10003, 1, '1609309838044', '福利中心结算');
INSERT INTO `money_stream` VALUES (51, 3, 1.00, 1.00, 10019, 1, '1609309861375', '新用户红包');
INSERT INTO `money_stream` VALUES (52, 3, 15.00, NULL, 10003, 1, '1609309861390', '福利中心结算');
INSERT INTO `money_stream` VALUES (53, 3, 1.00, 1.00, 10028, 1, '1609836475622', '新用户红包');
INSERT INTO `money_stream` VALUES (54, 4, 10.00, 1403.16, 10013, 0, '1615112762840', '互暖置顶');
INSERT INTO `money_stream` VALUES (55, 4, 10.00, 1393.16, 10013, 0, '1615113313085', '互暖置顶');
INSERT INTO `money_stream` VALUES (56, 1, 10.00, 14.00, 10015, 1, '1615113366772', '');
INSERT INTO `money_stream` VALUES (57, 1, 10.00, 1403.16, 10013, 1, '1615113388224', '');
INSERT INTO `money_stream` VALUES (58, 4, 102.00, 11111009.00, 10029, 0, '1620754801640', '发布任务119, 含服务费2元');
INSERT INTO `money_stream` VALUES (65, 4, 2600.00, -1196.84, 10013, 0, '1624384326067', '兑换商品');
INSERT INTO `money_stream` VALUES (66, 4, 2600.00, -3796.84, 10013, 0, '1624384455510', '兑换商品');
INSERT INTO `money_stream` VALUES (67, 4, 2600.00, 17400.00, 10013, 0, '1624384873945', '兑换商品');
INSERT INTO `money_stream` VALUES (68, 4, 2600.00, 14800.00, 10013, 0, '1624422334163', '兑换商品');
INSERT INTO `money_stream` VALUES (69, 4, 40.00, 14760.00, 10013, 0, '1624422349615', '兑换商品');
INSERT INTO `money_stream` VALUES (70, 3, 40.00, 14800.00, 10013, 1, '1624465049988', '取消商品兑换订单');
INSERT INTO `money_stream` VALUES (71, 3, 2600.00, 17400.00, 10013, 1, '1624465211489', '取消商品兑换订单');
INSERT INTO `money_stream` VALUES (72, 3, 10.00, NULL, 10012, 1, '1624551246603', '取消商品兑换订单');
INSERT INTO `money_stream` VALUES (77, 3, 3.00, 16.25, 10014, 1, '1624776154166', '发放任务ID为73的佣金');
INSERT INTO `money_stream` VALUES (78, 3, 3.00, 19.25, 10014, 1, '1624776248690', '发放任务ID为73的佣金');
INSERT INTO `money_stream` VALUES (79, 3, 0.15, 17400.30, 10013, 1, '1624776248699', '发放邀请奖励');
INSERT INTO `money_stream` VALUES (80, 3, 3.00, 17403.30, 10013, 1, '1624779267776', '发放任务ID为73的佣金');
INSERT INTO `money_stream` VALUES (81, 3, 1.00, 17404.30, 10013, 1, '1624779267812', '福利中心结算');
INSERT INTO `money_stream` VALUES (82, 2, 11.00, 17393.30, 10013, 0, '1625114631686', '支付宝');
INSERT INTO `money_stream` VALUES (83, 2, 11.00, 17382.30, 10013, 0, '1625115186139', '支付宝');
INSERT INTO `money_stream` VALUES (84, 2, 10.00, 17372.30, 10013, 0, '1625157113668', '支付宝');
INSERT INTO `money_stream` VALUES (85, 2, 12.00, 17360.30, 10013, 0, '1625157564220', '支付宝');
INSERT INTO `money_stream` VALUES (86, 2, 14.00, 17346.30, 10013, 0, '1625157575913', '支付宝');
INSERT INTO `money_stream` VALUES (87, 3, 5.00, 17351.30, 10013, 1, '1625499435037', '用户等级奖金');
INSERT INTO `money_stream` VALUES (88, 3, 5.00, 17356.30, 10013, 1, '1625499970055', '发放用户等级奖金');
INSERT INTO `money_stream` VALUES (89, 3, 5.00, 17361.30, 10013, 1, '1625500030048', '发放用户等级奖金');
INSERT INTO `money_stream` VALUES (90, 3, 1.00, 1.00, 10030, 1, '1629600172611', '新用户红包');
INSERT INTO `money_stream` VALUES (91, 3, 1.00, 1.00, 10031, 1, '1629601008787', '新用户红包');
INSERT INTO `money_stream` VALUES (92, 3, 2600.00, 2601.00, 10031, 1, '1631639718004', '取消商品兑换订单');
INSERT INTO `money_stream` VALUES (93, 4, 2600.00, 1.00, 10031, 0, '1631895150306', '兑换商品');
INSERT INTO `money_stream` VALUES (94, 4, 1.02, 12119.98, 10031, 0, '1632804975781', '发布任务120, 含服务费0.02元');
INSERT INTO `money_stream` VALUES (95, 4, 1.00, 18.25, 10014, 0, '1633410170247', '发出红包1，共1元');
INSERT INTO `money_stream` VALUES (96, 4, 1.00, 17.25, 10014, 0, '1633410652647', '发出ID为2的红包，共1元');
INSERT INTO `money_stream` VALUES (97, 3, 1.00, 17362.30, 10013, 0, '1633412689858', '领取ID为2的红包，共1元');
INSERT INTO `money_stream` VALUES (98, 4, 100.00, -82.75, 10014, 0, '1633412844437', '发出ID为3的红包，共100元');
INSERT INTO `money_stream` VALUES (99, 3, 100.00, 17462.30, 10013, 0, '1633412850436', '领取ID为3的红包，共100元');
INSERT INTO `money_stream` VALUES (100, 4, 1000000.00, -1000082.75, 10014, 0, '1633412882968', '发出ID为4的红包，共1000000元');
INSERT INTO `money_stream` VALUES (101, 3, 1000000.00, 1017462.30, 10013, 0, '1633412887161', '领取ID为4的红包，共1000000元');
INSERT INTO `money_stream` VALUES (102, 4, 1.00, 9999.00, 10014, 0, '1633413303485', '发出ID为5的红包，共1元');
INSERT INTO `money_stream` VALUES (103, 3, 1.00, 1017463.30, 10013, 0, '1633413306876', '领取ID为5的红包，共1元');
INSERT INTO `money_stream` VALUES (104, 4, 1.00, 9998.00, 10014, 0, '1633413325376', '发出ID为6的红包，共1元');
INSERT INTO `money_stream` VALUES (105, 3, 1.00, 1017464.30, 10013, 0, '1633413354014', '领取ID为6的红包，共1元');
INSERT INTO `money_stream` VALUES (106, 4, 1.00, 9997.00, 10014, 0, '1633413481181', '发出ID为7的红包，共1元');
INSERT INTO `money_stream` VALUES (107, 4, 1.00, 1017463.30, 10013, 0, '1633441001521', '发出ID为8的红包，共1元');
INSERT INTO `money_stream` VALUES (108, 3, 1.00, 9998.00, 10014, 0, '1633499939496', '领取ID为8的红包，共1元');
INSERT INTO `money_stream` VALUES (109, 3, 1.00, 1.00, 10032, 1, '1633532143409', '新用户红包');
INSERT INTO `money_stream` VALUES (110, 3, 0.50, 1017463.80, 10013, 1, '1633532143496', '福利中心结算');
INSERT INTO `money_stream` VALUES (111, 3, 10.00, 1017473.80, 10013, 1, '1633532143496', '福利中心结算');
INSERT INTO `money_stream` VALUES (112, 3, 1.00, 1.00, 10033, 1, '1670644530116', '新用户红包');
INSERT INTO `money_stream` VALUES (113, 4, 20.40, 1017453.40, 10013, 0, '1670668777238', '更新任务74补交，含补交服务费0.4元');
INSERT INTO `money_stream` VALUES (114, 4, 10.20, 1017443.20, 10013, 0, '1670672100303', '更新任务75补交，含补交服务费0.2元');
COMMIT;

-- ----------------------------
-- Table structure for my_goods
-- ----------------------------
DROP TABLE IF EXISTS `my_goods`;
CREATE TABLE `my_goods` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_no` varchar(64) DEFAULT NULL COMMENT '订单编号',
  `goods_id` int(10) NOT NULL COMMENT '商品id',
  `user_id` int(8) DEFAULT NULL COMMENT '用户ID',
  `express_no` varchar(64) DEFAULT NULL COMMENT '快递号',
  `status` smallint(2) DEFAULT NULL COMMENT '1待发货；2已发货；3已取消',
  `title` varchar(128) DEFAULT NULL COMMENT '标题',
  `sub_title` varchar(128) DEFAULT NULL COMMENT '副标题',
  `thumbnail` varchar(128) DEFAULT NULL COMMENT '缩略图',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '价格',
  `express_fee` decimal(10,2) DEFAULT '0.00' COMMENT '运费',
  `order_quantity` int(10) DEFAULT '1' COMMENT '兑换数量',
  `quantity` int(10) DEFAULT '0' COMMENT '商品剩余数量',
  `content` text COMMENT '详情图片，多张图片逗号相连',
  `type` smallint(6) NOT NULL COMMENT '商品类型',
  `name` varchar(128) DEFAULT NULL COMMENT '收件人',
  `tel` varchar(32) DEFAULT NULL COMMENT '收货人联系电话',
  `address` varchar(512) DEFAULT NULL COMMENT '收货人详细地址',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '标题',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='用户兑换的商品';

-- ----------------------------
-- Records of my_goods
-- ----------------------------
BEGIN;
INSERT INTO `my_goods` VALUES (1, 'shop20210619123456', 4, 10013, NULL, 1, '美的 Midea太空舱空气炸锅 无油大容量家用智能电炸锅煎炸锅3.0L MF-KZ30P206', NULL, 'FuQbkfFM0n0JmnhbbvVDVz3kSmen', 10.00, 0.00, 1, 0, 'Fm1ZOBF4l6GvZYrR5Q-vYyxIqN7D,Fm1ZOBF4l6GvZYrR5Q-vYyxIqN7D', 12, '汤唯', '13800138000', '万科云', '1609047164419', '1624551246603', 0);
INSERT INTO `my_goods` VALUES (4, 'shop20210623020113228415', 1, 10013, '34534534534535', 2, '小米电脑显示器显示屏23.8英寸液晶拼接屏幕 可选34英寸2K曲面144Hz游戏电竞带鱼屏21:9 34英寸/144Hz/2K', '', 'FlYDzjpc67yrMMge4_JIfSdW_dIM', 2600.00, 0.00, 1, 100, 'null', 12, '唐文雍', '15918575650', '天津市天津市万科云', '1624384873945', '1624550802169', 0);
INSERT INTO `my_goods` VALUES (5, 'shop20210623122534111293', 1, 10013, NULL, 3, '小米电脑显示器显示屏23.8英寸液晶拼接屏幕 可选34英寸2K曲面144Hz游戏电竞带鱼屏21:9 34英寸/144Hz/2K', '', 'FlYDzjpc67yrMMge4_JIfSdW_dIM', 2600.00, 0.00, 1, 99, 'null', 12, '唐文雍', '15918575650', '天津市天津市万科云', '1624422334163', '1631639718004', 0);
INSERT INTO `my_goods` VALUES (6, 'shop20210623122549277347', 2, 10013, NULL, 3, '香柚小镇 创意树叶沥水肥皂盒浴室免打孔吸盘香皂盒叶子肥皂架卫生间收纳置物架 绿色一个装', '', 'Fl0xR8FRTfrja42bGQoSdcjEKR9d', 40.00, 0.00, 2, 100, 'null', 13, '唐文雍', '15918575650', '天津市天津市万科云', '1624422349615', '1624465049988', 0);
INSERT INTO `my_goods` VALUES (7, 'shop20210918001230932325', 1, 10031, NULL, 1, '小米电脑显示器显示屏23.8英寸液晶拼接屏幕 可选34英寸2K曲面144Hz游戏电竞带鱼屏21:9 34英寸/144Hz/2K', '', 'FlYDzjpc67yrMMge4_JIfSdW_dIM', 2600.00, 0.00, 1, 100, 'Fq_EZElHhkCJFLVJpGktdz_D1b3c,FqXlit0FxHmYTavYuS9UPEJoEpsm,FpNN0GucPr8StSnJgu2zusysa5ML,FrcJuUOtA9AWv10aSP0jHbCeVowA', 12, 'twy', '234234111', '北京市北京市234111', '1631895150306', NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(32) NOT NULL COMMENT '订单ID',
  `user_id` varchar(11) NOT NULL COMMENT '用户id',
  `paid` smallint(2) DEFAULT '0' COMMENT '是否已支付。1是；0否',
  `money` decimal(13,2) NOT NULL DEFAULT '0.00' COMMENT '订单金额，单位为分',
  `pay_from` smallint(2) DEFAULT '1' COMMENT '1微信；2支付宝；3其他',
  `direction` smallint(2) DEFAULT '1' COMMENT '付款方向。1用户付款给商户，2商户付款给用户',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付订单';

-- ----------------------------
-- Table structure for pcegg_orders
-- ----------------------------
DROP TABLE IF EXISTS `pcegg_orders`;
CREATE TABLE `pcegg_orders` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `adid` int(10) DEFAULT NULL COMMENT '广告ID\n广告ID',
  `adname` varchar(128) DEFAULT NULL COMMENT '广告名称',
  `pid` varchar(64) DEFAULT NULL COMMENT '开发者渠道ID(由享玩提供)',
  `ordernum` varchar(64) DEFAULT NULL COMMENT '订单编号需要唯一',
  `dlevel` int(4) DEFAULT NULL COMMENT '奖励级别',
  `deviceid` varchar(64) DEFAULT NULL COMMENT '手机设备号 Android imei 或 IOS idfa',
  `simid` varchar(64) DEFAULT NULL COMMENT 'sim卡id',
  `userid` varchar(32) DEFAULT NULL COMMENT '开发者渠道自身统计编号',
  `merid` varchar(64) DEFAULT NULL COMMENT '用户体验广告注册的账号id',
  `event` varchar(255) DEFAULT NULL COMMENT '奖励说明',
  `price` decimal(8,2) DEFAULT NULL COMMENT '结算单价、保留2位小数',
  `money` decimal(8,2) DEFAULT NULL COMMENT '给用户奖励金额、保留2位小数',
  `itime` varchar(64) DEFAULT NULL COMMENT '用户领取奖励时间',
  `ptype` smallint(2) DEFAULT NULL COMMENT '设备类型 1-ios 2-安卓',
  `keycode` varchar(128) DEFAULT NULL COMMENT 'MD5(adid+pid+ordernum+deviceid+key) 小写',
  `awardtype` smallint(2) DEFAULT NULL COMMENT '奖励类型：0-任务奖励 1-消耗奖励 2-额外奖励 3-活动奖励',
  `stype` smallint(2) DEFAULT NULL COMMENT '广告类型1.棋牌 2.手游 3.理财 4.体验',
  `imgurl` varchar(128) DEFAULT NULL COMMENT '广告图标',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for red_orders
-- ----------------------------
DROP TABLE IF EXISTS `red_orders`;
CREATE TABLE `red_orders` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `from_user` varchar(11) NOT NULL COMMENT '发送者用户id',
  `to_user` varchar(11) NOT NULL COMMENT '接收者用户id',
  `status` smallint(2) DEFAULT '1' COMMENT '1未领取；2已领取；3已退还',
  `money` decimal(13,2) NOT NULL DEFAULT '0.00' COMMENT '红包金额，单位为分',
  `pay_from` smallint(2) DEFAULT '1' COMMENT '1余额；2微信；3支付宝',
  `remark` varchar(1024) DEFAULT NULL COMMENT '备注',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='红包订单';

-- ----------------------------
-- Records of red_orders
-- ----------------------------
BEGIN;
INSERT INTO `red_orders` VALUES (1, '10014', '10013', 1, 1.00, 1, NULL, '1633410170247', NULL);
INSERT INTO `red_orders` VALUES (2, '10014', '10013', 2, 1.00, 1, 'undefined', '1633410652647', '1633412689858');
INSERT INTO `red_orders` VALUES (3, '10014', '10013', 2, 100.00, 1, '别领', '1633412844437', '1633412850436');
INSERT INTO `red_orders` VALUES (4, '10014', '10013', 2, 1000000.00, 1, '12', '1633412882968', '1633412887161');
INSERT INTO `red_orders` VALUES (5, '10014', '10013', 2, 1.00, 1, '测试', '1633413303485', '1633413306876');
INSERT INTO `red_orders` VALUES (6, '10014', '10013', 2, 1.00, 1, '测试', '1633413325376', '1633413354014');
INSERT INTO `red_orders` VALUES (7, '10014', '10013', 1, 1.00, 1, '2', '1633413481181', NULL);
INSERT INTO `red_orders` VALUES (8, '10013', '10014', 2, 1.00, 1, '你好', '1633441001521', '1633499939496');
COMMIT;

-- ----------------------------
-- Table structure for refresh_price
-- ----------------------------
DROP TABLE IF EXISTS `refresh_price`;
CREATE TABLE `refresh_price` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `original_price` decimal(10,2) DEFAULT '0.00' COMMENT '原价',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `count` smallint(6) NOT NULL DEFAULT '0' COMMENT '刷新次数',
  `is_show` smallint(2) DEFAULT '1' COMMENT '是否展示',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COMMENT='刷新任务价目表';

-- ----------------------------
-- Records of refresh_price
-- ----------------------------
BEGIN;
INSERT INTO `refresh_price` VALUES (5, 15.00, 10.00, 5, 1, '1582900683707', '1582901042135', 1);
INSERT INTO `refresh_price` VALUES (6, 30.00, 15.00, 10, 1, '1582900864040', NULL, 0);
INSERT INTO `refresh_price` VALUES (7, 60.00, 25.00, 20, 1, '1582900877872', NULL, 0);
INSERT INTO `refresh_price` VALUES (8, 150.00, 50.00, 50, 1, '1582900895686', NULL, 0);
INSERT INTO `refresh_price` VALUES (9, 300.00, 95.00, 100, 1, '1582900911959', NULL, 0);
INSERT INTO `refresh_price` VALUES (10, 900.00, 270.00, 300, 1, '1582900924630', '1608193885553', 0);
INSERT INTO `refresh_price` VALUES (11, 1800.00, 480.00, 600, 1, '1582900934585', '1582955713409', 0);
INSERT INTO `refresh_price` VALUES (12, 15.00, 10.00, 5, 1, '1582901116894', NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for review_feedback
-- ----------------------------
DROP TABLE IF EXISTS `review_feedback`;
CREATE TABLE `review_feedback` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `review_id` int(8) DEFAULT NULL COMMENT '审核id',
  `user_id` int(8) DEFAULT NULL COMMENT '用户id',
  `content` varchar(10000) DEFAULT NULL COMMENT '反馈内容',
  `status` smallint(2) DEFAULT '0' COMMENT '处理结果。0未处理；1已处理',
  `created_at` varchar(13) DEFAULT NULL COMMENT '反馈时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '处理时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for score_stream
-- ----------------------------
DROP TABLE IF EXISTS `score_stream`;
CREATE TABLE `score_stream` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `score` int(8) NOT NULL COMMENT '积分',
  `balance` int(8) NOT NULL COMMENT '剩余积分',
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  `type` smallint(2) DEFAULT NULL COMMENT '积分获得来源。1签到；2发任务；3完成任务；4实名认证；5加入会员；6充值；7.平台赠送；8.转盘',
  `business_id` int(8) DEFAULT NULL COMMENT '相关的业务ID，需联合from进行判断具体是什么ID',
  `is_income` smallint(2) DEFAULT NULL COMMENT '1收入；0支出',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `created_at` varchar(13) DEFAULT NULL COMMENT '积分获得时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COMMENT='积分明细';

-- ----------------------------
-- Records of score_stream
-- ----------------------------
BEGIN;
INSERT INTO `score_stream` VALUES (1, 1, 15, 10013, 1, 1, 1, '签到', '1615113046092');
INSERT INTO `score_stream` VALUES (2, 0, 0, 10029, 2, 119, 0, '发布任务积分抵扣, 汇率0.01, 共抵扣0元', '1620754801640');
INSERT INTO `score_stream` VALUES (3, 1, 16, 10013, 1, 1, 1, '签到', '1625159000043');
INSERT INTO `score_stream` VALUES (4, 1, 1, 10029, 1, 1, 1, '签到', '1625159779375');
INSERT INTO `score_stream` VALUES (5, 1, 17, 10013, 1, 1, 1, '签到', '1625719638441');
INSERT INTO `score_stream` VALUES (6, 0, 0, 10031, 2, 120, 0, '发布任务积分抵扣, 汇率0.01, 共抵扣0元', '1632804975781');
INSERT INTO `score_stream` VALUES (7, 5, 5, 10014, 8, NULL, 1, '转盘奖励', '1634451035565');
INSERT INTO `score_stream` VALUES (8, 1, 6, 10014, 8, NULL, 1, '转盘奖励', '1634451133480');
INSERT INTO `score_stream` VALUES (9, 1, 5, 10014, 8, NULL, 0, '转盘扣除', '1634451139637');
INSERT INTO `score_stream` VALUES (10, 1, 6, 10014, 1, 1, 1, '签到', '1634451152867');
INSERT INTO `score_stream` VALUES (11, 12, 18, 10014, 8, NULL, 1, '转盘奖励', '1634451281204');
INSERT INTO `score_stream` VALUES (12, 1, 19, 10014, 8, NULL, 1, '转盘奖励', '1634451287379');
INSERT INTO `score_stream` VALUES (13, 10, 9, 10014, 8, NULL, 0, '转盘扣除', '1634451327865');
INSERT INTO `score_stream` VALUES (14, 10, 10, 10014, 8, NULL, 0, '转盘扣除', '1634452684025');
INSERT INTO `score_stream` VALUES (15, 10, 20, 10014, 8, NULL, 1, '转盘奖励', '1634452881293');
INSERT INTO `score_stream` VALUES (16, 1, 19, 10014, 8, NULL, 0, '转盘扣除', '1634452887732');
INSERT INTO `score_stream` VALUES (17, 1, 20, 10014, 8, NULL, 1, '转盘奖励', '1634452894170');
INSERT INTO `score_stream` VALUES (18, 1, 21, 10014, 8, NULL, 1, '转盘奖励', '1634452900483');
INSERT INTO `score_stream` VALUES (19, 12, 33, 10014, 8, NULL, 1, '转盘奖励', '1634452906482');
INSERT INTO `score_stream` VALUES (20, 10, 43, 10014, 8, NULL, 1, '转盘奖励', '1634452921536');
INSERT INTO `score_stream` VALUES (21, 12, 55, 10014, 8, NULL, 1, '转盘奖励', '1634452927430');
INSERT INTO `score_stream` VALUES (22, 10, 45, 10014, 8, NULL, 0, '转盘扣除', '1634452933462');
INSERT INTO `score_stream` VALUES (23, 12, 57, 10014, 8, NULL, 1, '转盘奖励', '1634452944635');
INSERT INTO `score_stream` VALUES (24, 5, 52, 10014, 8, NULL, 0, '转盘扣除', '1634452958321');
INSERT INTO `score_stream` VALUES (25, 10, 42, 10014, 8, NULL, 0, '转盘扣除', '1634452964122');
INSERT INTO `score_stream` VALUES (26, 5, 47, 10014, 8, NULL, 1, '转盘奖励', '1634452969896');
INSERT INTO `score_stream` VALUES (27, 1, 48, 10014, 8, NULL, 1, '转盘奖励', '1634452975670');
INSERT INTO `score_stream` VALUES (28, 10, 38, 10014, 8, NULL, 0, '转盘扣除', '1634452981416');
INSERT INTO `score_stream` VALUES (29, 10, 28, 10014, 8, NULL, 0, '转盘扣除', '1634452987384');
INSERT INTO `score_stream` VALUES (30, 10, 18, 10014, 8, NULL, 0, '转盘扣除', '1634452998941');
INSERT INTO `score_stream` VALUES (31, 5, 13, 10014, 8, NULL, 0, '转盘扣除', '1634453004709');
INSERT INTO `score_stream` VALUES (32, 10, 3, 10014, 8, NULL, 0, '转盘扣除', '1634453016853');
INSERT INTO `score_stream` VALUES (33, 5, -2, 10014, 8, NULL, 0, '转盘扣除', '1634453022995');
INSERT INTO `score_stream` VALUES (34, 10, 0, 10014, 8, NULL, 0, '转盘扣除', '1634453100148');
COMMIT;

-- ----------------------------
-- Table structure for sign
-- ----------------------------
DROP TABLE IF EXISTS `sign`;
CREATE TABLE `sign` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `sort` int(8) DEFAULT '0' COMMENT '第几天',
  `name` varchar(64) DEFAULT NULL COMMENT '名称',
  `score` int(8) DEFAULT NULL COMMENT '奖励积分',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='签到表';

-- ----------------------------
-- Records of sign
-- ----------------------------
BEGIN;
INSERT INTO `sign` VALUES (1, 1, '1天', 1);
INSERT INTO `sign` VALUES (2, 2, '2天', 2);
INSERT INTO `sign` VALUES (3, 3, '3天', 4);
INSERT INTO `sign` VALUES (4, 4, '4天', 8);
INSERT INTO `sign` VALUES (5, 5, '5天', 16);
INSERT INTO `sign` VALUES (6, 6, '6天', 32);
INSERT INTO `sign` VALUES (7, 7, '7天', 88);
COMMIT;

-- ----------------------------
-- Table structure for system
-- ----------------------------
DROP TABLE IF EXISTS `system`;
CREATE TABLE `system` (
  `id` smallint(2) NOT NULL AUTO_INCREMENT,
  `program_name` varchar(255) DEFAULT NULL COMMENT '项目名',
  `is_review` smallint(2) DEFAULT '0' COMMENT '是否提审。1是；0否',
  `commission_ratio` decimal(5,1) DEFAULT '0.0' COMMENT '提现手续费比例',
  `commission_ratio_vip` decimal(5,1) DEFAULT '0.0' COMMENT '会员提现手续费比例',
  `first_commission_ratio` decimal(5,1) DEFAULT '0.0' COMMENT '首次提现手续费比例',
  `withdraw_min` smallint(10) NOT NULL COMMENT '最小提现金额',
  `withdraw_max` smallint(10) NOT NULL COMMENT '最大提现金额',
  `first_withdraw_min` smallint(10) NOT NULL DEFAULT '1' COMMENT '首次提现最小提现金额',
  `withdraw_notice` varchar(255) DEFAULT NULL COMMENT '提现公告',
  `contact` varchar(255) DEFAULT NULL COMMENT '联系方式',
  `h5` varchar(1024) DEFAULT NULL COMMENT 'h5地址',
  `share_title` varchar(255) DEFAULT NULL COMMENT '分享标题',
  `share_image` varchar(1000) DEFAULT NULL COMMENT '分享图片',
  `vip_unlimited` smallint(2) DEFAULT '1' COMMENT '成为会员无限制任务领取数量',
  `agreement_title` varchar(255) DEFAULT NULL COMMENT '协议标题',
  `agreement_content` text COMMENT '协议内容',
  `need_certification` smallint(2) DEFAULT '0' COMMENT '是否需要实名认证才可领任务。1是;0否',
  `publish_need_certification` smallint(2) DEFAULT '0' COMMENT '是否需要实名认证才可发任务。1是;0否',
  `alipay_code` varchar(1000) DEFAULT NULL COMMENT '支付宝收款码',
  `wepay_code` varchar(1000) DEFAULT NULL COMMENT '微信收款码',
  `vip_description` varchar(1000) DEFAULT NULL COMMENT '会员权益说明',
  `task_price` decimal(10,2) DEFAULT '0.00' COMMENT '发布任务的服务费',
  `task_price_vip` decimal(10,2) DEFAULT '0.00' COMMENT '会员发布任务的服务费',
  `is_ratio` smallint(2) DEFAULT '1' COMMENT '是否按照任务金额的百分比来收取任务服务费',
  `use_paysapi` smallint(2) DEFAULT '0' COMMENT '是否使用paysapi支付',
  `use_apppay` smallint(2) DEFAULT '1' COMMENT '是否使用dcloud原生支付',
  `use_publicpay` smallint(2) DEFAULT '1' COMMENT '是否使用公众号微信支付',
  `online_pay` smallint(2) DEFAULT NULL COMMENT '使用在线支付',
  `mch_id` varchar(20) DEFAULT NULL COMMENT '商户号',
  `mch_key` varchar(64) DEFAULT NULL COMMENT '商户秘钥',
  `invite_rule` varchar(1000) DEFAULT NULL COMMENT '邀请规则',
  `need_vip` smallint(2) DEFAULT '0' COMMENT '是否会员才可发任务。1是;0否',
  `show_vip` smallint(2) DEFAULT '1' COMMENT '是否显示加入会员入口',
  `show_certification` smallint(2) DEFAULT '1' COMMENT '是否显示认证入口',
  `show_publish` smallint(2) DEFAULT '1' COMMENT '是否显示发布任务入口',
  `show_wallet` smallint(2) DEFAULT '1' COMMENT '是否显示钱包入口',
  `show_withdraw` smallint(2) DEFAULT '0' COMMENT '是否在个人中心显示提现入口',
  `show_recharge` smallint(2) DEFAULT '0' COMMENT '是否在个人中心显示充值入口',
  `show_contact` smallint(2) DEFAULT '0' COMMENT '是否在个人中心显示联系客服入口',
  `show_invite` smallint(2) DEFAULT '0' COMMENT '是否在个人中心显示邀请好友入口',
  `show_connect` smallint(2) DEFAULT '0' COMMENT '是否在个人中心显示关联账号入口',
  `show_refresh` smallint(2) DEFAULT '1' COMMENT '是否在个人中心显示付费刷新入口',
  `need_review` smallint(2) DEFAULT '1' COMMENT '用户发布任务是否需要管理员审核',
  `about_us` text COMMENT '关于我们',
  `show_about` smallint(2) DEFAULT '1' COMMENT '是否在个人中心显示关于我们的入口',
  `show_recommend` smallint(2) DEFAULT '1' COMMENT '首页是否显示推荐标签',
  `show_high` smallint(2) DEFAULT '1' COMMENT '首页是否显示高价标签',
  `show_simple` smallint(2) DEFAULT '1' COMMENT '首页是否显示简单标签',
  `show_member` smallint(2) DEFAULT '1' COMMENT '首页是否显示会员标签',
  `base_amount` decimal(10,2) DEFAULT '0.00' COMMENT '新用户初始余额',
  `max_review_time` varchar(13) DEFAULT NULL COMMENT '任务最大审核时间',
  `open_appeal` smallint(2) DEFAULT '1' COMMENT '任务审核是否可申诉',
  `min_task_price` decimal(6,2) DEFAULT '1.00' COMMENT '任务最小金额',
  `max_task_price` decimal(6,2) DEFAULT '-1.00' COMMENT '任务最大金额，-1无限制',
  `min_limit_time` varchar(13) DEFAULT '60' COMMENT '任务最小时间限制',
  `max_limit_time` varchar(13) DEFAULT '-1' COMMENT '任务最大时间限制，-1无限制',
  `android_download_url` varchar(1024) DEFAULT NULL COMMENT '安卓版下载地址',
  `ios_download_url` varchar(1024) DEFAULT NULL COMMENT 'iOS版下载地址',
  `android_download_code` varchar(255) DEFAULT NULL COMMENT '安卓下载二维码',
  `ios_download_code` varchar(255) DEFAULT NULL COMMENT 'iOS下载二维码',
  `refresh_count` smallint(8) DEFAULT '0' COMMENT '任务刷新次数',
  `recommend_price` decimal(6,2) DEFAULT '0.00' COMMENT '首页推荐金额/小时',
  `vip_recommend_price` decimal(6,2) DEFAULT '0.00' COMMENT '会员首页推荐金额/小时',
  `top_price` decimal(6,2) DEFAULT '0.00' COMMENT '任务置顶金额/小时',
  `vip_top_price` decimal(6,2) DEFAULT '0.00' COMMENT '会员任务置顶金额/小时',
  `withdraw_need_certificate` smallint(2) DEFAULT '0' COMMENT '提现是否需实名认证',
  `show_certification_IDcard` smallint(2) DEFAULT '1' COMMENT '认证页面是否需要证件照片',
  `show_certification_card_number` smallint(2) DEFAULT '1' COMMENT '认证页面是否需要证件号',
  `show_register_entry` smallint(2) DEFAULT '1' COMMENT '是否显示注册账号入口',
  `show_phone_login` smallint(2) DEFAULT '1' COMMENT '是否显示手机验证码登录入口',
  `vip_award_ratio` smallint(2) DEFAULT '0' COMMENT '一级会员奖励百分比',
  `vip_award_ratio_two` smallint(2) DEFAULT '0' COMMENT '二级会员奖励百分比',
  `show_app_wechat_login` smallint(2) DEFAULT '1' COMMENT '是否显示APP微信登录',
  `need_bind_phone` smallint(2) DEFAULT '0' COMMENT '是否需要绑定手机号',
  `show_find_password` smallint(2) DEFAULT '0' COMMENT '是否显示找回密码入口',
  `use_app_alipay` smallint(2) DEFAULT '0' COMMENT '是否使用APP支付宝支付',
  `score_rate` float(18,3) DEFAULT '0.000' COMMENT '积分对人民币汇率',
  `score_for_task` smallint(2) DEFAULT '0' COMMENT '是否支持使用积分抵扣发布任务费用',
  `app_version` smallint(4) DEFAULT '100' COMMENT 'APP应用版本号',
  `app_version_name` varchar(64) DEFAULT NULL COMMENT 'APP版本名称',
  `app_update_description` varchar(1024) DEFAULT NULL COMMENT 'APP更新说明',
  `app_update_rule` smallint(2) DEFAULT '0' COMMENT '1强制更新；0不强制更新',
  `invite_text` varchar(1024) DEFAULT NULL COMMENT '邀请好友文案',
  `invite_poster` varchar(1024) DEFAULT NULL COMMENT '推广海报',
  `poster_code_width` int(6) DEFAULT '75' COMMENT '海报二维码宽度',
  `poster_code_height` int(6) DEFAULT '75' COMMENT '海报二维码高度',
  `poster_code_left` int(6) DEFAULT '73' COMMENT '二维码与海报左边的距离',
  `poster_code_top` int(6) DEFAULT '146' COMMENT '二维码与海报顶部的距离',
  `download_page` varchar(1024) DEFAULT NULL COMMENT '落地页注册成功后跳转的地址',
  `pay_to_wechat` smallint(2) DEFAULT '0' COMMENT '是否开启企业付款到微信零钱',
  `pay_to_alipay` smallint(2) DEFAULT '0' COMMENT '是否开启企业付款到支付宝零钱',
  `withdraw_need_bind_wechat` smallint(2) DEFAULT '0' COMMENT '提现时是否要求绑定微信',
  `policy_title` varchar(255) DEFAULT NULL COMMENT '隐私政策标题',
  `policy_content` text COMMENT '隐私政策内容',
  `use_phone_register` smallint(2) DEFAULT '0' COMMENT '落地页使用手机号注册',
  `show_bind_phone` smallint(2) DEFAULT '0' COMMENT '是否显示绑定手机号',
  `show_wallet_recharge` smallint(2) DEFAULT '1' COMMENT '钱包里是否显示充值入口',
  `show_app_apple_login` smallint(2) DEFAULT '1' COMMENT '是否显示APP苹果登录',
  `grab_btn_ad` varchar(128) DEFAULT NULL COMMENT '领取任务按钮视频广告id',
  `withdraw_btn_ad` varchar(128) DEFAULT NULL COMMENT '提现按钮视频广告id',
  `show_alipay_withdraw` smallint(2) DEFAULT '1' COMMENT '是否显示支付宝提现',
  `show_wechat_withdraw` smallint(2) DEFAULT '1' COMMENT '是否显示微信提现',
  `show_bank_withdraw` smallint(2) DEFAULT '1' COMMENT '是否显示银行卡提现',
  `recharge_rate` int(10) DEFAULT '100' COMMENT '充值到账百分比，可用作充100，送一百',
  `enable_location` smallint(2) DEFAULT '1' COMMENT '启用定位功能',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='系统配置';

-- ----------------------------
-- Records of system
-- ----------------------------
BEGIN;
INSERT INTO `system` VALUES (1, '鲨鱼任务', 0, 1.5, 1.0, 1.0, 10, 10000, 1, '每次提现最小金额为10元，每日只能提现1次', '10000', 'https://shark-m.xigu.pro', '你有一堆money待领取', 'Flq6q84NhbTIuWeRlAcNzp3P3PRJ', 0, '鲨鱼任务用户服务协议', '<p>感谢您选择鲨鱼任务服务。本协议就鲨鱼任务平台提供的兼职任务服务相关权利义务进行规范，\n      本服务条款对您及鲨鱼任务均具有法律效力。</p>\n<h3>【特别提示】</h3>\n<p><strong>1、在使用鲨鱼任务服务之前，请您务必仔细阅读本协议内容，尤其是字体加粗部分。\n  请您务必审慎阅读、充分理解各条款内容，特别是隐私政策、用户协议、免责以及争议管辖与法律适用的条款。\n   除非您已阅读并接受本协议所有条款，否则您无权使用“鲨鱼任务”提供的服务。</strong></p>\n<p><strong>2、“鲨鱼任务”的服务仅向有完全民事行为能力的自然人、法人或其他组织提供。\n  您使用鲨鱼任务服务时应确认为具备相应民事行为能力的自然人、法人或其他组织。\n  未成年人应当在监护人陪同和指导下阅读本协议，并在使用本协议项下服务前取得监护人的同意，\n  若您不具备签署与您行为相适应的民事行为能力，则您及您的监护人应依照法律规定承担因此而导致的一切后果，\n  且“鲨鱼任务”有权直接注销您的账户。若您在使用“鲨鱼任务”服务过程中造成我们损失的，\n  我们有权向您及您的监护人索偿。</strong></p>\n<p><strong>3、如您对本协议内容或页面提示信息有疑问，请立即停止当前操作，退出页面，勿进行下一步操作。\n  您可通过联系我们在线客服进行咨询，以便我们为您解释和说明。\n  您在注册页面完成信息填写、勾选阅读并同意本协议并完成全部注册程序后确认即表示您愿意签署本协议并受本协议约束；\n  您的注册、登录、使用等行为将视为对本协议的接受，并视为您同意接受本协议各项条款的约束，\n  本协议将构成您和“鲨鱼任务”之间直接有约束力的法律文件。</strong></p>\n<p><strong>4、如我们对本协议进行修改，我们将以网站公告、用户后台或通过其他联\n  系方式向您通知/送达的相关规则、政策、通知，前述修订或相关规则，自通知/送达之日起正式生效。\n  如您不同意相关变更内容或我们通知之任何内容，请停止使用“鲨鱼任务”服务。如果您继续使用“鲨鱼任务”服务，\n  则视为您已认可并无条件接受本协议变更及我们向您通知之全部内容。</strong></p>\n\n<h3>一、定义</h3>\n<p>1、鲨鱼任务平台，是指其关联方运营的鲨鱼任务网站、鲨鱼任务APP、小程序、微信公众号等。</p>\n<p>2、用户，包含注册用户和非注册用户。注册用户是指通过鲨鱼任务平台完成全部注册程序后，\n  使用鲨鱼任务服务的用户。非注册用户指虽未进行注册，但以直接登录鲨鱼任务平台方式，\n  或通过其他网站/客户端直接或间接方式使用鲨鱼任务平台服务的用户。</p>\n<h3>二、 服务内容及服务的变更、中断、终止</h3>\n<p>1、“鲨鱼任务”的具体服务内容以“鲨鱼任务”平台实际情况提供内容为准，包括但不限于上传功能、报名功能、发布任务等。\n  “鲨鱼任务”仅提供相关服务，除此之外与本服务有关的设备（如电脑、调制解调器及其他与接入互联网有关的装置）\n  及所需的费用（如为接入互联网而支付的电话费及上网费）均应由您自行负担。</p>\n<p><strong>2、您同意并理解，“鲨鱼任务”仅为网络服务提供者，“鲨鱼任务”对提供的服务效果不作任何保证，\n  前述效果包括但不限于信息发布后的浏览数量、产生某种效果或达成某种目的/目标等。</strong></p>\n<p>3、“鲨鱼任务”保留根据实际情况随时调整“鲨鱼任务”平台提供的服务种类、形式的权利。\n  “鲨鱼任务”不承担因业务调整给您造成的损失。</p>\n<p>4、“鲨鱼任务”因业务调整或平台自身需要进行改版的，包括但不限于产品取消、服务内容发生增加或减少、\n  登载页面变更、发布城市变更、版面布局及页面设计变更等，“鲨鱼任务”将以网站公告等方式向您告知，\n  调整在告知后正式生效，此类情况不视为“鲨鱼任务”违约。</p>\n<p>5、您理解网络服务具有特殊性（包括但不限于服务期稳定性问题、恶意的网络攻击等行为的存在及\n  其他“鲨鱼任务”无法控制的情况），若发生服务中断或终止部分/全部服务的情况，“鲨鱼任务”将\n  尽可能及时通过网站公告、系统通知、短信或其他合理方式向您告知。\n  “鲨鱼任务”保留单方变更、中断或终止部分网络服务的权利。</p>\n<h3>三、账户注册、安全及使用</h3>\n<h4>（一）注册</h4>\n<p><strong>1、您完成注册程序或以其他“鲨鱼任务”认可的渠道实际使用“鲨鱼任务”服务后，\n  鲨鱼任务会向您提供唯一编号的鲨鱼任务账户，并由您自行设置密码。\n  鲨鱼任务识别特定您的方式是且仅是您使用特定账户，并输入与之匹配的密码进行登录。\n  故您应保证账户和密码的安全，并对您注册的账户通过登录密码校验后实施的一切行为负责。\n  对于他人使用任何手段获取您账户及其密码登录鲨鱼任务并实施任何的行为，鲨鱼任务都视为您本人的行为。</strong></p>\n<p><strong>2、您在注册账号或使用服务过程中，应向“鲨鱼任务”提供合法、真实、准确的个人信息，\n  若您填写的个人信息有变动，您应及时进行更新，以免影响服务体验。\n  若您故意提供虚假的身份信息进行注册，发布虚假信息的，视为严重违反本协议，\n  “鲨鱼任务”有权立即暂停或终止您的账号并停止提供服务。虚假注册、发布虚假信息给“鲨鱼任务”造成经济、名誉损失的，\n  “鲨鱼任务”有权向您全额索赔。</strong></p>\n<p>3、如您为企业用户，您应及时提供的“单位名称、主体身份证件、被授权人职务或岗位信息、\n  企业邮箱”等相关授权信息及材料，并确保前述授权的真实性；您应保证其职务行为已获得有效授权，\n  包括但不限于上传/发布信息、确认需求/服务信息等。</p>\n<p>4、用户名由您自行设置，请注意文明用语；不得以党和国家领导人或其他社会名人\n  真实姓名、字号、艺名、笔名注册； 不得以国家机构或其他机构名称注册、\n  不得注册不文明、不健康的名称，及包含歧视、侮辱、猥亵类词语的名称；不得注册易产生歧义、\n  引起他人误解或其他不符合法律规定的账号。\n  若“鲨鱼任务”发现您的用户名不符合前述规定或含有其他不恰当文字的，\n  “鲨鱼任务”有权单方注销您的账号，因此造成的一切后果概由您自行承担。</p>\n<p>5、您理解并同意，一经注册用户账号，即视为您同意鲨鱼任务及/或其关联公司可以\n  通过拨打电话、发送短信或者电子邮件等方式向您注册时填写的手机号码、电子邮箱等发送、\n  告知相应的产品服务广告信息、促销优惠等营销信息；您如果不同意接收相关信息，\n  您可以通过客服或相关提示进行退订。</p>\n<h4>（二）账号安全</h4>\n<p>1、您有义务保证密码及帐号的安全，并对利用该密码及帐号所进行的一切活动负全部责任，\n  包括任何经由鲨鱼任务上载、张贴、发送电子邮件或任何其它方式传送的\n  资讯、资料、文字、软件、音乐、音讯、照片、图形、视讯、信息或其它资料，\n  无论系公开还是私下传送，均由内容提供者承担责任。</p>\n<p>2、除非有法律规定且征得鲨鱼任务的同意，否则，您账户和密码不得以任何方式转让、\n  赠与或继承（与账户相关的财产权益除外）、不得将账号提供给任何第三方进行使用。\n  如因此造成用户隐私泄露或“鲨鱼任务”平台损失的（包括但不限于经济损失、名誉损失等），\n  您均应当承担相应的责任。</p>\n<p>3、“鲨鱼任务”承诺非经法定原因、本协议的约定或您的事先许可，\n  “鲨鱼任务”不会向任何第三方透露您的注册账号、手机号码等非公开信息。\n  如您发现任何人不当使用您的账户或者有任何其他可能危及您的账户安全的情形时，\n  应该立即修改帐号密码并妥善保管，您还可立即通知“鲨鱼任务”平台，\n  我们在收到您的通知后会在合理时间内处理您的账号问题。\n  因黑客行为或您的保管疏忽导致账号非法使用，鲨鱼任务平台不承担任何责任，\n  你应通过司法、行政等救济途径向侵权行为人追偿。</p>\n<p>4、“鲨鱼任务”有权根据自身的判定，在怀疑账号被不当使用时，\n  拒绝或限制账号使用，或者直接注销该账号，同时终止本协议。</p>\n<h4>（三）账号使用规范</h4>\n<p>1、您同意，遵守法律及本协议规定，善意使用“鲨鱼任务”平台，\n  且保证不会利用“鲨鱼任务”进行任何违法、违背社会公共利益或公共道德、损害他人的合法权益等不正当活动。</p>\n<p><strong>2、您不得在“鲨鱼任务”平台发布或以其它方式传送、传播含有下列内容之一的信息：</strong></p>\n<p><strong>（1）违反国家法律法规禁止性规定的；</strong></p>\n<p><strong>（2）政治宣传、封建迷信、淫秽、色情、赌博、暴力、恐怖或者教唆犯罪的；</strong></p>\n<p><strong>（3）欺诈、虚假、不准确或存在误导性的；</strong></p>\n<p><strong>（4）侵犯他人知识产权或涉及第三方商业秘密及其他专有权利的；</strong></p>\n<p><strong>（5）侮辱或者诽谤、侵害他人隐私或其他合法权利的；</strong></p>\n<p><strong>（6）粗俗、猥亵或其它道德上令人反感的内容的；</strong></p>\n<p><strong>（7）存在可能破坏、篡改、删除、影响“鲨鱼任务”任何系统正常运行\n  或未经授权秘密获得“鲨鱼任务”及其他用户的数据、个人资料的病毒、木马、爬虫等恶意软件、程序代码的；</strong></p>\n<p><strong>（8）其他违背社会公共利益或公共道德或经“鲨鱼任务”评估不适合在\n  “鲨鱼任务”平台上发布的。</strong></p>\n<p>3、您在使用“鲨鱼任务”平台的过程中，您应保证：</p>\n<p>（1）您在“鲨鱼任务”实施的所有行为均遵守国家法律法规等规范性文件、遵守“\n  鲨鱼任务”平台各项规则的规定和要求。</p>\n<p>（2）未经“鲨鱼任务”同意，不擅自对“鲨鱼任务”平台上任何数据进行商业性使\n  用，包括但不限于复制、传播“鲨鱼任务”平台上展示的资料、数据、文章、链接等。</p>\n<p>（3）不使用任何可能破坏、篡改、删除、影响“鲨鱼任务”任何系统正常运行的装置、病毒、木马、爬虫等软件、程序代码。</p>\n<p>（4）不得采用作弊、欺诈或利用系统漏洞等不正当手段，获取不正当\n  利益。</p>\n<p><strong>4、如因您发布不当信息、违反法律法规、本协议规定或“鲨\n  鱼任务”平台各项规则，导致的任何纠纷、争议、损失、赔偿等一切责任均由您自\n  行承担，“鲨鱼任务”不承担任何责任及赔偿，如您因此造成鲨鱼任务被第三人索赔\n  的，造成鲨鱼任务损失的，您应承担全部责任，包括但不限于各种赔偿费、诉讼代\n  理费及“鲨鱼任务”为此支出的其它合理费用。</strong></p>\n<p><strong>5、您同意并理解，对于您在鲨鱼任务上的行为，鲨鱼任\n  务有权单方认定您行为是否构成对本协议及相关规则的违反，并据此采取相应处理\n  措施。若您违反本协议约定及承诺，“鲨鱼任务”有权依据法律法规及本协议的约定，对您\n  的账号作出相应处理且无须征得您的同意或提前向您告知，包括但不限于屏蔽或删除您发\n  布的信息、喵任务奖金清零、暂停您的账号权限、终止您的账号服务等。若因此造成“鲨\n  鱼任务”损失或发生相应费用的，您应当全额赔偿。</strong></p>\n<p>6、当您在使用“鲨鱼任务”平台过程中，向“鲨鱼任务”提供除个\n  人信息之外的一切信息，包括但不限于上传之图片、文章、职位等，您认可自提供之日\n  起即授予“鲨鱼任务”就该等信息永久性的、全球的、不可撤销的、免使用费的、可再次授权给他人的使用权。</p>\n<h3>四、隐私条款</h3>\n<p><strong>1、在您使用“鲨鱼任务”平台过程中，\n  我们有可能需要您填写能识别用户身份的个人信息，以便可以在必要时联系您或为您提供更好的服务。\n  前述“个人信息”包括但不限于您的姓名/企业名称/\n  企业负责人姓名、性别、年龄、联系电话、邮箱、地址、受教育情况、简历信息、求职意向、\n  手机设备识别码、IP地址、简历、用户聊天记录、投诉及评论信息、\n  站内搜索关键词信息等资料。</strong></p>\n<p><strong>2、我们重视对您信息的保护，您向“鲨鱼任务”提供的个人信息，\n  我们将依《鲨鱼任务隐私权政策》进行保护与规范，详情请参阅《鲨鱼任务隐私权政策》。</strong></p>\n<p>3、如果您是企业用户，我们将依法保护您的商业秘密，\n  非经您同意不会对外提供，但在法律、行政法规要求下，\n  基于民事或刑事调查、监管需要等，应有管辖权的法院、仲裁机构、政府机关、\n  司法机关或监管机构的要求进行的披露除外。</p>\n<h3>五、服务费用</h3>\n<p>1、“鲨鱼任务”是个对大多数用户免费的分类信息网站，但“鲨鱼任务”\n  同时提供部分收费服务。若您所使用的服务需支付费用，\n  您有权决定是否使用并接受该收费服务。</p>\n<p>2、“鲨鱼任务”上的收费服务以人民币计价，定价上可能随时调整。\n  我们将以网站公告的方式，来通知您收费政策的变更。\n  “鲨鱼任务”也可选择在促销或新服务推出时，暂时调整我们的服务收费，\n  该调整于我们公布促销或新服务时开始生效。</p>\n<p>3、“鲨鱼任务”只有在系统接收到您支付的款项后，\n  才开始为您提供您订购的付费服务。</p>\n<p><strong>4、您理解并认可：订购之付费服务功能一旦开通，\n  您不得以任何理由要求取消、终止服务或退款，若因个人行为（如:自行删除）或\n  发布信息内容违反本协议规定、鲨鱼任务公布之各项规则，\n  而导致您订购的服务无法继续使用的，“鲨鱼任务”将不予退款。</strong>\n<p><strong>5、“鲨鱼任务”因网站自身需要进行改版的，\n  若涉及付费产品的实质性变化，包括但不限于产品取消、\n  服务内容发生增加或减少、登载页面变更、发布城市变更的，\n  “鲨鱼任务”可提前终止服务并将您已付款但未履行服务部分款项退还给您，\n  此类情况不视为鲨鱼任务违约。</strong>\n<h3>六、账户余额</h3>\n<p>“鲨鱼任务”账户余额是“鲨鱼任务”内部使用的现金账户，\n  方便您进行付费产品的购买，或者享受更多的优惠。\n  您可以使用充值的方式增加“鲨鱼任务”账户的余额，\n  同时“鲨鱼任务”也会通过活动的方式奖励一定的现金到您的“鲨鱼任务”账户中。\n  所有账户余额中的部分都仅限于在“鲨鱼任务”内部进行使用，不能提现或退款。</p>\n<h3>七、侵权通知</h3>\n<p>1、如您发现“鲨鱼任务”平台上的任何内容不符合法律法规规定，\n  不符合本用户协议规定，或不符合“鲨鱼任务”公布的各项规则规定时，\n  您有权利和义务通过点击“举报”链接向我们申述。</p>\n<p>2、当您发现自己的个人信息被盗用，或者您的版权或者其他权利被侵害，\n  请及时将此情况报告给“鲨鱼任务”。我们接受在线提交举报\n  （在首页跳入投诉建议并按要求提交信息）或书面邮寄方式举报，\n  书面邮寄方式举报请邮寄到如下地址：\n  中国广东省广州市番禺区小谷围街道青蓝街26号13楼，邮政编码：510006。\n  请同时提供以下信息：</p>\n<p>①侵犯用户权利的信息的网址，编号或其他可以找到该信息的细节；</p>\n<p>②用户提供所述的版权或个人信息的合法拥有者的声明；</p>\n<p>③用户提供初步能证明侵权的证据；</p>\n<p>④用户的姓名，地址，电话号码和电子邮件等各类有效联系方式；</p>\n<p>⑤用户的签名。</p>\n<p>“鲨鱼任务”会在核实后，根据相应法律法规及本协议约定予以配合处理。\n  若因您提供的证据不充分或填写的联系方式有误等不可归咎于“鲨鱼任务”的原因，\n  使“鲨鱼任务”无法对相关情况进行核实的，我们保留暂停处理侵权通知的权利。</p>\n<h3>八、知识产权</h3>\n<p>1、“鲨鱼任务”平台上展示的所有内容，包括但不限于版面设计、图标、\n  文字及其组合、产品、技术、程序等，知识产权均受著作权法、商标法、\n  专利法或其他法律法规保护。未经“鲨鱼任务”书面授权许可,\n  您不得擅自使用、复制、转载、修改、售卖前述内容。\n  否则，“鲨鱼任务”有权追究您的法律责任。</p>\n<p>2、除另有声明外，“鲨鱼任务”提供服务时所依托软件的著作权、\n  专利权及其他知识产权均归“鲨鱼任务”所有。未经明确授权，任何用户不得更改、\n  演绎、拆分、反解“鲨鱼任务”的技术和程序或以其它\n  任何方式进行可能损害“鲨鱼任务”专有权利的行为。</p>\n<p>3、您在使用“鲨鱼任务”平台过程中发布的任何内容，\n  均授予“鲨鱼任务”免费且不可撤销的非独家使用许可，\n  “鲨鱼任务”有权将改内容用于“鲨鱼任务”平台的各项产品及服务上。\n  您对“鲨鱼任务”的前述授权并不改变您发布内容的所有权及知识产权归属。</p>\n<h3>九、免责声明</h3>\n<p>1、您同意因网络原因、“鲨鱼任务”进行业务调整、正常的系统维护升级及\n  第三方原因或不可抗力因素等造成的“鲨鱼任务”平台无法正常访问\n  或“鲨鱼任务”服务无法正常提供的，“鲨鱼任务”不承担任何责任。</p>\n<p>2、您通过“鲨鱼任务”平台发布的信息或内容，并不代表“鲨鱼任务”之意见及观点，\n  也不意味着“鲨鱼任务”赞同其观点或证实其内容的真实性。\n  您通过“鲨鱼任务”平台发布的信息、文字、图片等资料均由您提供，\n  其真实性、准确性和合法性由信息发布人或提供者负责。\n  “鲨鱼任务”不提供任何保证，并不承担任何法律责任。\n  如果以上资料侵犯了第三方的知识产权或其他权利，\n  责任由信息发布者本人承担，“鲨鱼任务”对此不承担任何法律责任及赔偿责任。</p>\n<p>3、“鲨鱼任务”仅为网络平台提供者，不对您与其他用户或任何第三方之间的\n  任何纠纷（包括但不限于债权债务纠纷、劳资纠纷、人身损害纠纷、意外伤害纠纷等）\n  承担任何法律责任及赔偿责任；且“鲨鱼任务”不与任何您建立任何劳动、劳务、雇佣关系，\n  您通过“鲨鱼任务”平台得到资讯和信息后，\n  与用工方建立的用工关系或实际用工关系均系您与用工方双方自愿之行为，\n  与“鲨鱼任务”无关，“鲨鱼任务”不承担任何法律责任。对于可证实的纠纷，\n  “鲨鱼任务”可以提供相关资料帮助您进行协调。</p>\n<p>4、除“鲨鱼任务”注明的平台服务内容及条款外，其他一切因使用“鲨鱼任务”平台所造成的损失，\n  “鲨鱼任务”概不负责，亦不承担任何法律责任及赔偿责任。\n  任何您使用“鲨鱼任务”平台服务并不意味与“鲨鱼任务”及其运营公司\n  产生任何代理、合伙、合资、雇佣、劳动、劳务及劳务派遣之关系。</p>\n<p>5、在您使用的过程中，若我们通过广告或其他方式向您提供链接，\n  使您可以接入第三方服务或网站，且您实际使用该等第三方的服务时，\n  须受该第三方的服务条款及隐私条款约束，您需要仔细阅读其条款。\n  您应了解，本协议仅适用于“鲨鱼任务”提供的服务，并不适用于任何\n  第三方提供的服务或第三方的信息使用规则，“鲨鱼任务”无法对第三方网站\n  进行控制。因此，“鲨鱼任务”对任何第三方提供的服务或第三方使用由您提供的信息不承担任何责任。</p>\n<p>6、 您清楚“鲨鱼任务”平台内容大多数内容来自用户，\n  “鲨鱼任务”不保证平台上展示之信息的准确性和有效性、\n  以及所提供内容质量的安全性或合法性。您如因为浏览“鲨鱼任务”的\n  内容或第三方发布和上传的内容而因此遭受到任何损失（包括但不限于金钱、商誉、名誉的损失），\n  或与其他用户发生争议，就上述损失或争议或任何方面产生有关的索赔、要求、诉讼、损失和损害，\n  我们可为您提供相关资料处理争议事宜。您同意不就前述争议事件追究“鲨鱼任务”的责任，\n  同意免除“鲨鱼任务”平台运营方的责任。</p>\n<h3>十、违约责任</h3>\n<p>1、如因您违反有关法律、法规或本协议项下的任何条款给“鲨鱼任务”或\n  任何第三方造成损失，“鲨鱼任务”有权随时采取停止服务、删除或\n  修改信息、解除本协议等措施，并保留向您追索赔偿一切损失之权利。\n  同时“鲨鱼任务”已向您收取的服务费（如有）将不予退还，您应自行承担由此造成的一切法律责任。</p>\n<p>2、如因“鲨鱼任务”违反有关法律、法规或本协议项下的\n  任何条款而给您造成损失的，相应的损害赔偿责任由“鲨鱼任务”承担。</p>\n<h3>十一、通知</h3>\n<p>1、“鲨鱼任务”提供服务有关的用户协议和服务条款的修改、服务的变更、\n  收费政策的变更或其它重要事件的通告都会以网站发布、\n  用户后台或通过其他联系方式向您通知/送达的相关规则、政策、通知，\n  前述修订或相关规则，自通知/送达之日起正式生效。</p>\n<p>2、您在使用“鲨鱼任务”服务时，应向“鲨鱼任务”提供真实有效的\n  联系方式（包括但不限于联系电话等），若您的联系方式发生变更的，\n  您应该及时更新有关信息，便于“鲨鱼任务”及时向您发送各类通知。</p>\n<h3>十二、争议的解决及其他</h3>\n<p>1、本协议的所有内容和条款均受中华人民共和国法律管辖。\n  与“鲨鱼任务”内容、服务相关的争议、“鲨鱼任务”所有用户间的争议、\n  网站与用户间的争议等全部相关争议均不可撤销地受“鲨鱼任务”所有权和\n  运营权所有者所属公司实际经营地所在地人民法院的管辖。您自愿放弃选择\n  以网络终端、服务器所在地、侵权行为所在地等其它地点作为相关管辖地的权利。</p>\n<p>2、如本协议的任何条款被裁定为无效或不可执行，该条款应视为可分的，\n  且不影响本协议其余条款的有效性及可执行性。</p>\n<p>3、在发生并购时，本协议和所有纳入的协议所确定的权利可由\n  “鲨鱼任务”自行酌情决定向第三方转让。“鲨鱼任务”未就用户或\n  其他方的违约行为采取行动并不等于“鲨鱼任务”放弃就随后或类似的违约行为采取行动的权利。</p>\n<p>4、“鲨鱼任务”不定期发布针对用户的相关协议、公告、规则等，\n  并可将前述文件作为本协议的补充或修改而将其内容作为本协议的一部分。</p>', 0, 0, 'FsxRskgLBIi4y6DQnaNRix6VNAGl', 'FjZKX_6IJZUvxp2gPc2qXYkzx0uX', '1.可领取会员专属任务；\n2.极低提现手续费享优惠；\n3.发布任务服务费享优惠；\n4.优先审核提现，佣金到账速度更快；\n5.优先审核任务，更快拿到奖励；\n6.推荐置顶任务享优惠；', 2.00, 1.00, 1, 1, 0, 0, 1, '1572569421', 'b4b440e3488dc1cc65a348c6dfc5fa9e', '1.邀请对象需为未注册本平台的用户；\n2.好友点击邀请链接并授权登录，完成任意任务或开通/续费会员后即可获得奖励；\n3.奖励将直接计入本平台账户余额；\n4.使用非正常途径或手段获得奖励将被作为无效处理；\n5.本活动最终解释权归本平台所有。', 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, '一款任务悬赏APP，让天下没有难赚的钱，让每个人都能轻松赚钱。购买请联系微信291558181', 1, 1, 1, 1, 1, 1.00, '10080', 1, 1.00, -1.00, '60', '-1', '', '', '', '', 4, 2.00, 1.00, 10.00, 5.00, 0, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0.010, 1, 100, 'v1.0.0', '首次发布', 0, '最好的赚钱方法就是让别人帮你赚钱，赶紧加入我们发家致富吧。', 'Fmik6SQ3WJ80Tn4FzQDyxTlt3Xak', 75, 75, 73, 146, 'http://shark-o.xigu.pro', 0, 0, 0, '隐私政策', '<p>本应用深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。\n      我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致\n      原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原\n      则、公开透明原则等。同时，我们承诺，我们将按业界成熟的安全标准，采取相应\n      的安全保护措施来保护您的个人信息。 请在使用我们的产品（或服务）前，仔细阅\n      读并了解本《隐私权政策》。</p>\n    <h3>一、我们如何收集和使用您的个人信息</h3>\n    <p>个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然\n      人身份或者反映特定自然人活动情况的各种信息。 我们仅会出于本政策所述的以下\n      目的，收集和使用您的个人信息：</p>\n    <p>（一）我们不出售任何商品，同时也不展示任何商品</p>\n    <p>（二）开展内部数据分析和研究，第三方SDK统计服务，改善我们的产品或服务</p>\n    <p>我们收集数据是根据您与我们的互动和您所做出的选择，包括您的隐私设置以及您使\n      用的产品和功能。我们收集的数据可能包括SDK/API/JS代码版本、浏览器、互联网服\n      务提供商、IP地址、平台、时间戳、应用标识符、应用程序版本、应用分发渠道、独立\n      设备标识符、iOS广告标识符（IDFA)、安卓广告主标识符、网卡（MAC）地址、国际移\n      动设备识别码（IMEI）、设备型号、终端制造厂商、终端设备操作系统版本、会话启动\n      /停止时间、语言所在地、时区和网络状态（WiFi等）、硬盘、CPU和电池使用情况等。</p>\n    <p>当我们要将信息用于本策略未载明的其它用途时，会事先征求您的同意。</p>\n    <p>当我们要将基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。</p>\n    <h3>二、我们如何使用 Cookie 和同类技术</h3>\n    <h4>（一）Cookie</h4>\n    <p>为确保网站正常运转，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文\n      件。Cookie 通常包含标识符、站点名称以及一些号码和字符。借助于 Cookie，网站能\n      够存储您的偏好或购物篮内的商品等数据。</p>\n    <p>我们不会将 Cookie 用于本政策所述目的之外的任何用途。您可根据自己的偏好管理或\n      删除 Cookie。您可以清除计算机上保存的所有 Cookie，大部分网络浏览器都设有阻\n      止 Cookie 的功能。但如果您这么做，则需要在每一次访问我们的网站时亲自更改用户设置。</p>\n    <h4>（二）网站信标和像素标签</h4>\n    <p>除 Cookie 外，我们还会在网站上使用网站信标和像素标签等其他同类技术。例如，\n      我们向您发送的电子邮件可能含有链接至我们网站内容的点击 URL。如果您点击该链接\n      ，我们则会跟踪此次点击，帮助我们了解您的产品或服务偏好并改善客户服务。网站信\n      标通常是一种嵌入到网站或电子邮件中的透明图像。借助于电子邮件中的像素标签，我\n      们能够获知电子邮件是否被打开。如果您不希望自己的活动以这种方式被追踪，则可以\n      随时从我们的寄信名单中退订。</p>\n    <h4>（三）Do Not Track（请勿追踪）</h4>\n    <p>很多网络浏览器均设有 Do Not Track 功能，该功能可向网站发\n      布 Do Not Track 请求。目前，主要互联网标准组织尚未设立相关政策\n      来规定网站应如何应对此类请求。但如果您的浏览器启用了 Do Not Track，\n      那么我们的所有网站都会尊重您的选择。</p>\n    <h3>三、我们如何共享、转让、公开披露您的个人信息</h3>\n    <h4>（一）共享</h4>\n    <p>我们不会向其他任何公司、组织和个人分享您的个人信息，但以下情况除外：</p>\n    <p>1、在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。</p>\n    <p>2、我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。</p>\n    <p>3、与我们的关联公司共享：您的个人信息可能会与我们关联公司共享。我们只会共享\n      必要的个人信息，且受本隐私政策中所声明目的的约束。关联公司如要改变个人信息的处\n      理目的，将再次征求您的授权同意。</p>\n    <p>我们的关联公司包括:【无】。</p>\n    <p>4、与授权合作伙伴共享：仅为实现本隐私权政策中声明的目的，我们的某些服务将由授\n      权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户\n      服务和用户体验。例如，我们聘请来提供第三方数据统计和分析服务的公司可能需\n      要采集和访问个人数据以进行数据统计和分析。在这种情况下，这些公司 必须遵\n      守我们的数据隐私和安全要求。我们仅会出于合法、正当、必要、特定、明确的目\n      的共享您的个人信息，并且只会共享提供服务所必要的个人信息。</p>\n    <h4>（二）转让</h4>\n    <p>我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：</p>\n    <p>1、在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让\n      您的个人信息；</p>\n    <p>2、在涉及合并、收购或破产清算时，如涉及到个人信息转让，我们会在要求新的\n      持有您个人信息的公司、组织继续受此隐私政策的约束，否则我们将要\n      求该公司、组织重新向您征求授权同意。</p>\n    <h4>（三）公开披露</h4>\n    <p>我们仅会在以下情况下，公开披露您的个人信息：</p>\n    <p>1、获得您明确同意后；</p>\n    <p>2、基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的\n      情况下，我们可能会公开披露您的个人信息。</p>\n    <h3>四、我们如何保护您的个人信息</h3>\n    <p>（一）我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止\n      数据遭到未经授权访问、公开披露、使用、修改、损坏或丢失。我们会采取一切合\n      理可行的措施，保护您的个人信息。例如，在您的浏览器与“服务”之间交换数\n      据（如信用卡信息）时受 SSL 加密保护；我们同时对我们网站提供 https 安\n      全浏览方式；我们会使用加密技术确保数据的保密性；我们会使用受信赖的保护\n      机制防止数据遭到恶意攻击；我们会部署访问控制机制，确保只有授权人员才可访\n      问个人信息；以及我们会举办安全和隐私保护培训课程，加强员工对于保护个人\n      信息重要性的认识。</p>\n    <p>（二）我们会采取一切合理可行的措施，确保未收集无关的个人信息。我们只会\n      在达成本政策所述目的所需的期限内保留您的个人信息，除非需要延长保留期或受到法律的允许。</p>\n    <p>（三）互联网并非绝对安全的环境，而且电子邮件、即时通讯、及与其他我们\n      用户的交流方式并未加密，我们强烈建议您不要通过此类方式发送个人信息。请\n      使用复杂密码，协助我们保证您的账号安全。</p>\n    <p>（四）互联网环境并非百分之百安全，我们将尽力确保或担保您发送给我们的\n      任何信息的安全性。如果我们的物理、技术、或管理防护设施遭到破坏，导致信\n      息被非授权访问、公开披露、篡改、或毁坏，导致您的合法权益受损，我们将承\n      担相应的法律责任。</p>\n    <p>（五）在不幸发生个人信息安全事件后，我们将按照法律法规的要求，及时向\n      您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措\n      施、您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件\n      相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信\n      息主体时，我们会采取合理、有效的方式发布公告。</p>\n    <p>同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。</p>\n    <h3>五、您的权利</h3>\n    <p>按照中国相关的法律、法规、标准，以及其他国家、地区的通行做法，我们保\n      障您对自己的个人信息行使以下权利：</p>\n    <h4>（一）访问您的个人信息</h4>\n    <p>您有权访问您的个人信息，法律法规规定的例外情况除外。如果您想行使数据\n      访问权，可以通过以下方式自行访问：</p>\n    <p>账户信息——如果您希望访问或编辑您的账户中的个人资料信息和支付信息、更改\n      您的密码、添加安全信息或关闭您的账户等，您可以通过访问执行此类操作。</p>\n    <p>搜索信息——您可以在应用中访问或清除您的搜索历史记录、查看和修改兴趣以\n      及管理其他数据。</p>\n    <h3>六、本隐私权政策如何更新</h3>\n    <p>我们可能适时会对本隐私权政策进行调整或变更，本隐私权政策的任何更新将以\n      标注更新时间的方式公布在我们网站上，除法律法规或监管规定另有强制性规定\n      外，经调整或变更的内容一经通知或公布后的7日后生效。如您在隐私权政策调整\n      或变更后继续使用我们提供的任一服务或访问我们相关网站的，我们相信这代表您\n      已充分阅读、理解并接受修改后的隐私权政策并受其约束。</p>', 0, 1, 1, 1, '1433083559', '1293089741', 1, 1, 1, 100, 1);
COMMIT;

-- ----------------------------
-- Table structure for taojin_orders
-- ----------------------------
DROP TABLE IF EXISTS `taojin_orders`;
CREATE TABLE `taojin_orders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(128) DEFAULT NULL COMMENT '唯一性订单ID',
  `mt_id_user` varchar(64) DEFAULT NULL COMMENT '媒体方平台的用户ID',
  `device_id` varchar(64) DEFAULT NULL COMMENT 'IOS时idfa，安卓时imei',
  `mt_id` varchar(64) DEFAULT NULL COMMENT '媒体ID（即AppId）',
  `id_user` varchar(64) DEFAULT NULL COMMENT '91淘金平台用户ID',
  `user_fee` float(10,2) DEFAULT NULL COMMENT '用户广告单价（奖励金额），单位：元\n\n2位小数点 float 类型，不会乘以自定义汇率，为原始数值',
  `mt_fee` float(10,2) DEFAULT NULL COMMENT '媒体广告单价，单位：元\n\n2位小数点 float 类型，不会乘以自定义汇率，为原始数值',
  `done_time` varchar(14) DEFAULT NULL COMMENT '完成任务时间（秒级整形时间戳格式）',
  `id_task` varchar(64) DEFAULT NULL COMMENT '任务ID（一般用于API数据版接口接入方式）',
  `note` varchar(128) DEFAULT NULL COMMENT '订单备注，【示例】完成任务：麻将大亨-累计赢金50万\n\nPOST传输时中文为UrlEncode编码文本\n\n参与签名时必须先UrlDecode解码文本\n\n最长64字符（不分中英文，注意是字符，不是字节）',
  `sign` varchar(128) DEFAULT NULL COMMENT '签名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for task_image_step
-- ----------------------------
DROP TABLE IF EXISTS `task_image_step`;
CREATE TABLE `task_image_step` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `image` varchar(255) NOT NULL COMMENT '图片',
  `task_id` int(8) NOT NULL COMMENT '任务ID',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图片步骤';

-- ----------------------------
-- Table structure for task_review_field
-- ----------------------------
DROP TABLE IF EXISTS `task_review_field`;
CREATE TABLE `task_review_field` (
  `id` varchar(13) NOT NULL,
  `task_id` int(8) DEFAULT NULL COMMENT '任务ID',
  `name` varchar(255) DEFAULT NULL COMMENT '字段名',
  `placeholder` varchar(255) DEFAULT NULL COMMENT '字段填写提示',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of task_review_field
-- ----------------------------
BEGIN;
INSERT INTO `task_review_field` VALUES ('15746657187', 73, '2邮箱', '请输入邮箱', '1574665718700', '1619238643869');
INSERT INTO `task_review_field` VALUES ('15746657284', 73, '2编号', '请输入编号', '1574665728400', '1619238643869');
INSERT INTO `task_review_field` VALUES ('15751820265', 74, '邮箱', '请输入邮箱', '1575182026500', '1670669202593');
INSERT INTO `task_review_field` VALUES ('15759916111', 75, '邮箱', '请输入你的邮箱', '1575991611100', '1670675431049');
INSERT INTO `task_review_field` VALUES ('15765088569', 76, '金额', '请输入消费总金额', '1576508856900', '1608442766465');
INSERT INTO `task_review_field` VALUES ('15770806449', 77, '金额', '请输入消费金额', '1577080644900', '1608014327586');
INSERT INTO `task_review_field` VALUES ('15771078079', 78, '金额', '请输入消费金额', '1577107807900', '1588348599968');
INSERT INTO `task_review_field` VALUES ('15771086283', 79, '邮箱', '请输入邮箱', '1577108628300', NULL);
INSERT INTO `task_review_field` VALUES ('15771092663', 80, '邮箱', '请输入邮箱', '1577109266300', '1582974958377');
INSERT INTO `task_review_field` VALUES ('15824315631', 86, '账号', '请输入”抖音”账号', '1582431563100', '1583415028912');
INSERT INTO `task_review_field` VALUES ('15937634078', 93, '姓名', '请输入真实姓名', '1593763407800', '1600694237702');
INSERT INTO `task_review_field` VALUES ('16048273233', 116, '姓名', '请输入姓名', '1604827323300', '1604827525964');
INSERT INTO `task_review_field` VALUES ('16048274552', 116, '手机号', '请输入手机号', NULL, '1604827525964');
COMMIT;

-- ----------------------------
-- Table structure for task_review_step
-- ----------------------------
DROP TABLE IF EXISTS `task_review_step`;
CREATE TABLE `task_review_step` (
  `id` varchar(13) NOT NULL,
  `image` varchar(255) DEFAULT NULL COMMENT '截图',
  `text` varchar(1000) DEFAULT '' COMMENT '文字描述',
  `copy_text` varchar(1000) DEFAULT NULL COMMENT '供一键复制的文本内容',
  `is_image_required` smallint(2) DEFAULT '0' COMMENT '图片凭证是否必填。0否；1是',
  `task_id` int(8) DEFAULT NULL COMMENT '任务ID',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务提交审核步骤';

-- ----------------------------
-- Records of task_review_step
-- ----------------------------
BEGIN;
INSERT INTO `task_review_step` VALUES ('15746654080', 'FlVkJZAkYx3wVWqMhf_CnfpMwgFK', '2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图', '2019112501', 0, 73, '1574665408000', '1619238643869');
INSERT INTO `task_review_step` VALUES ('15746656592', 'FstQ_gWcFslxWxNdmgCFc5fdlU9w', '2输入收件人邮箱29155818@qq.com，发送并提供截图', '29155818@qq.com', 0, 73, '1574665659200', '1619238643869');
INSERT INTO `task_review_step` VALUES ('15751818157', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.lS3aRQIQrWWza598a4ea5c13f58e93033bf4d4ae86f4.jpeg', '截图稿件核心内容，并上传', '', 0, 74, '1575181815700', '1670669202593');
INSERT INTO `task_review_step` VALUES ('15751819040', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.PXl9g7Lvva6D3a2ccb38d1f7b7746daa24a445fff1c7.jpeg', '将Word文档发布到邮箱tammeny@qq.com', 'tammeny@qq.com', 0, 74, '1575181904000', '1670669202593');
INSERT INTO `task_review_step` VALUES ('15759915920', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.n5z8Nk2gJWK5056ec5821130803ce9e8681e351982b3.jpg', '发送到邮箱', '123@qq.com', 0, 75, '1575991592000', '1670675431049');
INSERT INTO `task_review_step` VALUES ('15765087317', 'Ftbj_F70QHQmXmXHDwGe8G09Fyny', '拍照并上传小票', '', 0, 76, '1576508731700', '1608442766465');
INSERT INTO `task_review_step` VALUES ('15770806246', 'FgTQPt2lRhvIeJg7k_7Q57ZjeQAX', '在线下任意一家阿强酸菜鱼消费满100元', '', 0, 77, '1577080624600', '1608014327586');
INSERT INTO `task_review_step` VALUES ('15770806367', '', '拍照并上传结账小票', '', 0, 77, '1577080636700', '1608014327586');
INSERT INTO `task_review_step` VALUES ('15771077961', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.TuQO0DllUevZ96a26d51ea9a44b16ce757edab198e6e.png', '拍照并上传购物小票', '', 0, 78, '1577107796100', '1588348599968');
INSERT INTO `task_review_step` VALUES ('15771086078', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.CaXDm4k7vxvnfa71179e03a5a1a37d0a2b60f9eb444a.png', '把商标发送到邮箱alkj@qq.com', 'alkj@qq.com', 0, 79, '1577108607800', NULL);
INSERT INTO `task_review_step` VALUES ('15771092404', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.wHuw5f3C0jbA4d672ed99d3e968dc22fa138817cb7bc.png', '发送psd图标文件到邮箱aslkdjf@qq.com', 'aslkdjf@qq.com', 0, 80, '1577109240400', '1582974958377');
INSERT INTO `task_review_step` VALUES ('15797511027', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.crHXWp2a3tRG711ae90b07c0af41030fa5ba63c854f3.jpg', '将表情图片提交上来', '', 0, 81, '1579751102700', '1579752485524');
INSERT INTO `task_review_step` VALUES ('15797518690', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.yYnj7mkXm89D109efe41297e2d77af7b1497fb12d1ad.jpg', '将表情提交上来', '', 0, 82, '1579751869000', NULL);
INSERT INTO `task_review_step` VALUES ('15819426750', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.gaZVKGubVr3mf4824996d69fad74621b7f05f6ed8cf2.png', '提交商标文件', '', 0, 83, '1581942675000', '1582295591324');
INSERT INTO `task_review_step` VALUES ('15823677281', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', '提交点赞截图', '', 0, 85, '1582367728100', NULL);
INSERT INTO `task_review_step` VALUES ('15824315316', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', '提交点赞截图，体现”抖音”账号', '鲨鱼任务”', 0, 86, '1582431531600', '1583415028912');
INSERT INTO `task_review_step` VALUES ('15834145993', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.Dtg8DqGGaBZtc8b09e90ed6cfc61f58d87e2ab558a2c.jpg', '第三方', '', 0, 87, '1583414599300', '1583414701046');
INSERT INTO `task_review_step` VALUES ('15835578025', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', '提交抖音点赞截图', '', 0, 88, '1583557802500', '1619238989124');
INSERT INTO `task_review_step` VALUES ('15879018603', 'FqvE0evaE8XR1xZZhP70g7cvKyAs', '提供拍照凭证', '', 0, 89, '1587901860300', '1587902719296');
INSERT INTO `task_review_step` VALUES ('15879026239', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.KmngD4ttPjZb056ec5821130803ce9e8681e351982b3.jpg', '提供截图凭证', '', 0, 90, '1587902623900', '1591522867078');
INSERT INTO `task_review_step` VALUES ('15915125995', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.ulqvw6taIoZI0c8bbb822a138849877ebbf3745c7190.jpg', '审核', '', 0, 91, '1591512599500', NULL);
INSERT INTO `task_review_step` VALUES ('15915992496', 'FuC_5Td6jK_kU2fgSDkrSKCzCALa', '提交logo上来', '', 0, 92, '1591599249600', '1591599458829');
INSERT INTO `task_review_step` VALUES ('15937633877', 'FkHELjwEFlc7Ay_hOgVp4U8qFCIt', '提供购买凭证截图', '', 0, 93, '1593763387700', '1600694237702');
INSERT INTO `task_review_step` VALUES ('15938625677', 'FmkdPqrHmU_XVhOROgwoy4Jn3daG', '将头像提交上来', '', 0, 94, '1593862567700', '1608442256620');
INSERT INTO `task_review_step` VALUES ('15938684107', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.k6FBwu6rNoh42b8782284b86f35dc5ae4034dd87872e.png', '提供程序运行截图', '', 0, 95, '1593868410700', '1605516874013');
INSERT INTO `task_review_step` VALUES ('15966006236', 'FoMI2s-MN2KIGyHWlIFCTPdzN3Ve', '测试步骤', '', 0, 96, '1596600623600', NULL);
INSERT INTO `task_review_step` VALUES ('15971348333', 'FiUVSnjjgKbAnlLNkpZ86god4eW2', '测试', '', 0, 97, '1597134833300', '1597135637445');
INSERT INTO `task_review_step` VALUES ('15971350931', 'FiUVSnjjgKbAnlLNkpZ86god4eW2', '测试', '', 0, 99, '1597135093100', NULL);
INSERT INTO `task_review_step` VALUES ('15984263230', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.D0guaLBv8feud9592342bf4adfcc3020f0ce353bd81e.jpg', '1', '', 0, 100, '1598426323000', '1598428770111');
INSERT INTO `task_review_step` VALUES ('15987726048', 'FklOqr4jyR3fjChjvamIyIrvpUqP', '测试', '', 0, 101, '1598772604800', NULL);
INSERT INTO `task_review_step` VALUES ('15987726939', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', '征稿', '', 0, 102, '1598772693900', NULL);
INSERT INTO `task_review_step` VALUES ('15987740628', 'Fl0M6PZEXXWjG7ysxkEJIQlDC-Sa', 'ces', '', 0, 105, '1598774062800', NULL);
INSERT INTO `task_review_step` VALUES ('15987744963', 'FkXSFXNHOHN08Zt-a0ngxqJUlM8Y', '23', '', 0, 106, NULL, NULL);
INSERT INTO `task_review_step` VALUES ('15987747836', 'Ft8vivmmNig5A21pcvYyCpK_ij3l', '123', '', 0, 111, '1598774783600', NULL);
INSERT INTO `task_review_step` VALUES ('15987748620', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', '1', '', 0, 112, '1598774862000', NULL);
INSERT INTO `task_review_step` VALUES ('15990348404', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.MSJ8Nudx0kCwd11abd4cb998a34acc7567ef6ee88db7.png', '测试', '', 0, 113, '1599034840400', '1599036059187');
INSERT INTO `task_review_step` VALUES ('16010189220', 'Fj_-aMi2STJ_VsK2XoH0lwTL1RuT', '测试流水', '', 0, 0, '1601018922000', NULL);
INSERT INTO `task_review_step` VALUES ('16010192426', 'Fj_-aMi2STJ_VsK2XoH0lwTL1RuT', '测试', '', 0, 115, '1601019242600', NULL);
INSERT INTO `task_review_step` VALUES ('16048273019', 'tmp/wxf4c87b29c31aa963.o6zAJs3CGMS3Jek8AoYdXHL3ZnI8.VHyO3d9a27cJcb0e00054ff6a203b0de3303eab3530c.PNG', '上传凭证', '', 0, 116, '1604827301900', '1604827525964');
INSERT INTO `task_review_step` VALUES ('16054506488', 'tmp/wxf4c87b29c31aa963.o6zAJs3CGMS3Jek8AoYdXHL3ZnI8.NyGT9Vcb2pqT7e449c364fda70827d522ab8ba24e9f5.PNG', '提交截图', '', 0, 117, '1605450648800', NULL);
INSERT INTO `task_review_step` VALUES ('16054511486', 'tmp/wxc111265ef0aa5aaa.o6zAJs7uBYASoR7RR4OcME3A0qvw.PywyrIoXvK0E7e449c364fda70827d522ab8ba24e9f5.PNG', '提交截图', '', 0, 118, '1605451148600', NULL);
INSERT INTO `task_review_step` VALUES ('16080142578', '', '获取赏金', '', 0, 77, NULL, '1608014327586');
INSERT INTO `task_review_step` VALUES ('16207547951', 'FqwDNwvTbOYYG8CK_eiEd_9JjGEW', '请输入审核步骤内容', '', 0, 119, '1620754795100', '1620756081141');
INSERT INTO `task_review_step` VALUES ('16328049585', 'tmp/QGs2qkk0cfpqcb3a566f6fc7a02d23e5464f1243f1ab.png', '1', '', 0, 120, '1632804958500', NULL);
COMMIT;

-- ----------------------------
-- Table structure for task_text_step
-- ----------------------------
DROP TABLE IF EXISTS `task_text_step`;
CREATE TABLE `task_text_step` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `text` varchar(1024) NOT NULL COMMENT '文字',
  `copy_text` varchar(255) DEFAULT NULL COMMENT '供复制的内容',
  `images` varchar(1024) DEFAULT NULL COMMENT '步骤图片',
  `task_id` int(8) NOT NULL COMMENT '任务ID',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=572 DEFAULT CHARSET=utf8mb4 COMMENT='文字步骤';

-- ----------------------------
-- Records of task_text_step
-- ----------------------------
BEGIN;
INSERT INTO `task_text_step` VALUES (311, '设计百度公司商标', '', '', 79, '1577108601308');
INSERT INTO `task_text_step` VALUES (325, '设计汤姆猫表情', '', '', 82, '1579751865186');
INSERT INTO `task_text_step` VALUES (327, '设计老鼠相关的表情', '', '', 81, '324');
INSERT INTO `task_text_step` VALUES (344, '设计商标1', '', '', 83, '341');
INSERT INTO `task_text_step` VALUES (345, '设计商标2', '', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.50N9YRD8mFB0056ec5821130803ce9e8681e351982b3.jpg', 83, '342');
INSERT INTO `task_text_step` VALUES (346, '设计3', '', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.TRAaojxxGGKXf4824996d69fad74621b7f05f6ed8cf2.png', 83, '343');
INSERT INTO `task_text_step` VALUES (347, '打开抖音搜索“xxx”，点赞第一条', '', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', 85, '1582367704918');
INSERT INTO `task_text_step` VALUES (363, '设计动物类图标', '', '', 80, '361');
INSERT INTO `task_text_step` VALUES (364, '保存到psd并发送到指定邮箱', '', '', 80, '362');
INSERT INTO `task_text_step` VALUES (375, '阿斯顿发', '', '', 87, '374');
INSERT INTO `task_text_step` VALUES (376, '打开抖音搜索”鲨鱼任务”，点赞第一条抖音', '鲨鱼任务”', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', 86, '373');
INSERT INTO `task_text_step` VALUES (401, '拿快递', '', '', 89, '399');
INSERT INTO `task_text_step` VALUES (408, '在线下任意一家杰克琼斯专卖店消费满1000元', '', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.454W6mBVmoMdbf97fd92258f968da53bbffea5aee83c.png', 78, '406');
INSERT INTO `task_text_step` VALUES (409, '拍照并上传购物小票', '', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.QVeArG2rW3LS96a26d51ea9a44b16ce757edab198e6e.png', 78, '407');
INSERT INTO `task_text_step` VALUES (424, 'test', '', '', 91, '1591512594007');
INSERT INTO `task_text_step` VALUES (427, '拿外卖', '', '', 90, '426');
INSERT INTO `task_text_step` VALUES (431, '根据要求设计logo', '', '', 92, '430');
INSERT INTO `task_text_step` VALUES (438, '测试', '', '', 96, '1596600620744');
INSERT INTO `task_text_step` VALUES (440, '测试', '', '', 99, '1597135086625');
INSERT INTO `task_text_step` VALUES (442, '测试', '', '', 97, '441');
INSERT INTO `task_text_step` VALUES (449, '1', '2', '', 100, '448');
INSERT INTO `task_text_step` VALUES (450, '测试', '', '', 101, '1598772602657');
INSERT INTO `task_text_step` VALUES (451, '征稿', '', '', 102, '1598772688821');
INSERT INTO `task_text_step` VALUES (452, '1123', '', '', 105, '1598774059344');
INSERT INTO `task_text_step` VALUES (453, '1', '', '', 106, '1598774492964');
INSERT INTO `task_text_step` VALUES (454, '1231', '', '', 111, '1598774781864');
INSERT INTO `task_text_step` VALUES (455, '1', '', '', 112, '1598774859467');
INSERT INTO `task_text_step` VALUES (466, '测试', '', '', 113, '465');
INSERT INTO `task_text_step` VALUES (489, '通过官方渠道购买鲨鱼任务悬赏平台', '', '', 93, '488');
INSERT INTO `task_text_step` VALUES (490, '测试流水', '', '', 0, '1601018916329');
INSERT INTO `task_text_step` VALUES (491, '测试', '', '', 115, '1601019239886');
INSERT INTO `task_text_step` VALUES (503, '编写一篇推广文1', '', 'tmp/wxf4c87b29c31aa963.o6zAJs3CGMS3Jek8AoYdXHL3ZnI8.L4MfMsswO7QDcb0e00054ff6a203b0de3303eab3530c.PNG,tmp/wxf4c87b29c31aa963.o6zAJs3CGMS3Jek8AoYdXHL3ZnI8.ThN9saxewmU1126f6059be1093039002c109a8628f04.PNG', 116, '502');
INSERT INTO `task_text_step` VALUES (504, '撰写一篇技术文稿，发送到邮箱', '', '', 117, '1605450636844');
INSERT INTO `task_text_step` VALUES (505, '提交情感类文章', '', '', 118, '1605451142732');
INSERT INTO `task_text_step` VALUES (506, '部署指定程序到服务器', '', 'EWk2y6Bk38ef4drwpmmZ8yirRKRYrjFD.mp4,Fknj_0-MwxetfAgDduorJ62JwD-O', 95, '492');
INSERT INTO `task_text_step` VALUES (511, '在线下任意一家阿强酸菜鱼消费满100元', '', 'FgTQPt2lRhvIeJg7k_7Q57ZjeQAX', 77, '509');
INSERT INTO `task_text_step` VALUES (512, '拍照并上传结账小票', '', 'FgxbWj9-QIZFiY6C60MxRlkMbO2j', 77, '510');
INSERT INTO `task_text_step` VALUES (529, '按要求设计头像', '', '', 94, '437');
INSERT INTO `task_text_step` VALUES (530, '去线下任意一家美宜佳消费', '', 'FsH7jKGUOHI30Sdqp8YCBUNTIo7J', 76, '416');
INSERT INTO `task_text_step` VALUES (531, '索要小票并拍照提交给平台审核', '', 'Ftbj_F70QHQmXmXHDwGe8G09Fyny', 76, '417');
INSERT INTO `task_text_step` VALUES (544, '2将水印图片保存到电脑', 'https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy', 'Fn7DAi7FByWSvtgc1S6LgheJ7Ngy', 73, '542');
INSERT INTO `task_text_step` VALUES (545, '2使用工具去掉图片上的水印', '', '', 73, '543');
INSERT INTO `task_text_step` VALUES (546, '打开抖音搜索xxx', '限女号，打开抖音搜索“6666666666”关注不取关', '', 88, '527');
INSERT INTO `task_text_step` VALUES (547, '点赞第一条抖音', '', '', 88, '528');
INSERT INTO `task_text_step` VALUES (551, '请输入操作步骤内容', '', '', 119, '550');
INSERT INTO `task_text_step` VALUES (552, '1', '', '', 120, '1632804956726');
INSERT INTO `task_text_step` VALUES (567, '撰写情感类稿件并保存到Word文档', '', '', 74, '565');
INSERT INTO `task_text_step` VALUES (568, '将稿件发送到指定邮箱', '', '', 74, '566');
INSERT INTO `task_text_step` VALUES (571, '设计绿巨人3D头像', '', '', 75, '570');
COMMIT;

-- ----------------------------
-- Table structure for task_type
-- ----------------------------
DROP TABLE IF EXISTS `task_type`;
CREATE TABLE `task_type` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '分类名称',
  `review_name` varchar(255) NOT NULL COMMENT '提审分类名',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否；1是',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COMMENT='任务类型';

-- ----------------------------
-- Records of task_type
-- ----------------------------
BEGIN;
INSERT INTO `task_type` VALUES (8, '跑腿', '跑腿', '1574502066629', NULL, 0);
INSERT INTO `task_type` VALUES (9, '征稿', '征稿', '1574502120076', '1574502694534', 0);
INSERT INTO `task_type` VALUES (10, '设计', '设计', '1574502141382', NULL, 0);
INSERT INTO `task_type` VALUES (11, '返利', '返利', '1574502184019', NULL, 0);
COMMIT;

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `sort` smallint(6) DEFAULT '0' COMMENT '排序',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `status` smallint(2) NOT NULL DEFAULT '3' COMMENT '任务状态。1上架；2下架；3待审核；4审核不通过',
  `status_text` varchar(255) DEFAULT NULL COMMENT '审核不通过的原因',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `thumbnail` varchar(255) NOT NULL COMMENT '任务图标',
  `money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '任务金额',
  `description` varchar(2048) DEFAULT NULL COMMENT '描述',
  `labels` varchar(255) DEFAULT NULL COMMENT '任务标签',
  `recommend` smallint(2) DEFAULT '0' COMMENT '是否推荐。0不推荐；1推荐',
  `quantity` int(12) DEFAULT '0' COMMENT '任务数量',
  `grab_quantity` int(12) DEFAULT '0' COMMENT '已领取数量',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否；1是',
  `limited_time` varchar(13) DEFAULT NULL COMMENT '过期时间，单位分钟',
  `type` smallint(6) NOT NULL COMMENT '任务类型',
  `for_review` smallint(2) DEFAULT '0' COMMENT '是否是用于审核',
  `repeatable` smallint(2) DEFAULT '0' COMMENT '是否可重复。0否；1是',
  `vip_repeatable` smallint(2) DEFAULT '0' COMMENT '是否会员可重复领取。0否；1是',
  `need_vip` smallint(2) DEFAULT '0' COMMENT '是否只限会员领取',
  `created_by` int(8) DEFAULT NULL COMMENT '创建人ID',
  `created_from` smallint(2) DEFAULT NULL COMMENT '发布来源。1后台管理；2.微信小程序；3.H5；4.安卓；5.iOS',
  `service_price` decimal(10,2) DEFAULT '0.00' COMMENT '服务费',
  `review_time` varchar(13) DEFAULT NULL COMMENT '审核超时时间',
  `recommend_timeout` varchar(13) DEFAULT '' COMMENT '首页推荐过期时间',
  `top_timeout` varchar(13) DEFAULT '' COMMENT '置顶操作过期时间',
  `vip_money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '会员任务金额',
  `autoend_at` varchar(13) DEFAULT NULL COMMENT '自动下架时间，设为空则不自动下架',
  `client` varchar(32) DEFAULT '1,2,3' COMMENT '适用客户端，多个端用逗号分隔。1.小程序；2.h5；3.安卓；4.iOS',
  `longitude` decimal(10,6) DEFAULT NULL COMMENT '经度',
  `latitude` decimal(10,6) DEFAULT NULL COMMENT '纬度',
  `location_name` varchar(255) DEFAULT NULL COMMENT '位置名称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COMMENT='任务列表';

-- ----------------------------
-- Records of tasks
-- ----------------------------
BEGIN;
INSERT INTO `tasks` VALUES (73, 0, '去掉水印2', 1, '', '1619238643869', '1574665749553', 'Fqog07FhPnwLj-G1e43RV8TIix9D', 3.00, '2去除图片上的水印', '简单,快速审核', 1, 99971, 31, 0, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '1651291200000', '', 5.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (74, 0, '征集情感类稿件', 1, '', '1670669202593', '1575182040901', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.VuzexLT2h08J37425f7ea4f9781e40bc109bbf16038a.jpeg', 2.00, '征集情感相关稿件，字数不少于10000字', '', 1, 10, 3, 0, '60', 9, 0, 1, 0, 0, 10013, 3, 4.60, '1440', '', '', 2.00, '', '1,2,3,4', 113.033695, 23.689883, '菜鸟驿站(清远卧龙五洲世纪城2期南门店)');
INSERT INTO `tasks` VALUES (75, 0, '设计绿巨人3D头像', 1, '', '1670675431049', '1575991625867', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.nD9gej6qNzJZ056ec5821130803ce9e8681e351982b3.jpg', 1.00, '设计绿巨人3D头像', '', 0, 10, 0, 0, '1440', 10, 0, 0, 0, 0, 10013, 3, 0.24, '1440', '', '1615127162761', 1.00, '', '1,2,3,4', 113.406839, 23.166373, '万科云城米酷');
INSERT INTO `tasks` VALUES (76, 0, '美宜佳满10减1', 2, '', '1608442766465', '1576508876552', 'Fitna6aSVrnPJlzqUgmRIMYBdGMM', 1.00, '线下任意一家美宜佳消费满10元减1元', '', 1, 0, 1, 0, '60', 8, 0, 0, 0, 0, 10013, 3, 2.00, '1440', '1618977600000', '', 1.00, '1585713600000', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (77, 0, '阿强酸菜鱼满100减10', 2, '', '1608014327586', '1577080659629', 'Fm2QDyXS1sdk-e8V8uwKNOBQz6KB', 10.00, '在线下任意一家阿强酸菜鱼消费满100元减10元。', '', 1, 0, 2, 1, '60', 11, 0, 0, 0, 0, 10013, 3, 20.00, '1440', '1635559200000', '', 10.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (78, 0, '杰克琼斯满1000元返5元', 2, '', '1588348599968', '1577107886881', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.xyyqWRUv9X9vf0c249e6c1e28a6e59641bd6bebb66fe.png', 5.00, '在线下杰克琼斯专卖店消费满1000元返5元', '立即返回,不受限制,返利任务', 1, 14, 4, 0, '60', 11, 0, 1, 0, 0, 10013, 2, 0.90, '1440', '1619781436000', '', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (79, 0, '商标设计', 1, '', '1577108637528', '1577108637528', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.AVseQcugcUb4fa71179e03a5a1a37d0a2b60f9eb444a.png', 10.00, '设计公司商标', '', 0, 1, 0, 1, '60', 10, 0, 0, 0, 0, 10013, 2, 0.10, '1440', '', '', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (80, 8, '征集动物类图标', 1, '', '1582974958377', '1577109273367', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.LfejYfo5eC4M4d672ed99d3e968dc22fa138817cb7bc.png', 5.00, '征集任意动物类的图标', '', 1, 100, 0, 1, '60', 10, 0, 1, 0, 0, 10013, 2, 5.00, '42', '1647593711000', '1582976616000', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (81, 0, '设计老鼠表情', 1, '', '1579752485524', '1579751120090', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.f8duAhJwjjuC711ae90b07c0af41030fa5ba63c854f3.jpg', 1.00, '设计老鼠相关的表情', '', 0, 0, 0, 1, '1440', 10, 0, 1, 0, 0, 10013, 2, 2.00, '4320', '', '', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (82, 0, '设计汤姆猫表情', 1, '', '1579751884926', '1579751884926', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.k8Erv0hwYb1e109efe41297e2d77af7b1497fb12d1ad.jpg', 1.00, '设计汤姆猫表情', '', 0, 100, 0, 1, '1440', 10, 0, 1, 0, 0, 10013, 2, 2.00, '4320', '', '', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (83, 0, '设计商标1', 4, '', '1582295591324', '1581942684298', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.tGFCXoy1B8s0f4824996d69fad74621b7f05f6ed8cf2.png', 1.00, '设计商标', '', 0, 0, 0, 1, '1', 10, 0, 1, 0, 0, 10013, 2, 2.00, '4320', '', '', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (84, 0, '抖音点赞', 3, NULL, '1582367785705', '1582367785705', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', 1.00, '方便快捷抖音点赞即可获得', '', 0, 100, 0, 1, '120', 8, 0, 0, 0, 0, 10013, 3, 2.00, '10080', '', '', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (85, 0, '抖音点赞', 1, '', '1582367814002', '1582367814002', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', 1.00, '方便快捷抖音点赞即可获得', '', 0, 100, 0, 1, '120', 8, 0, 0, 0, 0, 10013, 3, 2.00, '10080', '', '', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (86, 9, '”抖音”点赞', 3, '', '1583415028912', '1582431675143', 'Fq-YbOMCaP8RQ2l4iPYNu3C6wkQ0', 1.00, '打开”抖音”动动手指即得1元', '', 1, 98, 2, 1, '1440', 11, 0, 1, 0, 0, 10013, 2, 2.00, '4320', '1614405600000', '1583052337009', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (87, 0, '设计', 3, NULL, '1583414701046', '1583414606308', 'tmp/wxf4c87b29c31aa963.o6zAJs7uBYASoR7RR4OcME3A0qvw.uWkeu9nlYI2mc8b09e90ed6cfc61f58d87e2ab558a2c.jpg', 1.00, '阿道夫', '', 0, 10, 0, 1, '60', 8, 0, 0, 0, 0, 10013, 2, 2.00, '1440', 'undefined', '', 0.00, NULL, '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (88, 1, '抖音点赞', 1, '', '1619238989124', '1583557816905', 'FlA0LPW20b3f74T3KicNqN7UUL11', 2.00, '打开抖音点赞即可获得', '', 0, 84, 20, 0, '1440', 11, 0, 0, 0, 0, 10013, 3, 2.04, '4320', 'undefined', '', 2.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (89, 0, '拿快递', 1, '', '1587902719296', '1587901905609', 'FqvE0evaE8XR1xZZhP70g7cvKyAs', 1.00, '去楼下帮我拿个快递', '', 0, 1, 0, 0, '1440', 8, 0, 1, 0, 0, 10013, 3, 2.00, '4320', 'undefined', '', 1.00, NULL, '', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (90, 0, '拿外卖', 2, '', '1591522867078', '1587902635698', 'https://wx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLAYuickCeeVHYAffRxmSlmpxPH66fibgcT6kpQFbDGibe0iaYSy9LthicHscxu75ia5nez1YMHHrZuGk9EA/132', 1.00, '楼下拿外卖', '', 0, 2, 0, 0, '1440', 8, 0, 0, 0, 0, 10013, 2, 2.00, '1440', 'undefined', '', 1.00, '1591660800000', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (92, 0, '设计logo', 3, NULL, '1591599458829', '1591599260369', 'FuC_5Td6jK_kU2fgSDkrSKCzCALa', 1.00, '设计logo', '', 0, 10, 0, 0, '4320', 8, 0, 0, 0, 0, 10013, 3, 2.00, '2880', 'undefined', '', 1.00, '1267459200000', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (93, 1, '鲨鱼任务平台优惠券', 2, '', '1600694237702', '1593763419222', 'FvdSSchzxVTFd0Loaqzw6YMDuF86', 10.00, '向官方购买鲨鱼任务悬赏平台时可抵用', '', 1, 0, 3, 1, '7200', 11, 0, 0, 0, 0, 10013, 3, 1.00, '7200', '1598379377434', '', 10.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (94, 0, '设计头像', 2, '', '1608442256620', '1593862583054', 'https://wx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLAYuickCeeVHYAffRxmSlmpxPH66fibgcT6kpQFbDGibe0iaYSy9LthicHscxu75ia5nez1YMHHrZuGk9EA/132', 1.00, '设计一个符合我气质的头像', '', 1, 0, 4, 1, '2880', 10, 0, 0, 0, 0, 10013, 3, 0.21, '2880', '1607865738992', '1607865745051', 1.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (95, 0, '部署程序到服务器', 2, NULL, '1605516874013', '1593868466273', 'https://wx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLAYuickCeeVHYAffRxmSlmpxPH66fibgcT6kpQFbDGibe0iaYSy9LthicHscxu75ia5nez1YMHHrZuGk9EA/132', 1.00, '部署指定程序到服务器', '', 1, 0, 10, 1, '1440', 8, 0, 0, 0, 0, 10013, 2, 0.20, '1440', '1635566400000', '', 1.00, '1720051200000', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (115, 0, '测试流水', 1, '', '1601019251226', '1601019251226', 'https://wx.qlogo.cn/mmopen/vi_32/MCPTNIeltIcicjBrmLv0HtB7sibupoxHm3VN1ibZLBk5PSVsKib5JW1xVFS096uK9IdN6IzNVTAL0mproWn9aAZC0g/132', 1.00, '测试流水', '', 0, 1, 0, 0, '2880', 8, 0, 0, 0, 0, 10013, 3, 0.02, '2880', 'undefined', '', 1.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (116, 0, '征集一篇推广文1', 1, '', '1604827525964', '1604827367866', 'https://wx.qlogo.cn/mmopen/vi_32/MCPTNIeltIcicjBrmLv0HtB7sibupoxHm3VN1ibZLBk5PSVsKib5JW1xVFS096uK9IdN6IzNVTAL0mproWn9aAZC0g/132', 10.00, '按要求编写一篇推广文1', '', 0, 3, 0, 0, '1440', 9, 0, 1, 0, 0, 10013, 2, 0.10, '1440', 'undefined', '', 10.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (117, 0, '征集技术文稿', 2, '', '1605450672632', '1605450672632', 'https://wx.qlogo.cn/mmopen/vi_32/MCPTNIeltIcicjBrmLv0HtB7sibupoxHm3VN1ibZLBk5PSVsKib5JW1xVFS096uK9IdN6IzNVTAL0mproWn9aAZC0g/132', 1.00, '征集技术文稿', '', 0, 0, 0, 1, '7200', 9, 0, 0, 0, 0, 10013, 2, 0.02, '7200', 'undefined', '', 1.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (118, 0, '征集情感类文章', 1, '', '1605451160776', '1605451160776', 'https://thirdwx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLAOGsZ8MLECBlMj1EtMGUEBCbwNchAU5AwYWVVc5fibNzNiapoibibicUq5h4Art45ibichEVaMQZ1PnkAbg/132', 1.00, '征集情感类文章', '', 0, 0, 0, 0, '4320', 9, 0, 0, 0, 0, 10013, 2, 0.02, '4320', 'undefined', '', 1.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (119, 0, '12324测试', 3, NULL, '1620756081141', '1620754801640', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', 10.00, '似懂非懂', '', 0, 10, 0, 0, '7200', 8, 0, 0, 0, 0, 10029, 2, 2.00, '7200', 'undefined', '', 10.00, '', '1,2,3,4', NULL, NULL, NULL);
INSERT INTO `tasks` VALUES (120, 0, '1', 3, NULL, '1632804975781', '1632804975781', 'https://thirdwx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLAYuickCeeVHYAffRxmSlmpxPH66fibgcT6kpQFbDGibe0iaYSy9LthicHscI8edfDrA2N9VibeFohlib4SQ/132', 1.00, '12', '', 0, 1, 0, 0, '1440', 9, 0, 0, 0, 0, 10031, 2, 0.02, '2880', 'undefined', '', 1.00, '1635379200000', '1,2,3,4', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for time_step
-- ----------------------------
DROP TABLE IF EXISTS `time_step`;
CREATE TABLE `time_step` (
  `id` smallint(5) NOT NULL AUTO_INCREMENT,
  `sort` smallint(4) DEFAULT '1' COMMENT '排序',
  `minute` int(8) DEFAULT '0' COMMENT '实际的分钟数',
  `name` varchar(32) DEFAULT '' COMMENT '时间别名',
  `type` smallint(2) DEFAULT '1' COMMENT '1时间限制；2审核时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COMMENT='时间下拉选择设定';

-- ----------------------------
-- Records of time_step
-- ----------------------------
BEGIN;
INSERT INTO `time_step` VALUES (1, 0, 0, '不限制', 1);
INSERT INTO `time_step` VALUES (2, 1, 60, '1小时', 1);
INSERT INTO `time_step` VALUES (3, 2, 1440, '1天', 1);
INSERT INTO `time_step` VALUES (4, 3, 2880, '2天', 1);
INSERT INTO `time_step` VALUES (5, 4, 4320, '3天', 1);
INSERT INTO `time_step` VALUES (6, 5, 7200, '5天', 1);
INSERT INTO `time_step` VALUES (7, 1, 60, '1小时', 2);
INSERT INTO `time_step` VALUES (8, 2, 1440, '1天', 2);
INSERT INTO `time_step` VALUES (9, 3, 2880, '2天', 2);
INSERT INTO `time_step` VALUES (10, 4, 4320, '3天', 2);
INSERT INTO `time_step` VALUES (11, 5, 7200, '5天', 2);
COMMIT;

-- ----------------------------
-- Table structure for user_fixed_records
-- ----------------------------
DROP TABLE IF EXISTS `user_fixed_records`;
CREATE TABLE `user_fixed_records` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `task_id` int(8) NOT NULL COMMENT '任务ID',
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COMMENT='固定任务完成记录';

-- ----------------------------
-- Records of user_fixed_records
-- ----------------------------
BEGIN;
INSERT INTO `user_fixed_records` VALUES (5, 6, 10003, '1609309838044');
INSERT INTO `user_fixed_records` VALUES (6, 7, 10003, '1609309861390');
INSERT INTO `user_fixed_records` VALUES (7, 3, 10014, '1624775619680');
INSERT INTO `user_fixed_records` VALUES (8, 3, 10013, '1624779267812');
INSERT INTO `user_fixed_records` VALUES (9, 6, 10013, '1633532143496');
INSERT INTO `user_fixed_records` VALUES (10, 11, 10013, '1633532143496');
COMMIT;

-- ----------------------------
-- Table structure for user_fixed_tasks
-- ----------------------------
DROP TABLE IF EXISTS `user_fixed_tasks`;
CREATE TABLE `user_fixed_tasks` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  `task_type` int(2) DEFAULT '1' COMMENT '任务类型。对应fixed_tasks表中的type字段',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_fixed_tasks
-- ----------------------------
BEGIN;
INSERT INTO `user_fixed_tasks` VALUES (6, 10003, 5, '1609309838035');
INSERT INTO `user_fixed_tasks` VALUES (7, 10003, 5, '1609309861387');
INSERT INTO `user_fixed_tasks` VALUES (8, 10029, 4, '1620754801689');
INSERT INTO `user_fixed_tasks` VALUES (9, 10014, 3, '1624775619675');
INSERT INTO `user_fixed_tasks` VALUES (10, 10014, 3, '1624776248772');
INSERT INTO `user_fixed_tasks` VALUES (11, 10013, 3, '1624779267804');
INSERT INTO `user_fixed_tasks` VALUES (12, 10031, 4, '1632804975871');
INSERT INTO `user_fixed_tasks` VALUES (13, 10013, 5, '1633532143477');
COMMIT;

-- ----------------------------
-- Table structure for user_reviews
-- ----------------------------
DROP TABLE IF EXISTS `user_reviews`;
CREATE TABLE `user_reviews` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `images` text COMMENT '用户提交的审核图片，是一个序列化后的json数组，包含图片对应的审核步骤ID',
  `fields` varchar(10000) DEFAULT NULL COMMENT '用户提交的审核字段，是一个序列化后的json数组，包含字段对应的审核字段ID',
  `task_id` int(8) NOT NULL COMMENT '任务ID',
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  `status` smallint(2) NOT NULL COMMENT '1.审核中；2审核通过；3审核失败；4保存草稿',
  `review_by` int(8) DEFAULT NULL COMMENT '审核人',
  `review_role` smallint(2) DEFAULT '1' COMMENT '审核人角色。1用户(发布者)；2管理员',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(1000) DEFAULT NULL COMMENT '备注',
  `task_creator` int(8) DEFAULT NULL COMMENT '任务创建者',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否，1是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='用户提交的任务审核';

-- ----------------------------
-- Records of user_reviews
-- ----------------------------
BEGIN;
INSERT INTO `user_reviews` VALUES (1, '{\"15746654080\":[\"FqXlit0FxHmYTavYuS9UPEJoEpsm\"],\"15746656592\":[\"FpNN0GucPr8StSnJgu2zusysa5ML\"]}', '[{\"id\":\"15746657187\",\"task_id\":\"73\",\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\",\"reviewValue\":\"1\"},{\"id\":\"15746657284\",\"task_id\":\"73\",\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\",\"reviewValue\":\"2\"}]', 73, 10014, 2, 1, 2, '1624775303006', '1624775338939', NULL, 1, 0);
INSERT INTO `user_reviews` VALUES (2, '{\"15746654080\":[\"FpNN0GucPr8StSnJgu2zusysa5ML\"],\"15746656592\":[\"Fq_EZElHhkCJFLVJpGktdz_D1b3c\"]}', '[{\"id\":\"15746657187\",\"task_id\":\"73\",\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\",\"reviewValue\":\"12\"},{\"id\":\"15746657284\",\"task_id\":\"73\",\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\",\"reviewValue\":\"3\"}]', 73, 10014, 2, 1, 2, '1624775609832', '1624775619611', NULL, 1, 0);
INSERT INTO `user_reviews` VALUES (3, '{\"15746654080\":[\"FpNN0GucPr8StSnJgu2zusysa5ML\"],\"15746656592\":[\"Fq_EZElHhkCJFLVJpGktdz_D1b3c\"]}', '[{\"id\":\"15746657187\",\"task_id\":\"73\",\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\",\"reviewValue\":\"1\"},{\"id\":\"15746657284\",\"task_id\":\"73\",\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\",\"reviewValue\":\"23\"}]', 73, 10014, 2, 1, 2, '1624776148742', '1624776248659', NULL, 1, 0);
INSERT INTO `user_reviews` VALUES (4, '{\"15746654080\":[\"FqXlit0FxHmYTavYuS9UPEJoEpsm\"],\"15746656592\":[\"FpNN0GucPr8StSnJgu2zusysa5ML\"]}', '[{\"id\":\"15746657187\",\"task_id\":\"73\",\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\",\"reviewValue\":\"1\"},{\"id\":\"15746657284\",\"task_id\":\"73\",\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\",\"reviewValue\":\"2\"}]', 73, 10013, 2, 1, 2, '1624779257156', '1624779267680', NULL, 1, 0);
COMMIT;

-- ----------------------------
-- Table structure for user_tasks
-- ----------------------------
DROP TABLE IF EXISTS `user_tasks`;
CREATE TABLE `user_tasks` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `task_id` int(8) NOT NULL COMMENT '任务快照ID',
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  `review_id` int(8) DEFAULT NULL COMMENT '审核ID',
  `status` smallint(2) NOT NULL DEFAULT '1' COMMENT '任务状态。1进行中；2.审核中；3已完成；4已过期；5审核失败',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(2000) DEFAULT NULL COMMENT '说明',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否，1是',
  `title` varchar(255) NOT NULL COMMENT '标题',
  `thumbnail` varchar(255) NOT NULL COMMENT '任务图标',
  `money` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '任务金额',
  `description` varchar(2048) DEFAULT NULL COMMENT '描述',
  `labels` varchar(255) DEFAULT NULL COMMENT '任务标签',
  `recommend` smallint(2) DEFAULT '0' COMMENT '是否推荐。0不推荐；1推荐',
  `quantity` int(12) DEFAULT '0' COMMENT '任务数量',
  `grab_quantity` int(12) DEFAULT '0' COMMENT '已领取数量',
  `limited_time` varchar(13) DEFAULT NULL COMMENT '过期时间，单位分钟',
  `type` smallint(6) NOT NULL COMMENT '任务类型',
  `for_review` smallint(2) DEFAULT '0' COMMENT '是否是用于审核',
  `repeatable` smallint(2) DEFAULT '0' COMMENT '是否可重复。0否；1是',
  `vip_repeatable` smallint(2) DEFAULT '0' COMMENT '是否会员可重复。0否；1是',
  `need_vip` smallint(2) DEFAULT '0' COMMENT '是否只限会员领取',
  `created_by` int(8) DEFAULT NULL COMMENT '创建人ID',
  `created_from` smallint(2) DEFAULT NULL COMMENT '发布来源。1后台管理；2.微信小程序；3.H5',
  `service_price` decimal(10,2) DEFAULT '0.00' COMMENT '服务费',
  `review_time` varchar(13) DEFAULT NULL COMMENT '审核超时时间',
  `textStep` text COMMENT '冗余的文字步骤',
  `reviewStep` text COMMENT '冗余的审核步骤',
  `reviewField` text COMMENT '冗余的审核字段',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='用户的任务';

-- ----------------------------
-- Records of user_tasks
-- ----------------------------
BEGIN;
INSERT INTO `user_tasks` VALUES (1, 73, 10013, NULL, 4, '1614780432982', '1614780432982', NULL, 1, '去掉水印2', 'FiCCX-nvTieXJXmg_rs_C-xvrFOK', 5.00, '2去除图片上的水印', '简单,快速审核', 0, 99974, 28, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '[{\"id\":540,\"text\":\"2将水印图片保存到电脑\",\"copy_text\":\"https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"images\":\"Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"task_id\":73,\"created_at\":\"538\"},{\"id\":541,\"text\":\"2使用工具去掉图片上的水印\",\"copy_text\":\"\",\"images\":\"\",\"task_id\":73,\"created_at\":\"539\"}]', '[{\"id\":\"15746654080\",\"image\":\"FlVkJZAkYx3wVWqMhf_CnfpMwgFK\",\"text\":\"2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图\",\"copy_text\":\"2019112501\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665408000\",\"updated_at\":\"1609832698911\"},{\"id\":\"15746656592\",\"image\":\"FstQ_gWcFslxWxNdmgCFc5fdlU9w\",\"text\":\"2输入收件人邮箱29155818@qq.com，发送并提供截图\",\"copy_text\":\"29155818@qq.com\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665659200\",\"updated_at\":\"1609832698911\"}]', '[{\"id\":\"15746657187\",\"task_id\":73,\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1609832698911\"},{\"id\":\"15746657284\",\"task_id\":73,\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1609832698911\"}]');
INSERT INTO `user_tasks` VALUES (2, 73, 10013, NULL, 4, '1614780655827', '1614780655827', NULL, 0, '去掉水印2', 'FiCCX-nvTieXJXmg_rs_C-xvrFOK', 5.00, '2去除图片上的水印', '简单,快速审核', 0, 99974, 28, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '[{\"id\":540,\"text\":\"2将水印图片保存到电脑\",\"copy_text\":\"https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"images\":\"Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"task_id\":73,\"created_at\":\"538\"},{\"id\":541,\"text\":\"2使用工具去掉图片上的水印\",\"copy_text\":\"\",\"images\":\"\",\"task_id\":73,\"created_at\":\"539\"}]', '[{\"id\":\"15746654080\",\"image\":\"FlVkJZAkYx3wVWqMhf_CnfpMwgFK\",\"text\":\"2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图\",\"copy_text\":\"2019112501\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665408000\",\"updated_at\":\"1609832698911\"},{\"id\":\"15746656592\",\"image\":\"FstQ_gWcFslxWxNdmgCFc5fdlU9w\",\"text\":\"2输入收件人邮箱29155818@qq.com，发送并提供截图\",\"copy_text\":\"29155818@qq.com\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665659200\",\"updated_at\":\"1609832698911\"}]', '[{\"id\":\"15746657187\",\"task_id\":73,\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1609832698911\"},{\"id\":\"15746657284\",\"task_id\":73,\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1609832698911\"}]');
INSERT INTO `user_tasks` VALUES (3, 73, 10013, NULL, 1, '1624767628158', '1624767628158', NULL, 1, '去掉水印2', 'Fqog07FhPnwLj-G1e43RV8TIix9D', 3.00, '2去除图片上的水印', '简单,快速审核', 1, 99975, 27, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '[{\"id\":544,\"text\":\"2将水印图片保存到电脑\",\"copy_text\":\"https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"images\":\"Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"task_id\":73,\"created_at\":\"542\"},{\"id\":545,\"text\":\"2使用工具去掉图片上的水印\",\"copy_text\":\"\",\"images\":\"\",\"task_id\":73,\"created_at\":\"543\"}]', '[{\"id\":\"15746654080\",\"image\":\"FlVkJZAkYx3wVWqMhf_CnfpMwgFK\",\"text\":\"2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图\",\"copy_text\":\"2019112501\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665408000\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746656592\",\"image\":\"FstQ_gWcFslxWxNdmgCFc5fdlU9w\",\"text\":\"2输入收件人邮箱29155818@qq.com，发送并提供截图\",\"copy_text\":\"29155818@qq.com\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665659200\",\"updated_at\":\"1619238643869\"}]', '[{\"id\":\"15746657187\",\"task_id\":73,\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746657284\",\"task_id\":73,\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\"}]');
INSERT INTO `user_tasks` VALUES (4, 73, 10013, NULL, 4, '1624768202654', '1624768202654', NULL, 0, '去掉水印2', 'Fqog07FhPnwLj-G1e43RV8TIix9D', 3.00, '2去除图片上的水印', '简单,快速审核', 1, 99975, 27, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '[{\"id\":544,\"text\":\"2将水印图片保存到电脑\",\"copy_text\":\"https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"images\":\"Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"task_id\":73,\"created_at\":\"542\"},{\"id\":545,\"text\":\"2使用工具去掉图片上的水印\",\"copy_text\":\"\",\"images\":\"\",\"task_id\":73,\"created_at\":\"543\"}]', '[{\"id\":\"15746654080\",\"image\":\"FlVkJZAkYx3wVWqMhf_CnfpMwgFK\",\"text\":\"2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图\",\"copy_text\":\"2019112501\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665408000\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746656592\",\"image\":\"FstQ_gWcFslxWxNdmgCFc5fdlU9w\",\"text\":\"2输入收件人邮箱29155818@qq.com，发送并提供截图\",\"copy_text\":\"29155818@qq.com\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665659200\",\"updated_at\":\"1619238643869\"}]', '[{\"id\":\"15746657187\",\"task_id\":73,\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746657284\",\"task_id\":73,\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\"}]');
INSERT INTO `user_tasks` VALUES (5, 73, 10014, 1, 3, '1624775283646', '1624775338939', NULL, 0, '去掉水印2', 'Fqog07FhPnwLj-G1e43RV8TIix9D', 3.00, '2去除图片上的水印', '简单,快速审核', 1, 99974, 28, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '[{\"id\":544,\"text\":\"2将水印图片保存到电脑\",\"copy_text\":\"https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"images\":\"Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"task_id\":73,\"created_at\":\"542\"},{\"id\":545,\"text\":\"2使用工具去掉图片上的水印\",\"copy_text\":\"\",\"images\":\"\",\"task_id\":73,\"created_at\":\"543\"}]', '[{\"id\":\"15746654080\",\"image\":\"FlVkJZAkYx3wVWqMhf_CnfpMwgFK\",\"text\":\"2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图\",\"copy_text\":\"2019112501\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665408000\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746656592\",\"image\":\"FstQ_gWcFslxWxNdmgCFc5fdlU9w\",\"text\":\"2输入收件人邮箱29155818@qq.com，发送并提供截图\",\"copy_text\":\"29155818@qq.com\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665659200\",\"updated_at\":\"1619238643869\"}]', '[{\"id\":\"15746657187\",\"task_id\":73,\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746657284\",\"task_id\":73,\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\"}]');
INSERT INTO `user_tasks` VALUES (6, 73, 10014, 2, 3, '1624775592271', '1624775619611', NULL, 0, '去掉水印2', 'Fqog07FhPnwLj-G1e43RV8TIix9D', 3.00, '2去除图片上的水印', '简单,快速审核', 1, 99974, 28, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '[{\"id\":544,\"text\":\"2将水印图片保存到电脑\",\"copy_text\":\"https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"images\":\"Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"task_id\":73,\"created_at\":\"542\"},{\"id\":545,\"text\":\"2使用工具去掉图片上的水印\",\"copy_text\":\"\",\"images\":\"\",\"task_id\":73,\"created_at\":\"543\"}]', '[{\"id\":\"15746654080\",\"image\":\"FlVkJZAkYx3wVWqMhf_CnfpMwgFK\",\"text\":\"2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图\",\"copy_text\":\"2019112501\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665408000\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746656592\",\"image\":\"FstQ_gWcFslxWxNdmgCFc5fdlU9w\",\"text\":\"2输入收件人邮箱29155818@qq.com，发送并提供截图\",\"copy_text\":\"29155818@qq.com\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665659200\",\"updated_at\":\"1619238643869\"}]', '[{\"id\":\"15746657187\",\"task_id\":73,\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746657284\",\"task_id\":73,\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\"}]');
INSERT INTO `user_tasks` VALUES (7, 73, 10014, 3, 3, '1624776135377', '1624776248659', NULL, 0, '去掉水印2', 'Fqog07FhPnwLj-G1e43RV8TIix9D', 3.00, '2去除图片上的水印', '简单,快速审核', 1, 99973, 29, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '[{\"id\":544,\"text\":\"2将水印图片保存到电脑\",\"copy_text\":\"https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"images\":\"Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"task_id\":73,\"created_at\":\"542\"},{\"id\":545,\"text\":\"2使用工具去掉图片上的水印\",\"copy_text\":\"\",\"images\":\"\",\"task_id\":73,\"created_at\":\"543\"}]', '[{\"id\":\"15746654080\",\"image\":\"FlVkJZAkYx3wVWqMhf_CnfpMwgFK\",\"text\":\"2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图\",\"copy_text\":\"2019112501\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665408000\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746656592\",\"image\":\"FstQ_gWcFslxWxNdmgCFc5fdlU9w\",\"text\":\"2输入收件人邮箱29155818@qq.com，发送并提供截图\",\"copy_text\":\"29155818@qq.com\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665659200\",\"updated_at\":\"1619238643869\"}]', '[{\"id\":\"15746657187\",\"task_id\":73,\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746657284\",\"task_id\":73,\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\"}]');
INSERT INTO `user_tasks` VALUES (8, 73, 10013, 4, 3, '1624779241695', '1624779267680', NULL, 0, '去掉水印2', 'Fqog07FhPnwLj-G1e43RV8TIix9D', 3.00, '2去除图片上的水印', '简单,快速审核', 1, 99972, 30, '120', 10, 0, 1, 0, 0, 1, 1, 0.00, '1', '[{\"id\":544,\"text\":\"2将水印图片保存到电脑\",\"copy_text\":\"https://img.xigu.pro/Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"images\":\"Fn7DAi7FByWSvtgc1S6LgheJ7Ngy\",\"task_id\":73,\"created_at\":\"542\"},{\"id\":545,\"text\":\"2使用工具去掉图片上的水印\",\"copy_text\":\"\",\"images\":\"\",\"task_id\":73,\"created_at\":\"543\"}]', '[{\"id\":\"15746654080\",\"image\":\"FlVkJZAkYx3wVWqMhf_CnfpMwgFK\",\"text\":\"2将去掉水印的图片发送到指定邮箱，并填写编号2019112501，填好内容后提供截图\",\"copy_text\":\"2019112501\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665408000\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746656592\",\"image\":\"FstQ_gWcFslxWxNdmgCFc5fdlU9w\",\"text\":\"2输入收件人邮箱29155818@qq.com，发送并提供截图\",\"copy_text\":\"29155818@qq.com\",\"is_image_required\":0,\"task_id\":73,\"created_at\":\"1574665659200\",\"updated_at\":\"1619238643869\"}]', '[{\"id\":\"15746657187\",\"task_id\":73,\"name\":\"2邮箱\",\"placeholder\":\"请输入邮箱\",\"created_at\":\"1574665718700\",\"updated_at\":\"1619238643869\"},{\"id\":\"15746657284\",\"task_id\":73,\"name\":\"2编号\",\"placeholder\":\"请输入编号\",\"created_at\":\"1574665728400\",\"updated_at\":\"1619238643869\"}]');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) DEFAULT NULL COMMENT '微信openid',
  `openid_type` smallint(2) DEFAULT NULL COMMENT 'openid类型。1小程序；2公众号；3APP',
  `unionid` varchar(100) DEFAULT NULL COMMENT '微信unionid',
  `nick_name` varchar(255) DEFAULT NULL COMMENT '昵称',
  `gender` smallint(2) DEFAULT NULL COMMENT '性别',
  `country` varchar(100) DEFAULT NULL COMMENT '国家',
  `province` varchar(100) DEFAULT NULL COMMENT '省份',
  `city` varchar(100) DEFAULT NULL COMMENT '城市',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `updated_at` varchar(13) DEFAULT NULL COMMENT '更新时间',
  `role` smallint(2) DEFAULT '1' COMMENT '1为普通用户；2内部',
  `deleted` smallint(2) DEFAULT '0' COMMENT '是否已删除。0否；1是',
  `account_amount` decimal(10,2) DEFAULT '0.00' COMMENT '账户余额',
  `finished_amount` decimal(10,2) DEFAULT '0.00' COMMENT '已提金额',
  `withdraw_amount` decimal(10,2) DEFAULT '0.00' COMMENT '提现中的金额',
  `status` smallint(2) DEFAULT '1' COMMENT '用户状态。1.正常;2.冻结',
  `inviter` int(8) DEFAULT NULL COMMENT '邀请者用户ID',
  `username` varchar(128) NOT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `is_certified` smallint(2) DEFAULT '0' COMMENT '是否已通过实名认证，1是；0否',
  `task_limit` smallint(6) DEFAULT NULL COMMENT 'vip用户可领取的任务数量，设为负数则不限制',
  `is_vip` smallint(2) DEFAULT '0' COMMENT '是否是会员',
  `vip_price` decimal(10,2) DEFAULT '0.00' COMMENT '支付的会员费，单位是分',
  `vip_expire_in` varchar(16) DEFAULT NULL COMMENT '会员到期时间',
  `refresh_count` smallint(8) DEFAULT '0' COMMENT '任务刷新次数',
  `phone` varchar(16) DEFAULT NULL COMMENT '手机号',
  `score` int(10) DEFAULT '0' COMMENT '积分',
  `sign_at` varchar(13) DEFAULT NULL COMMENT '上次签到时间',
  `sign_count` int(8) DEFAULT '0' COMMENT '连续签到天数',
  `apple` varchar(64) DEFAULT NULL COMMENT '苹果登录唯一标识',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `email_active` smallint(2) DEFAULT '0' COMMENT '邮箱是否激活',
  `level` smallint(2) DEFAULT '1' COMMENT '用户等级；1普通会员；2合伙人白银；3合伙人砖石；4合伙人至尊；5合伙人荣耀',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username` (`username`) USING BTREE,
  UNIQUE KEY `email` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10034 DEFAULT CHARSET=utf8mb4 COMMENT='用户列表';

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (10013, 'oebsZ43V1a-Ae7g3FjmRvW3Xomvo', NULL, '', '西谷科技', 0, 'China', 'Guangdong', 'Guangzhou', 'Fqog07FhPnwLj-G1e43RV8TIix9D', '1607570185362', '1607570185362', 2, 0, 1017443.20, 68.00, 80.00, 1, NULL, '888', '999', 1, 4, 0, 9.90, '1616227200747', 4, NULL, 17, '1625719638441', 1, NULL, NULL, 0, 2);
INSERT INTO `users` VALUES (10014, 'oebsZ43V1a-Ae7g3FjmRvW3Xomva', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'FlO_ycc1Z_elNAPkxgI_LU6-R7FA', '1607936633522', NULL, NULL, 0, 9998.00, 0.00, 0.00, 1, 10013, 'xiguio', 'Password1', 1, -8, 0, 0.00, NULL, 4, '13622268005', 0, '1634451152867', 1, NULL, NULL, 0, 1);
INSERT INTO `users` VALUES (10015, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1607936871952', NULL, NULL, 0, 14.00, 0.00, 0.00, 1, 10014, 'xigupro', 'Password1', 0, -4, 1, 9.90, '1610615744670', 4, NULL, 0, NULL, 0, NULL, NULL, 0, 1);
INSERT INTO `users` VALUES (10016, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1607939106674', NULL, NULL, 0, 1.00, 0.00, 0.00, 1, NULL, 'shark8', 'Password1', 1, -1, 0, 0.00, NULL, 4, NULL, 0, NULL, 0, NULL, NULL, 0, 1);
INSERT INTO `users` VALUES (10017, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1607939271881', NULL, NULL, 0, 1.00, 0.00, 0.00, 1, NULL, 'shark9', 'Password1', 0, -1, 0, 0.00, NULL, 4, NULL, 0, NULL, 0, NULL, NULL, 0, 1);
INSERT INTO `users` VALUES (10018, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1609309838017', NULL, NULL, 0, 1.00, 0.00, 0.00, 1, 10003, 'xigupropro', 'Password1', 0, -1, 0, 0.00, NULL, 4, NULL, 0, NULL, 0, NULL, NULL, 0, 1);
INSERT INTO `users` VALUES (10019, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1609309861375', NULL, NULL, 0, 1.00, 0.00, 0.00, 1, 10003, 'xigupro2', 'Password1', 0, -1, 0, 0.00, NULL, 4, NULL, 0, NULL, 0, NULL, NULL, 0, 1);
INSERT INTO `users` VALUES (10032, 'o8mvL5KQAYM_BL1M_-BXWQodwzno', 1, '', 'yarn🤡', 1, 'Syrian Arab Republic (the)', '', '', 'https://thirdwx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLC0dTTmU7hNibxFibM2x0F4QegM2OvMqO6qdEYNnkPs883xlXkHqbXMoVcmjUYsBIftianx5e6dP84lg/132', '1633532143409', '1633532143409', 1, 0, 1.00, 0.00, 0.00, 1, 10013, 'psdus6iukoj', 'vsojnzsive', 0, 10, 0, 0.00, NULL, 4, NULL, 0, NULL, 0, NULL, NULL, 0, 1);
INSERT INTO `users` VALUES (10033, 'oebsZ4zEibgEiVNr6RE-l4NOZwMQ', 1, '', 'yarn🎸', 0, '', '', '', 'https://thirdwx.qlogo.cn/mmopen/vi_32/ajNVdqHZLLAYuickCeeVHYAffRxmSlmpxPH66fibgcT6kpQFbDGibe0iaYSy9LthicHscI8edfDrA2N9VibeFohlib4SQ/132', '1670644530116', '1670644530116', 1, 0, 1.00, 0.00, 0.00, 1, NULL, 'oobaumn26y8', '0avmdbfdlqn', 0, 10, 0, 0.00, NULL, 4, NULL, 0, NULL, 0, NULL, NULL, 0, 1);
COMMIT;

-- ----------------------------
-- Table structure for vip_price
-- ----------------------------
DROP TABLE IF EXISTS `vip_price`;
CREATE TABLE `vip_price` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `task_limit` int(8) DEFAULT '-1' COMMENT '任务领取数量限制',
  `type` smallint(2) NOT NULL COMMENT '1.月卡;2.季卡;3.年卡;4.永久卡',
  `is_show` smallint(2) DEFAULT '1' COMMENT '是否展示',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='Vip价目表';

-- ----------------------------
-- Records of vip_price
-- ----------------------------
BEGIN;
INSERT INTO `vip_price` VALUES (1, '月卡', 9.90, -1, 1, 1);
INSERT INTO `vip_price` VALUES (2, '季卡', 25.00, -1, 2, 1);
INSERT INTO `vip_price` VALUES (3, '年卡', 88.00, -1, 3, 1);
INSERT INTO `vip_price` VALUES (4, '永久卡', 888.00, -1, 4, 1);
COMMIT;

-- ----------------------------
-- Table structure for withdraw_money
-- ----------------------------
DROP TABLE IF EXISTS `withdraw_money`;
CREATE TABLE `withdraw_money` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `money` decimal(38,2) DEFAULT NULL COMMENT '提现金额',
  `commission_ratio` decimal(5,2) DEFAULT '0.00' COMMENT '提现费率',
  `user_id` int(8) NOT NULL COMMENT '用户ID',
  `truename` varchar(255) DEFAULT NULL COMMENT '提现人',
  `withdraw_type` varchar(100) DEFAULT NULL COMMENT '提现方式。1.支付宝；2.微信；3.银行卡',
  `withdraw_account` varchar(100) DEFAULT NULL COMMENT '提现账号，可以是微信、支付宝、银行卡号',
  `withdraw_remark` varchar(255) DEFAULT NULL COMMENT '附加信息，如银行卡开户行',
  `withdraw_image` varchar(255) DEFAULT NULL COMMENT '收款二维码',
  `created_at` varchar(13) DEFAULT NULL COMMENT '创建时间',
  `status` smallint(2) DEFAULT NULL COMMENT '处理状态。1.提现中;2.已提现;3.已驳回',
  `handle_at` varchar(13) DEFAULT NULL COMMENT '处理时间',
  `handle_by` varchar(255) DEFAULT NULL COMMENT '处理人',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COMMENT='提现';

-- ----------------------------
-- Records of withdraw_money
-- ----------------------------
BEGIN;
INSERT INTO `withdraw_money` VALUES (8, 10.00, 1.50, 10013, '汤唯', '微信', 'asdfasdf', '', 'Fqog07FhPnwLj-G1e43RV8TIix9D', '1608120542322', 2, '1608120988553', 'admin');
INSERT INTO `withdraw_money` VALUES (9, 10.00, 1.00, 10013, '汤唯', '支付宝', 'dadf@qq.com', '', '', '1608718887324', 1, NULL, NULL);
INSERT INTO `withdraw_money` VALUES (10, 10.00, 1.00, 10013, '汤唯', '支付宝', 'dadf@qq.com', '', '', '1608718888539', 1, NULL, NULL);
INSERT INTO `withdraw_money` VALUES (11, 10.00, 1.00, 10013, '汤唯', '支付宝', 'dadf@qq.com', '', '', '1608719011113', 1, NULL, NULL);
INSERT INTO `withdraw_money` VALUES (12, 10.00, 1.00, 10013, '汤唯', '支付宝', 'dadf@qq.com', '', '', '1608719012381', 1, NULL, NULL);
INSERT INTO `withdraw_money` VALUES (13, 10.00, 1.00, 10013, '汤唯', '支付宝', 'dadf@qq.com', '', '', '1608719021429', 1, NULL, NULL);
INSERT INTO `withdraw_money` VALUES (14, 10.00, 1.00, 10013, '汤唯', '支付宝', 'dadf@qq.com', '', '', '1608719028356', 1, NULL, NULL);
INSERT INTO `withdraw_money` VALUES (15, 10.00, 1.00, 10013, '汤唯', '支付宝', 'dadf@qq.com', '', '', '1608719029609', 1, NULL, NULL);
INSERT INTO `withdraw_money` VALUES (16, 10.00, 1.00, 10013, '汤唯', '支付宝', 'dadf@qq.com', '', 'Fqog07FhPnwLj-G1e43RV8TIix9D', '1608794505727', 1, NULL, NULL);
INSERT INTO `withdraw_money` VALUES (17, 11.00, 1.50, 10013, '汤唯', '支付宝', 'taasd@q.com', '', '', '1625114602020', 2, '1625114631686', 'admin');
INSERT INTO `withdraw_money` VALUES (18, 11.00, 1.50, 10013, '汤唯', '支付宝', 'taasd@q.com', '', '', '1625115175114', 2, '1625115186139', 'admin');
INSERT INTO `withdraw_money` VALUES (19, 10.00, 1.50, 10013, 'asd', '支付宝', 'asdf@qq.com', '', '', '1625157107636', 2, '1625157113668', 'admin');
INSERT INTO `withdraw_money` VALUES (20, 12.00, 1.50, 10013, 'asd', '支付宝', 'asdf@qq.com', '', '', '1625157556093', 2, '1625157564220', 'admin');
INSERT INTO `withdraw_money` VALUES (21, 14.00, 1.50, 10013, 'asd', '支付宝', 'asdf@qq.com', '', '', '1625157570117', 2, '1625157575913', 'admin');
COMMIT;

-- ----------------------------
-- Table structure for xianwan_orders
-- ----------------------------
DROP TABLE IF EXISTS `xianwan_orders`;
CREATE TABLE `xianwan_orders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `adid` int(10) DEFAULT NULL COMMENT '广告ID (adid=1 特殊活动 price=money)',
  `adname` varchar(200) DEFAULT NULL COMMENT '广告名称',
  `appid` varchar(10) DEFAULT NULL COMMENT '开发者ID',
  `ordernum` varchar(100) DEFAULT NULL COMMENT '订单编号',
  `dlevel` int(10) DEFAULT NULL COMMENT '奖励级别',
  `pagename` varchar(100) DEFAULT NULL COMMENT '用户体验游戏的包名',
  `atype` int(10) DEFAULT NULL COMMENT '任务奖励类型（2：等级奖励 9：充值奖励 -1：活动奖励 其他：待定）',
  `deviceid` varchar(100) DEFAULT NULL COMMENT '手机设备号 imei 或 idfa',
  `simid` varchar(100) DEFAULT NULL COMMENT '手机sim卡id',
  `appsign` varchar(100) DEFAULT NULL COMMENT '开发者用户编号（用户id）',
  `merid` varchar(100) DEFAULT NULL COMMENT '用户体验游戏注册的账号id',
  `event` varchar(800) DEFAULT NULL COMMENT '奖励说明—在开发者自己的APP中需显示给用户看，以便用户了解自己获得的奖励',
  `adicon` varchar(100) DEFAULT NULL COMMENT '广告icon图片地址 ；需URL解码',
  `price` varchar(20) DEFAULT NULL COMMENT '闲玩结算给开发者结算单价、单位：元 （最多保留2位小数）',
  `money` varchar(20) DEFAULT NULL COMMENT '开发者需奖励给用户金额 单位：元 （最多保留2位小数）。利润=price-money',
  `itime` date DEFAULT NULL COMMENT '用户获得奖励时间 时间字符串 如：2018/01/24 12:13:24',
  `keycode` varchar(100) DEFAULT NULL COMMENT '订单校验参数 加密规则\nMD5(adid+appid+ordernum+dlevel+deviceid\n+appsign+price+money+key)\n+ 为连接符不做加密 [MD5加密结果需转大写]\nprice与money存在整数的情况，请直接使用传过来的值进行加密或转string后再进行加密校验；避免传值为1但开发者加密的时候却变成1.0的情况出现',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='闲玩订单列表';

-- ----------------------------
-- Table structure for yuwan_orders
-- ----------------------------
DROP TABLE IF EXISTS `yuwan_orders`;
CREATE TABLE `yuwan_orders` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `advert_name` varchar(200) DEFAULT NULL COMMENT '广告名称',
  `reward_rule` varchar(200) DEFAULT NULL COMMENT '用户领取奖励规则标题',
  `stage_id` int(10) DEFAULT NULL COMMENT '广告期数id',
  `stage_num` varchar(512) DEFAULT NULL COMMENT '广告期数信息',
  `advert_icon` varchar(512) DEFAULT NULL COMMENT '广告icon\n',
  `reward_type` varchar(16) DEFAULT NULL COMMENT '1:试玩 2:充值 3.冲刺奖励 4:注册奖励 5:奖励卡奖励(全额给用户)',
  `is_subsidy` int(10) DEFAULT NULL COMMENT '0 否 1 是 新量象平台补贴',
  `media_money` decimal(10,2) DEFAULT NULL COMMENT '媒体方可获取的金额，单位元',
  `reward_user_rate` float(100,3) DEFAULT NULL COMMENT '领取时媒体设置的用户奖励比',
  `currency_rate` float(100,3) DEFAULT NULL COMMENT '媒体设置的媒体币兑换比率',
  `user_money` decimal(10,2) DEFAULT NULL COMMENT '用户领取的金额, 单位元 (userMoney,userCurrency 都可以用来给用户发奖。两者只是单位不同)',
  `user_currency` float(100,4) DEFAULT NULL COMMENT '用户领取的媒体币，(userCurrency = userMoney * currencyRate)',
  `media_user_id` varchar(32) DEFAULT NULL COMMENT '媒体方登录用户ID',
  `received_time` varchar(16) DEFAULT NULL COMMENT '奖励收取时间 (时间戳，单位秒)',
  `order_no` varchar(64) DEFAULT NULL COMMENT '新量象平台唯一订单号',
  `sign` varchar(200) DEFAULT NULL COMMENT '签名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='鱼玩订单列表';

SET FOREIGN_KEY_CHECKS = 1;
