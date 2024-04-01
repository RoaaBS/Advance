const express = require("express");
const router = express.Router();
const { ResourceSharing, validateResourceSharing } = require("../models/resourceSharing");

/**
 * Get all available resources
 * @route /api/resourceSharing
 * @method GET
 * @access Public
 */
router.get("/", async (req, res) => {
    try {
        const resources = await ResourceSharing.find({ availability: 'available' });
       
     res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * Get resources offered by a specific user
 * @route  /api/resourceSharing/:id
 * @method GET
 * @access Public
 */
router.get("/:id", async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const resource = await ResourceSharing.findOne({ UserID: userId });

        if (resource) {
            res.status(200).json({ resource: resource });
        } else {
            res.status(404).json({ message: " not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


/**
 * Add a new resource
 * @route /api/resourceSharing
 * @method POST
 * @access Public
 */
router.post("/", async (req, res) => {
    const { error } = validateResourceSharing(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const resource = new ResourceSharing({
        userId: req.body.userId,
        itemName: req.body.itemName,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        availability: req.body.availability
    });

    try {
        const newResource = await resource.save();
        res.status(201).json(newResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * Update resource details
 * @route /api/resourceSharing/:id
 * @method PUT
 * @access Public
 */
router.put("/:id", async (req, res) => {
    const resourceput= await ResourceSharing.findByIdAndUpdate(req.params.id, { 
        $set: {
            userId: req.body.userId,
            itemName: req.body.itemName,
            description: req.body.description,
            category: req.body.category,
            location: req.body.location,
            availability: req.body.availability
        }
    }, { new: true });
  
    res.status(200).json(resourceput);
  });
  
/**
 * Delete a resource
 * @route /api/resourceSharing/:id
 * @method DELETE
 * @access Public
 */
router.delete("/:id", async (req, res) => {
    const deleteresource = await ResourceSharing.findById(req.params.id); 
    if (deleteresource) {
      await ResourceSharing.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Resource has been deleted" });
  } else {
      res.status(404).json({ message: "Resource not found" });
  }
});

module.exports = router;