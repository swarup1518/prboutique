// ============================================
// PR BOUTIQUE - GOOGLE APPS SCRIPT BACKEND
// ============================================
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Delete any existing code
// 4. Paste this entire code
// 5. Click Deploy > New Deployment
// 6. Select "Web app"
// 7. Set "Execute as" to "Me"
// 8. Set "Who has access" to "Anyone"
// 9. Click Deploy and copy the Web App URL
// ============================================

// Configuration
const SHEET_NAME = 'Students'; // Change this to your sheet name
const ADMIN_EMAIL = 'prboutique.trainingpvtld@gmail.com'; // Admin notification email

// Main function to handle POST requests
function doPost(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'login') {
      return handleLogin(e);
    } else if (action === 'register') {
      return handleRegister(e);
    } else if (action === 'forgotPassword') {
      return handleForgotPassword(e);
    } else if (action === 'getStudentData') {
      return handleGetStudentData(e);
    }
    
    return createResponse(false, 'Invalid action');
  } catch (error) {
    return createResponse(false, 'Server error: ' + error.message);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService.createTextOutput('PR Boutique Student Portal API is running!');
}

// ============================================
// LOGIN HANDLER
// ============================================
function handleLogin(e) {
  const email = e.parameter.email;
  const password = e.parameter.password;
  
  if (!email || !password) {
    return createResponse(false, 'Email and password are required');
  }
  
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  // Skip header row, start from row 1
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowEmail = row[0];
    const rowPassword = row[1];
    const rowName = row[2];
    const rowCourse = row[3];
    const rowEnrollmentDate = row[4];
    const rowStatus = row[5];
    
    if (rowEmail === email) {
      if (rowStatus === 'inactive') {
        return createResponse(false, 'Your account is inactive. Please contact us.');
      }
      
      if (rowPassword === password) {
        // Login successful
        const studentData = {
          email: rowEmail,
          name: rowName,
          course: rowCourse,
          enrollmentDate: formatDate(rowEnrollmentDate),
          status: rowStatus
        };
        
        // Log login activity
        logActivity(email, 'login', 'success');
        
        return createResponse(true, 'Login successful', studentData);
      } else {
        // Wrong password
        logActivity(email, 'login', 'failed - wrong password');
        return createResponse(false, 'Invalid password');
      }
    }
  }
  
  // Email not found
  return createResponse(false, 'Email not found. Please contact us to enroll.');
}

// ============================================
// REGISTER HANDLER (For Admin Use)
// ============================================
function handleRegister(e) {
  const email = e.parameter.email;
  const password = e.parameter.password;
  const name = e.parameter.name;
  const course = e.parameter.course;
  
  if (!email || !password || !name || !course) {
    return createResponse(false, 'All fields are required');
  }
  
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  // Check if email already exists
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      return createResponse(false, 'Email already registered');
    }
  }
  
  // Add new student
  const enrollmentDate = new Date();
  sheet.appendRow([email, password, name, course, enrollmentDate, 'active']);
  
  logActivity(email, 'register', 'success');
  
  return createResponse(true, 'Registration successful');
}

// ============================================
// FORGOT PASSWORD HANDLER
// ============================================
function handleForgotPassword(e) {
  const email = e.parameter.email;
  
  if (!email) {
    return createResponse(false, 'Email is required');
  }
  
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      const name = data[i][2];
      const password = data[i][1];
      
      // Send email with password (In production, you'd reset password instead)
      try {
        MailApp.sendEmail({
          to: email,
          subject: 'PR Boutique - Password Recovery',
          htmlBody: `
            <h2>Hello ${name},</h2>
            <p>Your password is: <strong>${password}</strong></p>
            <p>We recommend changing your password after logging in.</p>
            <br>
            <p>If you didn't request this, please contact us immediately.</p>
            <p><strong>PR Boutique Team</strong></p>
          `
        });
        
        logActivity(email, 'forgot_password', 'email sent');
        return createResponse(true, 'Password has been sent to your email');
      } catch (error) {
        return createResponse(false, 'Failed to send email. Please contact us.');
      }
    }
  }
  
  return createResponse(false, 'Email not found');
}

// ============================================
// GET STUDENT DATA HANDLER
// ============================================
function handleGetStudentData(e) {
  const email = e.parameter.email;
  
  if (!email) {
    return createResponse(false, 'Email is required');
  }
  
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === email) {
      const studentData = {
        email: data[i][0],
        name: data[i][2],
        course: data[i][3],
        enrollmentDate: formatDate(data[i][4]),
        status: data[i][5]
      };
      return createResponse(true, 'Data retrieved', studentData);
    }
  }
  
  return createResponse(false, 'Student not found');
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get the sheet
function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['email', 'password', 'name', 'course', 'enrollmentDate', 'status']);
  }
  
  return sheet;
}

// Create JSON response
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// Log activity to a separate sheet
function logActivity(email, action, result) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = spreadsheet.getSheetByName('ActivityLog');
    
    if (!logSheet) {
      logSheet = spreadsheet.insertSheet('ActivityLog');
      logSheet.appendRow(['timestamp', 'email', 'action', 'result']);
    }
    
    logSheet.appendRow([new Date(), email, action, result]);
  } catch (error) {
    // Silent fail - don't break the main operation
    Logger.log('Failed to log activity: ' + error.message);
  }
}

// Format date
function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}
