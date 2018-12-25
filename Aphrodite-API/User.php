<?php
$dbms='mysql';     //数据库类型
$host='172.16.21.6:3306'; //数据库主机名
$dbName='Aphrodite';    //使用的数据库
$user='root';      //数据库连接用户名
$pass='Bakerstreet@221B';          //对应的密码
$dsn="$dbms:host=$host;dbname=$dbName";

function GetAllUsers() {
 	// 创建连接
 	global $dsn, $user, $pass;
	try {
	    	$dbh = new PDO($dsn, $user, $pass); //初始化一个PDO对象
		    $statement = $dbh->prepare("SELECT * FROM User");
		    $statement->execute();

		    $results = $statement->fetchAll(PDO::FETCH_ASSOC);
		    
	    $dbh = null;
	    return $results;
		} catch (PDOException $e) {
	    	die ("Error!: " . $e->getMessage() . "<br/>");
	}
}
?>