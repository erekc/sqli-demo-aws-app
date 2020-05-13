import sys
sys.path.insert(1, "./sqli-lambda/")
import pymysql
import json

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 fill_db.py <\"create\" or \"delete\">")
        sys.exit()
    op = sys.argv[1]
    credentials = {}
    with open("./sqli-lambda/config.json",) as f:
        credentials = json.load(f)
    host = credentials["host"]
    user = credentials["user"]
    port = credentials["port"]
    password = credentials["password"]
    dbname = credentials["dbname"]
    
    conn = pymysql.connect(host=host,user=user,passwd=password,db=dbname,charset='utf8mb4',cursorclass=pymysql.cursors.DictCursor)
    
    if op == "create":
    
        create_statement = \
            "CREATE TABLE `users` (" +\
                "`username` varchar(255) NOT NULL," +\
                "`password` varchar(255) NOT NULL," +\
                "PRIMARY KEY (`username`)" +\
            ")"
        with conn.cursor() as cursor:
            cursor.execute(create_statement)
    
    elif op == "delete":
        
        delete_statement = "DROP TABLE `users`"
        with conn.cursor() as cursor:
            cursor.execute(delete_statement)
    
    else:
        print("Please specify \"create\" or \"delete\".")