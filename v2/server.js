const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Pre-seeded feedback records to demonstrate View feature immediately
const feedbacks = [
    {
        id: 1,
        studentName: 'Aarav Sharma',
        regNo: '24MIS0005',
        course: 'DevOps & Cloud Computing',
        category: 'Course Content',
        rating: 5,
        comments: 'Excellent coverage of Docker, Jenkins CI/CD, and Kubernetes hands-on labs.',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: 2,
        studentName: 'Priya Sundaram',
        regNo: '24MIS0012',
        course: 'Software Architecture & Design',
        category: 'Teaching & Guidance',
        rating: 4,
        comments: 'Great explanation of microservices and architectural design patterns.',
        submittedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        studentName: 'Rahul Verma',
        regNo: '24MIS0022',
        course: 'Containerization & Kubernetes',
        category: 'Lab & Infrastructure',
        rating: 4,
        comments: 'Lab systems work smoothly, Kubernetes cluster deployment was very insightful.',
        submittedAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
];

// API: Version & Student metadata
app.get('/api/info', (req, res) => {
    res.json({
        rollNumber: '24MIS0031',
        project: 'Feedback System',
        version: 'v2',
        features: [
            'Submit - Enter feedback (from v1)',
            'View - Display all feedback (new in v2)'
        ]
    });
});

// API: View / Get all feedback (v2 Feature)
app.get('/api/feedback', (req, res) => {
    res.json({
        success: true,
        total: feedbacks.length,
        data: feedbacks
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

    console.log(`[v2] New feedback added: ID #${newFeedback.id} from ${newFeedback.studentName}`);

    res.status(201).json({
        success: true,
        message: 'Feedback submitted and added to display list!',
        data: newFeedback
    });
});

// Fallback route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Feedback System [v2] running on port ${PORT}`);
    console.log(` Roll Number: 24MIS0031`);
    console.log(` Features: Submit + View all feedback`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`===============================================`);
});
