const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Pre-seeded feedback records with diverse ratings & courses to showcase filtering & sorting
let feedbacks = [
    {
        id: 1,
        studentName: 'Aarav Sharma',
        regNo: '24MIS0005',
        course: 'DevOps & Cloud Computing',
        category: 'Course Content',
        rating: 5,
        comments: 'Excellent coverage of Docker, Jenkins CI/CD, and Kubernetes hands-on labs.',
        submittedAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
        id: 2,
        studentName: 'Bhavna Menon',
        regNo: '24MIS0012',
        course: 'Software Architecture & Design',
        category: 'Teaching & Guidance',
        rating: 3,
        comments: 'Content is good but needs more real-world microservice case studies.',
        submittedAt: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
        id: 3,
        studentName: 'Dev Patel',
        regNo: '24MIS0019',
        course: 'Containerization & Kubernetes',
        category: 'Lab & Infrastructure',
        rating: 4,
        comments: 'Minikube and cluster setup worked without issues in lab sessions.',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
        id: 4,
        studentName: 'Chandana R',
        regNo: '24MIS0024',
        course: 'DevOps & Cloud Computing',
        category: 'Teaching & Guidance',
        rating: 5,
        comments: 'Faculty explained Jenkins declarative pipelines with great practical examples.',
        submittedAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
        id: 5,
        studentName: 'Eashwar Kumar',
        regNo: '24MIS0029',
        course: 'Full Stack Web Development',
        category: 'Evaluation & Assessment',
        rating: 2,
        comments: 'Assignment deadlines were quite tight; need more time for lab submissions.',
        submittedAt: new Date(Date.now() - 3600000 * 3).toISOString()
    }
];

// API: Version & Student metadata
app.get('/api/info', (req, res) => {
    res.json({
        rollNumber: '24MIS0031',
        project: 'Feedback System',
        version: 'v3',
        features: [
            'Submit - Enter feedback (from v1)',
            'View - Display all feedback (from v2)',
            'Filter - Sort feedback entries (new in v3)'
        ]
    });
});

// API: Filter & Sort feedback entries (v3 Feature)
app.get('/api/feedback', (req, res) => {
    let result = [...feedbacks];
    const { rating, course, search, sortBy } = req.query;

    // Filter by Rating
    if (rating && rating !== 'all') {
        const targetRating = parseInt(rating, 10);
        result = result.filter(item => item.rating === targetRating);
    }

    // Filter by Course
    if (course && course !== 'all') {
        result = result.filter(item => item.course.toLowerCase() === course.toLowerCase());
    }

    // Filter by Search Query
    if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        result = result.filter(item =>
            item.studentName.toLowerCase().includes(q) ||
            item.regNo.toLowerCase().includes(q) ||
            item.comments.toLowerCase().includes(q) ||
            item.course.toLowerCase().includes(q)
        );
    }

    // Sort entries
    if (sortBy) {
        switch (sortBy) {
            case 'rating-desc':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-asc':
                result.sort((a, b) => a.rating - b.rating);
                break;
            case 'date-asc':
                result.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
                break;
            case 'name-asc':
                result.sort((a, b) => a.studentName.localeCompare(b.studentName));
                break;
            case 'date-desc':
            default:
                result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
                break;
        }
    } else {
        // Default sort: Newest first
        result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }

    // Calculate analytics
    const totalCount = feedbacks.length;
    const avgRating = totalCount > 0 
        ? (feedbacks.reduce((sum, cur) => sum + cur.rating, 0) / totalCount).toFixed(1)
        : 0;

    res.json({
        success: true,
        total: totalCount,
        count: result.length,
        avgRating,
        data: result
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

    feedbacks.unshift(newFeedback); // Add to beginning

    console.log(`[v3] Feedback added: ID #${newFeedback.id} (${newFeedback.studentName}) - ${newFeedback.rating} stars`);

    res.status(201).json({
        success: true,
        message: 'Feedback submitted and integrated into filter & sort view!',
        data: newFeedback
    });
});

// Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Feedback System [v3] running on port ${PORT}`);
    console.log(` Roll Number: 24MIS0031`);
    console.log(` Features: Submit + View + Filter & Sort`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(`===============================================`);
});
