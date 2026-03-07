module.exports = (req, res) => {
  res.json({ 
    message: 'Vercel serverless function working!',
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET
    }
  });
};
