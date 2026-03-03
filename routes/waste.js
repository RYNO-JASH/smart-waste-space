const express = require('express');
const router = express.Router();
const Waste = require('../models/Waste');
const { analyzeWaste } = require('../utils/decisionEngine');

/**
 * POST /api/analyze
 * Body: { wasteType: String }
 * Runs the decision engine, saves the record, and returns the saved object.
 */
router.post('/analyze', async (req, res) => {
    try {
        const { wasteType } = req.body;

        if (!wasteType || typeof wasteType !== 'string' || wasteType.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'wasteType is required and must be a non-empty string.',
            });
        }

        const result = analyzeWaste(wasteType.trim());

        const wasteRecord = new Waste({
            wasteType: wasteType.trim(),
            ...result,
        });

        const saved = await wasteRecord.save();

        return res.status(201).json({
            success: true,
            data: saved,
        });
    } catch (error) {
        console.error('[POST /api/analyze] Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
        });
    }
});

/**
 * GET /api/history
 * Returns all waste records sorted by newest first.
 */
router.get('/history', async (req, res) => {
    try {
        const records = await Waste.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        console.error('[GET /api/history] Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
        });
    }
});

module.exports = router;
