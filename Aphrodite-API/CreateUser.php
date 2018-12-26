<?php
$dbms='mysql';     //数据库类型
$host='172.16.21.6:3306'; //数据库主机名
$dbName='Aphrodite';    //使用的数据库
$user='root';      //数据库连接用户名
$pass='Bakerstreet@221B';          //对应的密码
$dsn="$dbms:host=$host;dbname=$dbName";

function CreateUser($event, $context) {
 	// 创建连接
 	global $dsn, $user, $pass;
	try {
	    	$dbh = new PDO($dsn, $user, $pass); //初始化一个PDO对象
            $createUserRequestBody = json_decode($event->body);
            $userName = $createUserRequestBody->name;
            $password = $createUserRequestBody->password;
            $dt = new DateTime();
    		$dateTimeNow = $dt->format('Y-m-d H:i:s');
            print_r("create user " . $userName . " at " . $dateTimeNow);
		    $b=$dbh->prepare("INSERT INTO User (created_date, last_login_time, name, password) VALUES (:dateTimeNow, null, :userName, :password)");
            $executionResult = $b->execute(array(':dateTimeNow'=>$dateTimeNow,':userName'=>$userName,':password'=>$password));

	        $dbh = null;
            $result = (object) [
                'Insert User Successfully: ' => $executionResult,
            ];
	    return $result;
		} catch (PDOException $e) {
	    	die ("Error!: " . $e->getMessage() . "<br/>");
	}
}
?>