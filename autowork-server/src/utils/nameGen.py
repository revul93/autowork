import secrets

names = ['Marid Hanif', 'Nazih Ismael', 'Tarneem Ghazi', 'Shakeeba Salahuddin', 'Haemah Zahra',  \
         'Rawhiyah Sadiq', 'Reyhan Assaf', 'Shumaila Srour', 'Rukan Ayoob', 'Hasan Nasser', \
         'Siraj Rauf', 'Sohali Hashmi', 'Jimell Amin', 'Jalal Abdulhai']

# Samia Rahman', 'Hasaan Begum', 'Sharleez Galla', 'Ibrahim Bahri']

def get_employees(staff_id):
  for i in range(len(names)):
    print ("""const {} = await Employee.create({{
  name: '{}',
  staff_id: {},
  email: '{}@example.com',
  role_id: .id,
}});""".format( \
        names[i].replace(' ', ''), names[i], staff_id + i, \
              names[i].replace(' ', '.').lower() ))

def get_users():
  result = ''
  for name in names:
    print("""{{
  username: '{}',
  password: '{}',
  employee_id: {}.id,
}},""".format(name.replace(' ', '.').lower(), \
                secrets.token_urlsafe(8), name.replace(' ', '')))
    
#get_employees(102210)
get_users()