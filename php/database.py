import mysql.connector

conn = mysql.connector.connect(
    host="localhost",  # Replace with your database host
    user="root",  # Replace with your database username
    password="",  # Replace with your database password
    database="uniplan"  # Replace with your database name
)
if conn.is_connected():
    print("Connected to MySQL database")