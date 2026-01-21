# 🎓 PR BOUTIQUE - STUDENT LOGIN SETUP GUIDE
## Google Sheets Backend Authentication System

---

## 📋 **OVERVIEW**

This guide will help you set up a fully functional student login system using Google Sheets as a backend database. No server or hosting required!

---

## 🚀 **SETUP STEPS**

### **STEP 1: Create Google Sheet**

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"PR Boutique Students Database"**
4. In the first sheet, rename it to: **"Students"**
5. Add these column headers in Row 1:

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| email | password | name | course | enrollmentDate | status |

6. Add test student data (Row 2):
```
student@test.com | test123 | Test Student | Online Coaching | 21/01/2026 | active
```

---

### **STEP 2: Set Up Google Apps Script**

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire code from `google-apps-script.js` file
4. Paste it into the Apps Script editor
5. Click the **💾 Save** button (name it: "PR Boutique API")

---

### **STEP 3: Deploy as Web App**

1. In Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure the deployment:
   - **Description:** "PR Boutique Student Portal API"
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone**
5. Click **Deploy**
6. **IMPORTANT:** Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/AKfycbxxx.../exec`)
7. Click **Done**

---

### **STEP 4: Update student.html with API URL**

1. Open `student.html` in your code editor
2. Find this line near the top of the `<script>` section:
```javascript
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```
3. Replace it with your actual Web App URL:
```javascript
const API_URL = 'https://script.google.com/macros/s/AKfycbxxx.../exec';
```
4. Save the file

---

### **STEP 5: Test the Login System**

1. Open `student.html` in a web browser
2. Try logging in with test credentials:
   - **Email:** student@test.com
   - **Password:** test123
3. If successful, you'll be redirected to the dashboard!

---

## 👨‍💼 **HOW TO ADD NEW STUDENTS**

### **Method 1: Manual Entry (Simple)**
1. Open your Google Sheet
2. Add a new row with student information:
   - **email:** student email address
   - **password:** their password (plain text)
   - **name:** full name
   - **course:** "Online Coaching" or "Offline Coaching"
   - **enrollmentDate:** enrollment date (DD/MM/YYYY)
   - **status:** "active" or "inactive"

### **Method 2: Using Register API (Advanced)**
You can create an admin panel that calls the `register` action:
```javascript
const formData = new FormData();
formData.append('action', 'register');
formData.append('email', 'newstudent@example.com');
formData.append('password', 'password123');
formData.append('name', 'New Student');
formData.append('course', 'Online Coaching');

fetch(API_URL, {
    method: 'POST',
    body: formData
});
```

---

## 🔐 **SECURITY FEATURES**

✅ **Session Management** - Uses localStorage to keep users logged in  
✅ **Email Validation** - Validates email format before submission  
✅ **Password Protection** - Password toggle visibility  
✅ **Activity Logging** - All login attempts are logged in "ActivityLog" sheet  
✅ **Status Check** - Inactive accounts cannot login  
✅ **Forgot Password** - Sends password via email  

---

## 📊 **GOOGLE SHEET STRUCTURE**

### **Students Sheet**
- Stores all student credentials and information
- Columns: email, password, name, course, enrollmentDate, status

### **ActivityLog Sheet** (Auto-created)
- Automatically tracks all login attempts
- Columns: timestamp, email, action, result

---

## 🎯 **FEATURES IMPLEMENTED**

### ✅ **Login Page** (`student.html`)
- Beautiful UI with animations
- Email/password authentication
- Remember me checkbox
- Forgot password functionality
- Loading states
- Error/success messages
- Redirects to dashboard on success

### ✅ **Student Dashboard** (`student-dashboard.html`)
- Welcome message with student name
- Course information display
- Enrollment date
- Account status
- Course materials section (ready for content)
- Support buttons (WhatsApp, Call, Email)
- Logout functionality

### ✅ **Google Apps Script Backend** (`google-apps-script.js`)
- Login API endpoint
- Register API endpoint (for admin)
- Forgot password with email
- Get student data endpoint
- Activity logging
- Error handling

---

## 🔄 **HOW IT WORKS**

1. **Student visits login page** → `student.html`
2. **Enters credentials** → Email & Password
3. **Frontend sends request** → Google Apps Script API
4. **Backend checks database** → Google Sheet
5. **Returns response** → Success or Error
6. **If successful** → Store data in localStorage
7. **Redirect to dashboard** → `student-dashboard.html`
8. **Dashboard loads** → Fetches data from localStorage
9. **Student accesses content** → Course materials, videos, etc.

---

## 📱 **FORGOT PASSWORD FLOW**

1. Student clicks "Forgot Password?"
2. Enters email address in prompt
3. System checks if email exists
4. Sends password to email via Gmail
5. Student receives email with password
6. Can login with received password

---

## 🎨 **CUSTOMIZATION OPTIONS**

### **Change Colors**
Edit CSS variables in both HTML files:
```css
--primary-red: #DC143C;
--dark-red: #8B0000;
--gold: #FFD700;
```

### **Add Course Materials**
In `student-dashboard.html`, replace the "Coming Soon" links with actual content:
```html
<a href="videos.html" class="btn-access">
    Access Videos <i class="fas fa-arrow-right"></i>
</a>
```

### **Modify Sheet Name**
In `google-apps-script.js`:
```javascript
const SHEET_NAME = 'Students'; // Change this
```

---

## 🐛 **TROUBLESHOOTING**

### **Problem: "Please configure your Google Apps Script URL"**
**Solution:** Update the `API_URL` in `student.html` with your Web App URL

### **Problem: Login not working**
**Solutions:**
- Check if Web App is deployed with "Anyone" access
- Verify student data exists in Google Sheet
- Check browser console for errors (F12)
- Ensure email/password match exactly (case-sensitive)

### **Problem: "Authorization required"**
**Solution:** 
- Redeploy the Web App
- Make sure "Execute as" is set to "Me"
- Grant necessary permissions when prompted

### **Problem: Forgot password not sending email**
**Solution:** 
- Gmail must be enabled for your Google account
- Check spam folder
- Verify email address is correct in sheet

### **Problem: Dashboard showing "Loading..."**
**Solution:**
- Clear browser cache and localStorage
- Login again
- Check browser console for errors

---

## 🎓 **ADDING MORE FEATURES**

### **Want to add video content?**
1. Upload videos to Google Drive
2. Get shareable links
3. Add links to dashboard
4. Store video access permissions in sheet

### **Want to track progress?**
1. Add "progress" column to sheet
2. Update progress via API calls
3. Display progress on dashboard

### **Want email notifications?**
1. Use `MailApp.sendEmail()` in Apps Script
2. Send welcome emails on registration
3. Send reminders for assignments

---

## 💡 **NEXT STEPS**

1. ✅ Set up Google Sheet
2. ✅ Deploy Apps Script
3. ✅ Update API URL in student.html
4. ✅ Test login system
5. 📝 Add real student data
6. 🎥 Upload course videos
7. 📄 Add study materials
8. 📧 Configure email notifications
9. 🎨 Customize branding
10. 🚀 Launch to students!

---

## 📞 **NEED HELP?**

If you encounter any issues:
1. Check the browser console (F12) for errors
2. Verify Google Sheet structure matches exactly
3. Ensure Apps Script is deployed correctly
4. Test with different browsers
5. Check Google Apps Script execution logs

---

## 🎉 **CONGRATULATIONS!**

You now have a fully functional student login system with:
- ✅ Secure authentication
- ✅ User dashboard
- ✅ Session management
- ✅ Password recovery
- ✅ Activity logging
- ✅ FREE hosting (no server costs!)

**Start adding your students and course content!** 🚀
