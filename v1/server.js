const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory feedback storage for Version 1
const feedbacks = [];

// API: Version & Student metadata
app.get('/api/info', (req, res) => {
    res.json({
        rollNumber: '24MIS0031',
        project: 'Feedback System',
        version: 'v1',
        feature: 'Submit - Enter feedback',
        description: 'Allows users to enter and submit student feedback records'
    });
});

// API: Submit Feedback (v1 Feature)
app.post('/api/feedback', (req, res) => {
    const { studentName, regNo, course, category, rating, comments } = req.body;

    if (!studentName || !regNo || !course || !rating || !comments) {
        return res.status(400).json({
            success: false,
            message: 'All required fields must be filled out.'
        });
    }

    const newFeedback = {
        id: feedbacks.length + 1,
        studentName: studentName.trim(),
        regNo: regNo.trim().toUpperCase(),
        course,
        category: category || 'General',
        rating: parseInt(rating, 10),
        comments: comments.trim(),
        submittedAt: new Date().toISOString()
    };

    feedbacks.push(newFeedback);

    console.log(`[v1] New feedback submitted by ${newFeedback.studentName} (${newFeedback.regNo})`);

    res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully!',
        data: newFeedback
    });
});

// Fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Feedback System [v1] running on port ${PORT}`);
    console.log(` Roll Number: 24MIS0031`);
    console.log(` Feature: Submit - Enter feedback`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`===============================================`);
});
