const 	express = require("express"),
	  	router = express.Router(),
		Post = require("../models/post"),
	  	Opportunity = require("../models/opportunity"),
	  	middleware = require("../middleware");


//multer setup=====================================================================
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});
//cloudinary setup================================================================
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dgthqwps1', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//=====================================================================================


//index route - admin dashboard
router.get("/",function(req,res){
	res.render("admin/index");
	
});

//pending posts===============================================================
//index route
router.get("/explore",function(req,res){
	Post.find({"isApproved":false},function(err,Posts){
		if(err){
			console.log(err);
		}
		else{
			res.render("admin/postindex",{posts:Posts});
		}
	});
});

//show route
router.get("/explore/:id",function(req,res){
	Post.findById(req.params.id,function(err,foundPost){
		if(err|| !foundPost ){
			console.log(err);
			res.render("/admin");
		}
		else{
			res.render("admin/postshow",{post:foundPost});
		}
	});
});

//update Route ====== Approve
router.put("/explore/:id",function(req,res){
	Post.findById(req.params.id,req.params.post,function(err,updatePost){
		if(err){
			console.log(err);
		}
		else{
			updatePost.isApproved=true;
			updatePost.save();
			res.redirect("/admin/explore");
		}
	});
});

//delete route ===== Delete
router.delete("/explore/:id",function(req,res){
	Post.findById(req.params.id,function(err,post){
		if(err){
			console.log(err);
		}
		else{		cloudinary.v2.uploader.destroy(post.imageId,function(err,deletePost){
				if(err){
					console.log(err);
				}
				else{
					post.remove();
					console.log("removed");
					res.redirect("/admin/explore");
				}
			});
		}
	});
});

//===================================================================
//pending opportunities==============================================
//index route
router.get("/opportunities",function(req,res){
	Opportunity.find({"isApproved":false},function(err,Opportunities){
		if(err){
			console.log(err);
		}
		else{
			res.render("admin/opportunityindex",{opportunities:Opportunities});
		}
	});
});

//show route
router.get("/opportunities/:id",function(req,res){
	Opportunity.findById(req.params.id,function(err,foundOpportunity){
		if(err|| !foundOpportunity ){
			console.log(err);
			res.render("/admin");
		}
		else{
			res.render("admin/opportunityshow",{opportunity:foundOpportunity});
		}
	});
});

//update Route ====== Approve
router.put("/opportunities/:id",function(req,res){
	Opportunity.findById(req.params.id,req.params.opportunity,function(err,updateOpportunity){
		if(err){
			console.log(err);
		}
		else{
			updateOpportunity.isApproved=true;
			updateOpportunity.save();
			res.redirect("/admin/opportunities");
		}
	});
});

router.delete("/opportunities/:id",function(req,res){
	Opportunity.findById(req.params.id,function(err,opportunity){
		if(err){
			console.log(err);
		}
		else{		cloudinary.v2.uploader.destroy(opportunity.imageId,function(err,deleteOpportunity){
				if(err){
					console.log(err);
				}
				else{
					opportunity.remove();
					console.log("removed");
					res.redirect("/admin/opportunities");
				}
			});
		}
	});
});



module.exports = router;