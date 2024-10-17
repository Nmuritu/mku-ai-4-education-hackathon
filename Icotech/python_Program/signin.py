import tkinter as tk
from tkinter import ttk
from tkinter import messagebox as Msgbox
from tkinter import simpledialog as Dialog

root = tk.Tk()

root.title('STUDENT LOGIN IN')
root.geometry("500x800")

# create a label
label = tk.Label(root, text ='Enter your student cridentials to access all projects.',height = 3)
label.pack()

# create a label
label1 = tk.Label(root, text ='Username: ')
label1.pack()

# create an Entry widget for user to enter their data
entry1 = tk.Entry(root)
entry1.pack()

# create a Label
label2 =tk.Label(root, text = 'password: ')
label2.pack()

# Create an Entry widget for user to enter their data
entry2 =tk.Entry(root, show = '*')
entry2.pack()

# Create a Label
label3 = tk.Label(root, height = 5, text = '')
label3.pack()

# Create scrollbar
scroll = tk.Scrollbar(root)


# Create spinbox
S = tk.Spinbox(root)

# Create a check button
check1 = tk.IntVar()
checkbutton1 = tk.Checkbutton(root, height = 4, text =\
'I agree to the Terms and Conditions of use of this application.',\
onvalue = 1, offvalue = 0, padx = 25, variable = check1)
checkbutton1.pack()

def login():
    username = entry1.get()
    password = entry2.get()
    if username != '' and password != '':
        s = 0
        try:
            input = open('Signin.txt','r')
            for line in input:
                content = line.split(',')
                if content[0] == signup:
                    input.close()
                    return content[1]
            input.close
            return'-1'
        except IOError:
            input.close()
            s = s + 1
            if s == 1:
                print("Enter the correct password or username")
            else:
                print("Wrong signin details")
                return'-1'
                input.close()
    else:
        Msgbox.showerror('You did not enter a password or username try again')

def signup():
    default_username = 'makopolo'
    default_password = 'Makopolo'
    tkMsgbox3 = Msgbox.askyesno('LOGIN CONFIRMATION',\
                'Click on Yes to proceed. Click on No to qiut the program.')

    if check1.get() == 1:
        p = 0
        p = ''

        Username = entry1.get()

        password = entry2.get()
        class UserAccount:
            p = ''
            def init(self, username, default_password='Makopolo'):
                self.username = 'makopolo'
                self.password = default_password
                print(f"Account created for {self.username} with default password.")

            def change_password(self):
                current_password = input("Enter your current password: ")
                if current_password == self.password:
                    new_password = input("Enter a new password: ")
                    confirm_password = input("Confirm new password: ")
                    if new_password == confirm_password:
                        self.password = new_password
                        print("Password changed successfully!")
                    else:
                        print("Passwords do not match. Try again.")
                else:
                    print("Incorrect current password.")

            if Username == 'makopolo':
                new_username =  x = Dialog.askstring('Username','Enter a new username')
                if new_username == '':
                    tkMsgbox = Msgbox.showwarning('ACCESS DENIED',\
                            'please create a new username.')
                    label.config(fg = 'red',
                                        text = p)
                else:
                    if password == 'Makopolo':
                        new_password =  y = Dialog.askstring('Password','Enter a new password',show = '*')
                        confirm_password = Dialog.askstring('Password Confirmation','Please confirm password', show = '*')
                        if new_password == '':
                            tkMsgbox = Msgbox.showwarning('ACCESS DENIED',\
                                        'please create a new password.')
                            label.config(fg = 'red',
                                                text = p)
                        else:
                            if new_password == confirm_password:
                                self.password = new_password
                                MsgBox.showinfo('Paswword',\
                                    'Pasword changed successfully!')
                                if new_username != '' and new_password != '':
                                    s = 0
                                    input = open('Signin.txt','w')
                                    input.close()
                                    s = s + 1
                                    if s == 1:
                                        Msgbox.showerror("Sorry',\
                                            'Enter the correct password or username")
                                    else:
                                        Msgbox.showwarning('Oops',\
                                            'Wrong signin details')

                                    p = p + 'Access Granted'
                                    label3.config(fg = 'green',
                                                        text = p)
                                else:
                                    tkMsgbox1 = Msgbox.showwarning('ACCESS DENIED',\
                                                'Please enter the correct log in information.')
                                    label3.config(fg= 'red',
                                                    text = p)
                            else:
                                Msgbox.showerror('Passwords do not match.Please try again')
                    else:
                        p = p+'\nAccess Denied: Password'
            else:
                p = p + '\nAccess Denied: Username'
    else:
        label3.config(fg = 'red', text = 'Access denied: Terms and Conditions')
        tkMsgbox2 = Msgbox.showerror('TERMS AND CONDITIONS',\
            '\nYou must accept the terms and conditions in order to proceed')

    if tkMsgbox3 == True:
        pass
    else:
        tkMsgbox4 = Msgbox.showinfo('Exit Program',\
                        'The program will now shutdown Goodbye.')
        root.destroy()
        user.change_password()



# create click button
button = tk.Button(root, text = 'SIGN UP', command = signup)
button.pack()

# create click button
button = tk.Button(root, text ='LOGIN', command = login)
button.pack()


root.mainloop()