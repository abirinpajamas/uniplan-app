import re
import requests
from bs4 import BeautifulSoup
import csv
import mysql.connector  # Import the MySQL connector
import time 


try:
    from database import conn  # Import the database connection from database.php
except ImportError:
    # Handle the case where database.php is not found or doesn't define 'conn'
    print("Error: Could not import database connection from database.py.  Make sure database.py exists and defines 'conn'.")
    conn = None # set conn to None so the rest of the script does not throw errors.



# URL of faculty page
faculty_urls = ['https://www.northsouth.edu/faculty-members/shss/eml/','https://www.northsouth.edu/faculty-members/shss/eml/?page=2','https://www.northsouth.edu/faculty-members/shss/eml/?page=3','https://www.northsouth.edu/faculty-members/shss/eml/?page=4','https://www.northsouth.edu/faculty-members/shss/eml/?page=5','https://www.northsouth.edu/faculty-members/shss/eml/?page=6']

faculty_data = []

for url in faculty_urls:
    print(f"Scraping: {url}")
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    """    
    faculty_elements = soup.select('div.faculty-excerpt')
    for element in faculty_elements:
        name_element = element.select_one('h4 a')
    """ 
    faculty_elements = soup.select('div.listview-item-body')
    for element in faculty_elements:
        name_element = element.select_one('h2.listview-item-heading strong a')   
        if name_element:
            full_name_with_initial = name_element.text.strip()
            parts = full_name_with_initial.split('[')
            name = parts[0].strip() if parts else ''
            initial = parts[1].strip(']') if len(parts) > 1 else None
            parts = name.split(' ')
            fname = parts[0] if len(parts) < 3 else parts[0] + ' ' + parts[1]
            lname = parts[1] if len(parts) < 3 else parts[2]
            faculty_data.append({
                'full_text': full_name_with_initial,
                'fname': fname,
                'lname': lname,
                'initial': initial
            })
            print(f"Extracted: {name} (Initial: {initial})")
    time.sleep(1)

for each in faculty_data:
    print(f"FName: {each['fname']},Lname:{each['lname']} Initial: {each['initial']}")


print(f"Extracted {len(faculty_data)} faculty members")




if conn is None:
    print("Skipping database insertion because there is no valid database connection.")
    exit()

cursor = conn.cursor()
query = """
INSERT INTO faculties (department_idno, fname,lname, faculty_initial)
VALUES (14, %s,%s,%s)
"""
try:
    for faculty in faculty_data:
        if faculty['initial'] is None:
           continue
        values = (faculty['fname'], faculty['lname'], faculty['initial'])
        cursor.execute(query, values)
    conn.commit()
    print(f"Successfully inserted {len(faculty_data)} faculty members into the database.")
except mysql.connector.Error as err:
    print(f"Error inserting data into the database: {err}")
    conn.rollback()  # Rollback changes on error
finally:
    cursor.close()