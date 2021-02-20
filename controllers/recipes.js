const Recipe = require("../models/recipe");

exports.getRecipes = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const userId = req.query.userId;
    const searchedValue = req.query.search;

    // find all the recipes of the given user
    const recipeQuery = Recipe.find({ creator: userId });
    let fetchedRecipes;

    // if there is a search value
    if(searchedValue) {
        // find all the recipes that contain the search string 
        recipeQuery.find({ "name": { $regex: new RegExp(searchedValue, "i")} });
    }

    // if the data was paginated
    if (pageSize && currentPage) {
        // find only the recipes for the given page in the given page size
        recipeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    recipeQuery
        .then(documents => {
            fetchedRecipes = documents;

            // find all the recipes of the given user
            const userRecipeQuery = Recipe.find({ creator: userId });

            // find all the recipes that contain the search string 
            const userRecipeQueryWithSearch = userRecipeQuery.find({ "name": { $regex: new RegExp(searchedValue, "i")}});

            // if there is a search value
            return (searchedValue) 
             // user the query with the search string
             ? userRecipeQueryWithSearch.countDocuments()

             // otherwise, use the query without it
             : userRecipeQuery.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: "Recipes fetched successfully!",
                recipes: fetchedRecipes,
                maxRecipes: count
            });
        }).catch(error => {
            res.status(500).json({
                message: 'Fetching recipes failed!'
            });
        });
}

exports.createRecipe = (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    let recipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        url: req.body.url || '',
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        creator: req.userData.userId
    });

    if(req.file) {
        recipe.imagePath = url + "/images/" + req.file.filename;
    }

    recipe.save().then(createdRecipe => {
        res.status(201).json({
            message: "Recipe added successfully",
            recipe: {
                ...createdRecipe,
                id: createdRecipe._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Creating a recipe failed!'
        });
    });
}

exports.updateRecipe = (req, res, next) => {
    let imagePath = req.body.imagePath || '';
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename;
    }
    const recipe = new Recipe({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        url: req.body.url,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Recipe.updateOne({ _id: req.params.id }, recipe).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Update successful!" });
        } else {
            res.status(401).json({ message: "Not Authorized!" });
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Couldn\'t update recipe!'
        });
    });
}

exports.getRecipe = (req, res, next) => {
    Recipe.findById(req.params.id).then(recipe => {
        if (recipe) {
            res.status(200).json(recipe);
        } else {
            res.status(404).json({ message: "Recipe not found!" });
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching recipe failed!'
        });
    });;
}

exports.deleteRecipe = (req, res, next) => {
    Recipe.deleteOne({ _id: req.params.id }).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Deletion successful!" });
        } else {
            res.status(401).json({ message: "Not Authorized!" });
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Deleting post failed!'
        });
    });;;
}