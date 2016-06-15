<?php
class ApplicationPaperTradeSample // As you defined in metadata.json
{
	public static function call($method, $args) {
		/*if (method_exists($this, $method) && is_callable(array($this, $method))) {
			call_user_func(array($method, $args));
		} else {
			throw new Exception("Method is not implemented yet!");
		}*/
		
		$dbHost = "127.0.0.1";
		$dbUser = "root";
		$dbPassword = "mysql";
		$dbName = "papertradesample";
		$response = array('success' => false, 'data' => null);
		
		$dbCon = mysqli_connect($dbHost,$dbUser,$dbPassword,$dbName);
		
		if ($dbCon->connect_error) {
			throw new Exception('Connect Error ' . $dbCon->connect_errno . ': ' . $dbCon->connect_error);
		}
		 
		$dbCon->set_charset('utf8');
		
		if ( $method === 'addUser' ) {
	        $query = "INSERT INTO users (empid,name,username,email) VALUES ('{$args['EmpID']}','{$args['UserName']}','{$args['UserUsername']}','{$args['UserEmails']}');";
	        
	        mysqli_query($dbCon, $query);
	        
	        $response['success'] = true;
	        $response['data'] = mysqli_insert_id($dbCon);
	        
			return $response;
		} elseif ($method === 'listUser') {
			$query = "SELECT * FROM users;";
			 
			$result = mysqli_query($dbCon, $query);
			
			if (!$result) {
				$response['success'] = false;
				$response['message'] = "Could not successfully run query ($query) from DB: " . mysqli_error($dbCon);
			}
			
			if (mysqli_num_rows($result) == 0) {
				$response['success'] = false;
				$response['message'] = "No rows found, nothing to print so am exiting";
			}
			
			$rowCnt=0;
			while ($row = mysqli_fetch_assoc($result)) {
				$userList[$rowCnt]['id'] =  $row["id"];
				$userList[$rowCnt]['EmpID'] =  $row["empid"];
				$userList[$rowCnt]['UserName'] =  $row["name"];
				$userList[$rowCnt]['UserUsername'] =  $row["username"];
				$userList[$rowCnt]['UserEmails'] =  $row["email"];
				$rowCnt++;
			}
			
			mysqli_free_result($result);
			
			$response['success'] = true;
			$response['data'] = $userList;
			
			return $response;
		} else {
			throw new Exception("Method is not implemented yet!");
		}

		return false;
	}
}