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
    Get all users from database.
    """
    result = None
    success = True
    try:
        with conn.cursor() as cursor:
            sql = "SELECT * FROM `users`"
            cursor.execute(sql)
            result = cursor.fetchall()
            print(result)
            usernames = []
            passwords = []
            for user in result:
                usernames.append(user["username"])
                passwords.append(user["password"])
            result = {
                "users": usernames,
                "passwords": passwords
            }
            
    except pymysql.Error as e:
         print("Error %d: %s" % (e.args[0], e.args[1]))
         success = False
    finally:
        cursor.close()
        if success:
            return {
                'body': {
                    "success": "True",
                    "users": result
                }
            }
        else:
            return {
                'body': {
                    "success": "False"
                }
            }