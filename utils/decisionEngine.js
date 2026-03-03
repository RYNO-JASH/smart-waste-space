/**
 * Deterministic Decision Engine for Smart Waste Routing
 * Maps a given wasteType to classification, processing path, efficiency, and final product.
 * No randomness — all outputs are rule-based and reproducible.
 */

const WASTE_RULES = {
    'Organic / Food Waste': {
        classification: 'Organic',
        recommendedPath: 'Composting',
        efficiency: 72,
        finalProduct: 'Fertilizer Block',
    },
    'Plastic (PET)': {
        classification: 'Plastic',
        recommendedPath: 'Recycling',
        efficiency: 85,
        finalProduct: 'Recycled Plastic Pellets',
    },
    Glass: {
        classification: 'Glass',
        recommendedPath: 'Glass Recycling',
        efficiency: 80,
        finalProduct: 'Recycled Glass Material',
    },
};

const DEFAULT_RULE = {
    classification: 'Mixed',
    recommendedPath: 'Manual Sorting',
    efficiency: 50,
    finalProduct: 'Unprocessed Waste',
};

/**
 * @param {string} wasteType - The type of waste submitted by the user.
 * @returns {{ classification, recommendedPath, efficiency, finalProduct }}
 */
function analyzeWaste(wasteType) {
    const rule = WASTE_RULES[wasteType] || DEFAULT_RULE;
    return { ...rule };
}

module.exports = { analyzeWaste };
