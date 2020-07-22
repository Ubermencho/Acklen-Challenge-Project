CREATE SCHEMA collectiontrackerdb;
CREATE USER 'usercollectiontracker'@'localhost' identified with mysql_native_password by 'collectiontracker';
GRANT ALL ON collectiontrackerdb.* to  'usercollectiontracker'@'localhost';
use collectiontrackerdb;

CREATE TABLE `users`(
`userID` bigint NOT NULL auto_increment,
`userEmail` varchar(50) NOT NULL UNIQUE,
`userPassword` varchar(100) NOT NULL,
PRIMARY KEY (`userID`),
UNIQUE KEY `userID_UNIQUE`(`userID`)
)ENGINE=InnoDB DEFAULT charset=latin1;

CREATE TABLE `collections`(
`collectionID`  bigint NOT NULL auto_increment,
`creatorID` bigint NOT NULL,
`title` nvarchar(100) NOT NULL,
`Description` nvarchar(250) NOT NULL,
`Picture` longblob,
`extras` nvarchar(100),
`state` int NOT NULL,
PRIMARY KEY (`collectionID`),
UNIQUE KEY `collectionID_UNIQUE`(`collectionID`),
KEY `creatorID` (`creatorID`),
CONSTRAINT `creatorID` FOREIGN KEY (`creatorID`) REFERENCES `users`(`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
)ENGINE=InnoDB DEFAULT charset=latin1;

CREATE TABLE `items`(
`itemID` bigint NOT NULL auto_increment,
`itemName` nvarchar(50) NOT NULL,
`itemDescription` nvarchar(150) NOT NULL,
`itemValue` decimal(13,2) NOT NULL,
`itemCondition` varchar(30) NOT NULL,
`picture` longblob,
`collectionID` bigint NOT NULL,
PRIMARY KEY (`itemID`),
UNIQUE KEY `itemID_UNIQUE`(`itemID`),
KEY `collectionID`(`collectionID`),
CONSTRAINT `collectionID` FOREIGN KEY (`collectionID`) REFERENCES `collections`(`collectionID`) ON DELETE NO ACTION ON UPDATE NO ACTION 
)ENGINE=InnoDB DEFAULT charset=latin1;

