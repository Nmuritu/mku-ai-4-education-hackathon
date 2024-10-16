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
    tkMsgbox3 = Msgbox.askyesno('LOGIN CONFIRMATION',\
                'Click on Yes to proceed. Click on No to qiut the program.')

    if check1.get() == 1:

        p = ''

        Username = entry1.get()

        password = entry2.get()

        if Username == 'Tiktaalik':
            pass
        else:
            p = p + '\nAccess Denied: Username'

        if password == 'Obagina_123':
            pass
        else:
            p = p+'\nAccess Denied: Password'

        if Username == 'Tiktaalik' and password == 'Obagina_123':
            p = p + 'Access Granted'
            label3.config(fg = 'green',
                                text = p)                   
        else:
            tkMsgbox1 = Msgbox.showwarning('ACCESS DENIED',\
                        'Please enter the correct log in information.')
            label3.config(fg= 'red',
                            text = p)
                            
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

# create click button
button = tk.Button(root, text ='LOGIN', command = login)
button.pack()


root.mainloop()