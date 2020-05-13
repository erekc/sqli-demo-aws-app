import json
import pymysql

def lambda_handler(event, context):
    
    """
    To connect to the Database we will load our credentials.
    """
    credentials = {}
    with open("config.json",) as f:
        credentials = json.load(f)
    host = credentials["host"]
    user = credentials["user"]
    port = credentials["port"]
    password = credentials["password"]
    dbname = credentials["dbname"]
    
    """
    Connect to Database.
    """
    conn = pymysql.connect(host=host,user=user,passwd=password,db=dbname,\
        charset='utf8mb4',cursorclass=pymysql.cursors.DictCursor)
    
    """
    Insert user into database.
    """
    username = event["username"]
    password = event["password"]
    success = True
    try:
        with conn.cursor() as cursor:
            sql = "INSERT INTO `users` (`username`, `password`) VALUES (%s, %s)"
            cursor.execute(sql, (username, password))
        conn.commit()
    except pymysql.Error as e:
        print("Error %d: %s" % (e.args[0], e.args[1]))
        success = False
    finally:
        cursor.close()
        return {
            'statusCode': 200,
            'body': {
                "success": str(success)
            }
        }